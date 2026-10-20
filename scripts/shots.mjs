// Screenshots of every exported route at 375 / 768 / 1440 into ./shots.
// Usage: pnpm build && pnpm shots [route ...]
import { createServer } from "node:http";
import { readFile, mkdir, stat } from "node:fs/promises";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const OUT = new URL("../out/", import.meta.url).pathname;
const SHOTS = new URL("../shots/", import.meta.url).pathname;
const ROUTES = process.argv.slice(2).length ? process.argv.slice(2) : ["/", "/style/"];
const WIDTHS = [375, 768, 1440];
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".png": "image/png", ".json": "application/json", ".txt": "text/plain" };

const server = createServer(async (req, res) => {
  let p = join(OUT, decodeURIComponent(new URL(req.url, "http://x").pathname));
  try {
    if ((await stat(p)).isDirectory()) p = join(p, "index.html");
    res.writeHead(200, { "content-type": TYPES[extname(p)] ?? "application/octet-stream" });
    res.end(await readFile(p));
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((r) => server.listen(4173, r));

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium" });
await mkdir(SHOTS, { recursive: true });
for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    await page.goto(`http://localhost:4173${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const name = (route.replace(/\//g, "_").replace(/^_|_$/g, "") || "home") + `-${width}.png`;
    await page.screenshot({ path: join(SHOTS, name), fullPage: true });
    console.log(`${name}${overflow > 0 ? `  ⚠ horizontal overflow ${overflow}px` : ""}${errors.length ? `  ⚠ ${errors.join(" | ")}` : ""}`);
    await page.close();
  }
}
await browser.close();
server.close();
