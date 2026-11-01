/**
 * Quick visual check: full-page screenshots of a running server at desktop
 * and phone widths. Usage: npx tsx scripts/shot.ts <url> <outdir>
 */
import { mkdirSync } from "node:fs";
import path from "node:path";

import { chromium } from "playwright-core";

const EXECUTABLE = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";

async function main() {
  const [url = "http://localhost:3000", outDir = "shots"] = process.argv.slice(2);
  mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({
    executablePath: EXECUTABLE,
    args: ["--no-sandbox"],
  });
  for (const [name, width, height] of [
    ["desktop", 1440, 900],
    ["phone", 390, 844],
  ] as const) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log("done:", outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
