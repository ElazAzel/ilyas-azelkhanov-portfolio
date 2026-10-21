// Viewport screenshots at scroll positions (real scrolling, not fullPage). Usage: node scripts/scrollshots.mjs /route width step count
import { chromium } from "playwright";
const [route = "/", width = "1440", step = "700", count = "10"] = process.argv.slice(2);
const SHOTS = process.env.OUTDIR ?? "shots/scroll";
import { mkdir } from "node:fs/promises";
await mkdir(SHOTS, { recursive: true });
const browser = await chromium.launch(process.platform === "win32" ? { channel: "msedge" } : {});
const page = await browser.newPage({ viewport: { width: +width, height: +width < 500 ? 812 : 900 }, deviceScaleFactor: 1, isMobile: +width < 500, hasTouch: +width < 500 });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(`http://localhost:3000${route}`, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const name = route.replace(/\//g, "_").replace(/^_|_$/g, "") || "home";
for (let i = 0; i < +count; i++) {
  await page.mouse.wheel(0, i === 0 ? 0 : +step);
  await page.waitForTimeout(900);
  const y = await page.evaluate(() => Math.round(scrollY));
  await page.screenshot({ path: `${SHOTS}/${name}-${width}-${String(i).padStart(2, "0")}.png` });
  console.log(i, y);
}
if (errors.length) console.log("errors:", errors);
await browser.close();
