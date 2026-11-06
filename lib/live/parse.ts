/**
 * Parsers for the projects' own public files (llms.txt, sitemaps, the
 * homepage stats strip). Pure functions, so they are unit-tested
 * (parse.test.ts); each returns null when the expected shape is missing,
 * and the caller then keeps the committed snapshot.
 */

const toInt = (s: string) => Number(s.replace(/[,\s ]/g, ""));

/** Every <loc> URL in a sitemap or sitemap index. */
export function locs(xml: string): string[] {
  return Array.from(xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g), (m) => m[1]);
}

/** AirdropStop llms.txt: "a directory of 456 crypto airdrops (267 live, 84 potential)". */
export function airdropSummary(llms: string): { tracked: number; live: number } | null {
  const m = llms.match(/directory of ([\d,]+) crypto airdrops \(([\d,]+) live\b/i);
  return m ? { tracked: toInt(m[1]), live: toInt(m[2]) } : null;
}

/** aiwizard llms-full.txt: "10431 AI tools, each with its own review". */
export function llmsFullToolCount(text: string): number | null {
  const m = text.match(/^([\d,]+) AI tools\b/m);
  return m ? toInt(m[1]) : null;
}

/** aiwizard sitemap: every URL is a prerendered page; categories are /categories/<slug>. */
export function aiwizardSitemap(xml: string): { pages: number; categories: number } | null {
  const all = locs(xml);
  if (all.length === 0) return null;
  const categories = all.filter((u) => /^https?:\/\/[^/]+\/categories\/[^/]+\/?$/.test(u)).length;
  return { pages: all.length, categories };
}

/**
 * buybitcoinsmart sitemap index: one file per page type ("compare.xml"),
 * plus a copy per language ("compare-de.xml"). A two-letter suffix seen
 * on at least three files is a language; the rest are the base files.
 */
export function bbsIndex(xml: string): { base: string[]; languages: number } | null {
  const children = locs(xml);
  const suffix = (u: string) => u.match(/-([a-z]{2})\.xml$/)?.[1] ?? null;
  const tally = new Map<string, number>();
  for (const u of children) {
    const s = suffix(u);
    if (s) tally.set(s, (tally.get(s) ?? 0) + 1);
  }
  const languages = new Set([...tally].filter(([, n]) => n >= 3).map(([s]) => s));
  const base = children.filter((u) => {
    const s = suffix(u);
    return !s || !languages.has(s);
  });
  return base.length > 0 ? { base, languages: languages.size + 1 } : null;
}

/**
 * The base files list every page once, with an hreflang alternate per
 * language, so the distinct URLs among them are all the site's pages.
 * Comparisons are /compare/<a>-vs-<b> pages (not the /compare index).
 */
export function bbsPageStats(baseFiles: string[]): { pages: number; comparisons: number } {
  const pages = new Set<string>();
  let comparisons = 0;
  for (const xml of baseFiles) {
    for (const u of locs(xml)) {
      pages.add(u);
      if (/\/compare\/[^/]+$/.test(u)) comparisons += 1;
    }
    for (const m of xml.matchAll(/hreflang="([^"]+)"\s+href="([^"]+)"/g)) {
      if (m[1] !== "x-default") pages.add(m[2]);
    }
  }
  return { pages: pages.size, comparisons };
}

/** Ilusalong24 homepage stats strip: "409 salongi 35 linna 111 teenust". */
export function ilusalongStats(html: string): { salons: number; towns: number } | null {
  const text = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;| /g, " ")
    .replace(/\s+/g, " ");
  const m = text.match(/(\d+) salongi (\d+) linna \d+ teenust/);
  return m ? { salons: toInt(m[1]), towns: toInt(m[2]) } : null;
}

/** AI Angels: one /chat/<slug> page per companion. */
export function countChatPages(xml: string): number {
  return locs(xml).filter((u) => /\/chat\/[^/]+\/?$/.test(u)).length;
}
