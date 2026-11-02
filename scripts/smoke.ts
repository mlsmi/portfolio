/**
 * Post-build smoke check against a running server (local or deployed).
 * Usage: npx tsx scripts/smoke.ts [baseUrl]
 */
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

let failures = 0;

function check(name: string, ok: boolean, detail = "") {
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? ` (${detail})` : ""}`);
  if (!ok) failures++;
}

async function main() {
  const res = await fetch(`${base}/`);
  const html = await res.text();
  check("home responds 200", res.status === 200, String(res.status));
  check("title present", html.includes("Meelis Mikiver"));
  // The hero role decrypts client-side (components/encrypted-text.tsx);
  // the server HTML must still carry the real words for crawlers.
  const h1 = html.match(/<h1[\s\S]*?<\/h1>/)?.[0] ?? "";
  check("hero h1 has the real role text", h1.includes("Full-Stack AI Engineer"));
  for (const anchor of ['id="activity"', 'id="work"', 'id="stack"', 'id="contact"']) {
    check(`section ${anchor}`, html.includes(anchor));
  }
  const rects = html.match(/<rect /g)?.length ?? 0;
  check("heatmap has a year of cells", rects >= 300, `${rects} rects`);
  const cards = html.match(/<article/g)?.length ?? 0;
  check("eight project cards", cards === 8, `${cards} articles`);
  check("JSON-LD person", html.includes('"@type":"Person"'));
  check("OG image tag", html.includes("/og.png"));
  check("no em dashes in page text", !html.includes("—"));

  const robots = await fetch(`${base}/robots.txt`);
  check("robots.txt", robots.status === 200);
  const sitemap = await fetch(`${base}/sitemap.xml`);
  check("sitemap.xml", sitemap.status === 200);
  const og = await fetch(`${base}/og.png`);
  check("og.png", og.status === 200 && (og.headers.get("content-type") ?? "").includes("png"));

  // Contact endpoint: malformed body answers 400; GET is 405. Never sends.
  const bad = await fetch(`${base}/api/contact`, { method: "POST", body: "not json" });
  check("contact rejects malformed body", bad.status === 400, String(bad.status));
  const get = await fetch(`${base}/api/contact`);
  check("contact refuses GET", get.status === 405, String(get.status));

  if (failures > 0) {
    console.error(`\n${failures} smoke check(s) failed`);
    process.exit(1);
  }
  console.log("\nAll smoke checks passed");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
