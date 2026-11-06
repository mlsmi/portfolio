import { SNAPSHOT, isLiveKey, type LiveKey, type LiveValues } from "./keys";
import {
  aiwizardSitemap,
  airdropSummary,
  bbsIndex,
  bbsPageStats,
  countChatPages,
  ilusalongStats,
  llmsFullToolCount,
  locs,
} from "./parse";

const TIMEOUT_MS = 12000;
const USER_AGENT = "meelismikiver.com portfolio (project stats)";

/**
 * Raw bodies are not cached (sitemaps run to several MB, past the data
 * cache's 2 MB item limit); the computed numbers are, in lib/live/index.ts.
 */
async function text(url: string): Promise<string> {
  const res = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { "user-agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.text();
}

type Found = Partial<Record<LiveKey, number>>;

/**
 * One source per site, each reading only that site's own public files.
 * Each runs independently: one failing never affects the others.
 */
const SOURCES: Record<string, () => Promise<Found>> = {
  airdropstop: async () => {
    const s = airdropSummary(await text("https://www.airdropstop.com/llms.txt"));
    return s ? { "airdropstop.tracked": s.tracked, "airdropstop.live": s.live } : {};
  },
  "aiwizard tools": async () => {
    const n = llmsFullToolCount(await text("https://www.aiwizard.ai/llms-full.txt"));
    return n ? { "aiwizard.tools": n } : {};
  },
  "aiwizard sitemap": async () => {
    const s = aiwizardSitemap(await text("https://www.aiwizard.ai/sitemap.xml"));
    return s ? { "aiwizard.pages": s.pages, "aiwizard.categories": s.categories } : {};
  },
  buybitcoinsmart: async () => {
    const index = bbsIndex(await text("https://www.buybitcoinsmart.com/sitemap.xml"));
    if (!index) return {};
    const s = bbsPageStats(await Promise.all(index.base.map(text)));
    return {
      "bbs.types": index.base.length,
      "bbs.languages": index.languages,
      "bbs.pages": s.pages,
      "bbs.comparisons": s.comparisons,
    };
  },
  ilusalong24: async () => {
    const s = ilusalongStats(await text("https://ilusalong24.ee/"));
    return s ? { "ilusalong.salons": s.salons, "ilusalong.towns": s.towns } : {};
  },
  aiangels: async () => {
    const children = locs(await text("https://www.aiangels.io/sitemap.xml")).filter((u) => /\/sitemap\/\d+\.xml$/.test(u));
    const counts = await Promise.all(children.map(async (u) => countChatPages(await text(u))));
    const n = counts.reduce((a, b) => a + b, 0);
    return n ? { "aiangels.companions": n } : {};
  },
};

/** Counts that legitimately swing (campaigns end) get a wider lower band. */
const FLOOR: Partial<Record<LiveKey, number>> = { "airdropstop.live": 0.1 };

/** A parse bug must never put "0 tools" on the page: stay near the snapshot. */
export function plausible(key: LiveKey, n: number): boolean {
  const base = SNAPSHOT.values[key];
  return Number.isInteger(n) && n > 0 && n >= base * (FLOOR[key] ?? 0.5) && n <= base * 20;
}

export type LiveNumbers = { values: LiveValues; live: LiveKey[] };

/**
 * Never throws: every number starts as the committed snapshot and is
 * replaced only by a plausible value read from the project's own site.
 * Plain async (also used by scripts/refresh-live.ts); the page goes
 * through the cached wrapper in lib/live/index.ts.
 */
export async function getLiveNumbers(): Promise<LiveNumbers> {
  const values: LiveValues = { ...SNAPSHOT.values };
  const live: LiveKey[] = [];
  const names = Object.keys(SOURCES);
  const results = await Promise.allSettled(names.map((name) => SOURCES[name]()));
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.warn(`[live] ${names[i]}: ${result.reason instanceof Error ? result.reason.message : result.reason}`);
      return;
    }
    for (const [key, n] of Object.entries(result.value)) {
      if (!isLiveKey(key) || typeof n !== "number") continue;
      if (plausible(key, n)) {
        values[key] = n;
        live.push(key);
      } else {
        console.warn(`[live] ${key}: implausible value ${n}, keeping ${values[key]}`);
      }
    }
  });
  return { values, live };
}
