import { serveExport } from "./lib/export-preview.mjs";
// Screenshots of every exported route at 375 / 768 / 1440 into ./shots.
// Usage: pnpm build && pnpm shots [route ...]
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const SHOTS = fileURLToPath(new URL("../shots/", import.meta.url));
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/style/"];
const WIDTHS = [375, 768, 1440];
const site = await serveExport();
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : process.platform === "win32" ? { channel: "msedge" } : {});
await mkdir(SHOTS, { recursive: true });
for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(site.url + route, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Full-page captures must load images below the viewport as well.
    await page.evaluate(async () => {
      await Promise.all(Array.from(document.images, async (img) => {
        img.loading = "eager";
        await img.decode().catch(() => {});
      }));
    });
    await page.waitForTimeout(Number(process.env.SHOTS_WAIT ?? 0));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = (route.replace(/\//g, "_").replace(/^_|_$/g, "") || "home") + `-${width}.png`;
    await page.screenshot({ path: join(SHOTS, name), fullPage: true });
    console.log(`${name}${overflow > 0 ? `  ⚠ horizontal overflow ${overflow}px` : ""}${errors.length ? `  ⚠ ${errors.join(" | ")}` : ""}`);
    await page.close();
  }
}
await browser.close();
await site.close();
