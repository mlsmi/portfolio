/**
 * Re-reads every live project number from the projects' own sites and
 * rewrites lib/live/snapshot.json (the fallback the page uses when a site
 * is unreachable). Usage: npm run live:refresh
 * With --check it only prints what it found and writes nothing.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";

import { SNAPSHOT } from "../lib/live/keys";
import { getLiveNumbers } from "../lib/live/numbers";

async function main() {
  const check = process.argv.includes("--check");
  const { values, live } = await getLiveNumbers();
  for (const key of Object.keys(values) as (keyof typeof values)[]) {
    const was = SNAPSHOT.values[key];
    const now = values[key];
    const state = live.includes(key) ? (now === was ? "live, unchanged" : `live, was ${was}`) : "NOT LIVE (snapshot kept)";
    console.log(`${key.padEnd(22)} ${String(now).padStart(7)}  ${state}`);
  }
  if (check) return;
  const date = new Date().toISOString().slice(0, 10);
  const file = path.join(__dirname, "../lib/live/snapshot.json");
  writeFileSync(file, `${JSON.stringify({ date, values }, null, 2)}\n`);
  console.log(`\nwrote ${path.relative(process.cwd(), file)} (${live.length}/${Object.keys(values).length} live)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
