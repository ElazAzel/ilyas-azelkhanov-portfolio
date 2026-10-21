// Smoke test for the brief receipt, ⌘K palette, contact status and next-service link. Needs `pnpm preview` on :3000.
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
const OUT = "shots/extras";
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch(process.platform === "win32" ? { channel: "msedge" } : {});
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); console.log(cond ? "✓" : "✗", msg); };

for (const width of [1440, 375]) {
  const page = await browser.newPage({ viewport: { width, height: width < 500 ? 812 : 900 }, isMobile: width < 500, hasTouch: width < 500 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

  // Brief
  await page.goto("http://localhost:3000/brief/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Сайты и лендинги/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Корпоративный сайт/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /В течение месяца/ }).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Логотип/ }).click();
  await page.getByRole("button", { name: /Тексты/ }).click();
  await page.locator("textarea").fill("Студия интерьеров, нужен сайт с портфолио");
  await page.screenshot({ path: `${OUT}/brief-step4-${width}.png`, fullPage: true });
  await page.getByRole("button", { name: "Готово", exact: true }).click();
  await page.waitForTimeout(900);
  const href = await page.getByRole("link", { name: /Отправить в WhatsApp/ }).getAttribute("href");
  const text = decodeURIComponent(href.split("text=")[1] ?? "");
  ok(text.includes("Корпоративный сайт") && text.includes("логотип, тексты") && text.includes("Студия интерьеров"), `brief message complete (${width})`);
  ok((await page.locator(".t-price").first().innerText()).includes("250"), `brief price rolled to 250 000 (${width})`);
  await page.screenshot({ path: `${OUT}/brief-done-${width}.png`, fullPage: true });

  if (width > 500) {
    // Keyboard on brief
    await page.goto("http://localhost:3000/brief/", { waitUntil: "networkidle" });
    await page.keyboard.press("3");
    await page.waitForTimeout(400);
    ok(await page.getByText("2/4").isVisible(), "digit key picks option and advances");
  }

  // Palette (wait for hydration: the shortcut listener attaches on the client)
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(3000);
  if (width > 500) await page.keyboard.press("Control+k");
  else await page.getByRole("button", { name: "Поиск по сайту" }).click();
  await page.waitForSelector(".cmdk-dialog[open]");
  await page.keyboard.type(",jn");
  await page.waitForTimeout(300);
  ok(await page.getByRole("option", { name: /Telegram-боты/ }).isVisible(), `palette: wrong layout ",jn" finds боты (${width})`);
  await page.screenshot({ path: `${OUT}/palette-${width}.png` });
  await page.keyboard.press("Enter");
  await page.waitForURL(/services\/bots/);
  ok(true, `palette Enter navigates (${width})`);
  await page.waitForTimeout(800);
  await page.locator(".next-service").scrollIntoViewIfNeeded();
  ok(await page.locator(".next-service").innerText().then((t) => t.includes("AI-автоматизация")), `next service after bots is automation (${width})`);
  await page.locator(".next-service").screenshot({ path: `${OUT}/next-${width}.png` });

  // Contact
  await page.goto("http://localhost:3000/contact/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  const clock = await page.locator(".fact-num").first().innerText();
  ok(/^\d\d:\d\d$/.test(clock), `contact clock shows Almaty time ${clock} (${width})`);
  await page.screenshot({ path: `${OUT}/contact-${width}.png`, fullPage: true });

  // Home about strip
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.locator('[data-xray="AboutStrip"]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1300);
  await page.locator('[data-xray="AboutStrip"]').screenshot({ path: `${OUT}/about-strip-${width}.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(overflow <= 0, `no horizontal overflow on home (${width})`);
  ok(errors.length === 0, `no console errors (${width}) ${errors.join(" | ")}`);
  await page.close();
}
await browser.close();
if (fails.length) { console.log("\nFAILED:", fails); process.exit(1); }
