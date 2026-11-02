/**
 * Captures the project screenshots for public/projects/: each live site at
 * 1600x1000 (device scale 2), compressed to WebP with ffmpeg. Local HTML
 * mocks (the internal admin card, the OG image) render through the same
 * browser. Gameplay videos are provided by the owner, not captured here.
 *
 * Usage: npx tsx scripts/capture.ts [outDir] [--only=slug,slug]
 * Designed for the dev container: Chromium at /opt/pw-browsers, ffmpeg
 * preinstalled, outbound HTTPS through the agent proxy (HTTPS_PROXY).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import { chromium, type Browser, type Page } from "playwright-core";

const EXECUTABLE = "/opt/pw-browsers/chromium-1243/chrome-linux64/chrome";
const OUT_DIR = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "public/projects";
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7).split(",");

// aiangels is deliberately absent: its image is an owner-supplied app
// screenshot (public/projects/aiangels.webp), never captured from the site.
const SITES: Array<{ slug: string; url: string; dark?: boolean }> = [
  { slug: "marsrally", url: "https://marsrallychampionship.com" },
  { slug: "agi", url: "https://www.aliengoatsinvasion.com" },
  // dark: sets prefers-color-scheme AND localStorage theme="dark" (all
  // three sites read one or the other before paint).
  { slug: "aiwizard", url: "https://www.aiwizard.ai", dark: true },
  { slug: "buybitcoinsmart", url: "https://www.buybitcoinsmart.com", dark: true },
  { slug: "airdropstop", url: "https://www.airdropstop.com", dark: true },
  { slug: "ilusalong24", url: "https://ilusalong24.ee" },
];

const CONSENT_LABELS = [
  "Accept cookies & continue",
  "Accept all",
  "Accept",
  "Agree",
  "I agree",
  "OK",
  "Got it",
  "Nõustun",
  "Luba kõik",
  "I'm 18 or older",
  "I am 18",
  "Enter",
];

async function dismissOverlays(page: Page) {
  for (const label of CONSENT_LABELS) {
    const button = page.getByRole("button", { name: label, exact: false }).first();
    try {
      if (await button.isVisible({ timeout: 300 })) {
        await button.click({ timeout: 1000 });
        await page.waitForTimeout(600);
      }
    } catch {
      // Not present: fine.
    }
  }
}

function toWebp(pngPath: string, webpPath: string) {
  for (const quality of [82, 72, 60]) {
    execFileSync("ffmpeg", [
      "-loglevel", "error", "-y",
      "-i", pngPath,
      "-vf", "scale=1600:-2:flags=lanczos",
      "-quality", String(quality),
      webpPath,
    ]);
    const kb = statSync(webpPath).size / 1024;
    if (kb <= 200) {
      console.log(`  ${path.basename(webpPath)} ${Math.round(kb)}KB (q${quality})`);
      return;
    }
  }
  console.log(`  ${path.basename(webpPath)} still over 200KB at q60; kept`);
}

async function captureSite(
  browser: Browser,
  { slug, url, dark }: { slug: string; url: string; dark?: boolean },
  tmp: string,
) {
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
    colorScheme: dark ? "dark" : "light",
    ignoreHTTPSErrors: true, // the agent proxy re-signs TLS
    ...(process.env.HTTPS_PROXY ? { proxy: { server: process.env.HTTPS_PROXY } } : {}),
  });
  const page = await context.newPage();
  if (dark) {
    await page.addInitScript(() => {
      try {
        localStorage.setItem("theme", "dark");
      } catch {
        // storage unavailable: the color-scheme emulation still applies
      }
    });
  }
  console.log(`${slug}: ${url}`);
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 }).catch(async () => {
    // networkidle can hang on long-polling sites; settle for load.
    await page.waitForLoadState("load");
  });
  await page.waitForTimeout(3000);
  await dismissOverlays(page);
  // Transient toasts and consent banners don't belong in a still.
  await page.addStyleTag({
    content:
      "[class*='toast' i], [role='alert'], [class*='cookie' i], [id*='cookie' i], [aria-label*='cookie' i] { visibility: hidden !important; }",
  });
  const pngPath = path.join(tmp, `${slug}.png`);
  await page.screenshot({ path: pngPath });
  await context.close();
  toWebp(pngPath, path.join(OUT_DIR, `${slug}.webp`));
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const tmp = path.join(os.tmpdir(), "portfolio-capture");
  mkdirSync(tmp, { recursive: true });
  const browser = await chromium.launch({
    executablePath: EXECUTABLE,
    args: ["--no-sandbox", "--use-gl=angle", "--enable-unsafe-swiftshader", "--hide-scrollbars"],
  });
  for (const site of SITES) {
    if (ONLY && !ONLY.includes(site.slug)) continue;
    try {
      await captureSite(browser, site, tmp);
    } catch (err) {
      console.error(`${site.slug}: FAILED`, err);
    }
  }
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
