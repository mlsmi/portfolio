import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { SNAPSHOT } from "./keys";
import { getLiveNumbers, plausible } from "./numbers";
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
import { resolveProject } from "./resolve";

const url = (u: string) => `<url><loc>${u}</loc></url>`;

describe("live project numbers: parsers", () => {
  it("reads AirdropStop's llms.txt summary", () => {
    const llms = "# AirdropStop\n\n> AirdropStop is a directory of 1,456 crypto airdrops (267 live, 84 potential). Each listing";
    assert.deepEqual(airdropSummary(llms), { tracked: 1456, live: 267 });
    assert.equal(airdropSummary("# AirdropStop\n\nNo summary here."), null);
  });

  it("reads aiwizard's tool count from llms-full.txt", () => {
    assert.equal(llmsFullToolCount("# aiwizard\n\n> intro\n\n10431 AI tools, each with its own review"), 10431);
    assert.equal(llmsFullToolCount("no count"), null);
  });

  it("counts aiwizard pages and top-level categories", () => {
    const xml = [
      "https://www.aiwizard.ai/",
      "https://www.aiwizard.ai/some-tool",
      "https://www.aiwizard.ai/categories/writing",
      "https://www.aiwizard.ai/categories/image/",
      "https://www.aiwizard.ai/categories/image/page/2",
      "https://www.aiwizard.ai/aitools/page/2",
    ]
      .map(url)
      .join("");
    assert.deepEqual(aiwizardSitemap(xml), { pages: 6, categories: 2 });
    assert.equal(aiwizardSitemap("<urlset></urlset>"), null);
  });

  it("splits buybitcoinsmart's sitemap index into base files and languages", () => {
    const kinds = ["pages", "compare", "state-leaves"];
    const langs = ["de", "es", "fr"];
    const files = kinds.flatMap((k) => [k, ...langs.map((l) => `${k}-${l}`)]);
    const xml = files.map((f) => `<sitemap><loc>https://x.com/sitemaps/sitemap/${f}.xml</loc></sitemap>`).join("");
    const index = bbsIndex(xml);
    assert.equal(index?.languages, 4);
    assert.deepEqual(
      index?.base.map((u) => u.split("/").pop()),
      ["pages.xml", "compare.xml", "state-leaves.xml"],
    );
  });

  it("counts buybitcoinsmart pages across hreflang alternates, and comparisons", () => {
    const entry = (path: string) =>
      `<url><loc>https://x.com${path}</loc>` +
      `<xhtml:link rel="alternate" hreflang="en" href="https://x.com${path}" />` +
      `<xhtml:link rel="alternate" hreflang="de" href="https://x.com/de${path}" />` +
      `<xhtml:link rel="alternate" hreflang="x-default" href="https://x.com${path}" /></url>`;
    const compare = ["/compare", "/compare/a-vs-b", "/compare/b-vs-c"].map(entry).join("");
    const pages = ["/", "/about"].map(entry).join("");
    assert.deepEqual(bbsPageStats([compare, pages]), { pages: 10, comparisons: 2 });
  });

  it("reads Ilusalong24's homepage stats strip", () => {
    const html =
      '<nav><a>Salongid</a></nav><div><span><b>409</b> salongi</span>&nbsp;<span><b>35</b> linna</span> <span><b>111</b> teenust</span></div><script>var x = "1 salongi 2 linna 3 teenust"</script>';
    assert.deepEqual(ilusalongStats(html), { salons: 409, towns: 35 });
    assert.equal(ilusalongStats("<p>Tere</p>"), null);
  });

  it("counts AI Angels companion chat pages", () => {
    const xml = [
      "https://www.aiangels.io/chat/sierra",
      "https://www.aiangels.io/chat/lennon/",
      "https://www.aiangels.io/chat",
      "https://www.aiangels.io/ai-girlfriend/sierra",
    ]
      .map(url)
      .join("");
    assert.equal(countChatPages(xml), 2);
    assert.equal(locs(xml).length, 4);
  });
});

describe("live project numbers: guard and resolve", () => {
  it("rejects values far from the snapshot", () => {
    const base = SNAPSHOT.values["aiwizard.tools"];
    assert.equal(plausible("aiwizard.tools", base + 50), true);
    assert.equal(plausible("aiwizard.tools", 0), false);
    assert.equal(plausible("aiwizard.tools", Math.floor(base * 0.4)), false);
    assert.equal(plausible("aiwizard.tools", base * 25), false);
    assert.equal(plausible("aiwizard.tools", base + 0.5), false);
    // Live campaigns legitimately swing: a wider lower band.
    assert.equal(plausible("airdropstop.live", Math.ceil(SNAPSHOT.values["airdropstop.live"] * 0.3)), true);
  });

  it("fills live values and label tokens, passing static metrics through", () => {
    const values = { ...SNAPSHOT.values, "bbs.pages": 52191, "bbs.languages": 10 };
    const shown = resolveProject(
      {
        slug: "x",
        name: "X",
        pitch: "",
        url: null,
        stack: [],
        contributions: { commits: 1, prs: 1 },
        metrics: [
          { live: "bbs.pages", label: "programmatic pages in {bbs.languages} languages" },
          { value: "~140/day", label: "clicks, {not.akey} stays" },
        ],
      },
      values,
      { commits: 5, prs: 2 },
    );
    assert.deepEqual(shown.metrics, [
      { value: "52,191", label: "programmatic pages in 10 languages" },
      { value: "~140/day", label: "clicks, {not.akey} stays" },
    ]);
    assert.deepEqual(shown.contributions, { commits: 5, prs: 2 });
  });
});

describe("live project numbers: every site down", () => {
  it("keeps the whole snapshot and never throws", async () => {
    const realFetch = globalThis.fetch;
    const realWarn = console.warn;
    globalThis.fetch = (async () => {
      throw new Error("offline");
    }) as typeof fetch;
    console.warn = () => {};
    try {
      const r = await getLiveNumbers();
      assert.deepEqual(r.values, SNAPSHOT.values);
      assert.deepEqual(r.live, []);
    } finally {
      globalThis.fetch = realFetch;
      console.warn = realWarn;
    }
  });
});
