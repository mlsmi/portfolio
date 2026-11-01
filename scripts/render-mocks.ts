/**
 * Renders the two local HTML mocks: the internal-system card for the admin
 * dashboard (public/projects/aiangels-admin.webp) and the OG image
 * (public/og.png). Usage: npx tsx scripts/render-mocks.ts
 */
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

import { chromium } from "playwright-core";

const EXECUTABLE = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";

async function main() {
  const tmp = os.tmpdir();
  const browser = await chromium.launch({ executablePath: EXECUTABLE, args: ["--no-sandbox"] });

  // Admin card: 1600x1000 like every other project screenshot.
  {
    const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
    await page.goto(pathToFileURL(path.resolve("scripts/mock-admin-card.html")).href);
    const png = path.join(tmp, "aiangels-admin.png");
    await page.screenshot({ path: png });
    await page.close();
    execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", png, "-quality", "85", "public/projects/aiangels-admin.webp"]);
  }

  // OG card: 1200x630 PNG (scrapers prefer PNG).
  {
    const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
    await page.goto(pathToFileURL(path.resolve("scripts/mock-og.html")).href);
    await page.screenshot({ path: "public/og.png" });
    await page.close();
  }

  await browser.close();
  console.log("mocks rendered");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
