import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "playwright";
import { serveExport } from "./lib/export-preview.mjs";

const site = await serveExport();
let browser;
const errors = [],
  missing = [];
const routes = [
  "/",
  "/about/",
  "/work/",
  "/brief/",
  "/contact/",
  "/training/",
  "/offer/",
  "/privacy/",
  "/services/websites/",
  "/services/mini-apps/",
  "/services/bots/",
  "/services/automation/",
  "/style/",
  "/lab/",
];
const attribute = (html, tag, key, value, attr) =>
  [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "g"))]
    .find((m) => m[0].includes(`${key}="${value}"`))?.[0]
    .match(new RegExp(`${attr}="([^"]*)"`))?.[1];
await mkdir("shots/release", { recursive: true });
try {
  browser = await chromium.launch(
    process.env.CHROMIUM_PATH
      ? { executablePath: process.env.CHROMIUM_PATH }
      : process.platform === "win32"
        ? { channel: "msedge" }
        : {},
  );
  const canonical = attribute(site.home, "link", "rel", "canonical", "href");
  assert(canonical, "Homepage needs a canonical");
  const production = canonical.replace(/\/$/, "");
  for (const route of routes) {
    const response = await fetch(site.url + route);
    assert.equal(response.status, 200, route);
    const html = await response.text();
    assert.equal(
      attribute(html, "link", "rel", "canonical", "href"),
      production + route,
      `${route}: canonical`,
    );
    for (const [key, name] of [
      ["property", "og:image"],
      ["name", "twitter:image"],
    ]) {
      const asset = attribute(html, "meta", key, name, "content");
      assert.equal(asset, production + "/og.png", `${route}: ${name}`);
      assert.equal(
        (await fetch(site.origin + new URL(asset).pathname)).status,
        200,
        `${route}: preview image`,
      );
    }
  }
  assert(
    Buffer.byteLength(site.home) < 500_000,
    "Inline meshes must not return to the HTML",
  );
  console.log(
    `PASS 14 routes: canonical, OG/Twitter image, export prefix ${site.basePath || "/"}, home ${Buffer.byteLength(site.home)} bytes`,
  );

  for (const width of [320, 375, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 812 },
      reducedMotion: "reduce",
    });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) missing.push(r.url());
    });
    await page.goto(site.url + "/", { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `header overflow ${width}`,
    );
    if (width < 1024) {
      const menu = page.getByRole("button", {
        name: "Открыть меню",
        exact: true,
      });
      const box = await menu.boundingBox();
      assert(
        box.x >= 0 && box.x + box.width <= width,
        `menu outside viewport ${width}`,
      );
      await menu.click();
      await page.getByRole("dialog", { name: "Меню сайта" }).waitFor();
      await page.keyboard.press("Escape");
      assert.equal(
        await menu.evaluate((e) => e === document.activeElement),
        true,
      );
    }
    for (const image of await page.locator("img.sculpture-object").all()) {
      await image.evaluate(async (e) => {
        e.loading = "eager";
        await e.decode();
      });
      assert.equal(await image.evaluate((e) => e.naturalWidth), 400);
    }
    assert(
      (await page.locator("polygon").count()) < 100,
      "Decorative meshes should be external SVGs",
    );
    await page.screenshot({ path: `shots/release/home-${width}.png` });
    if (width < 768) assert.equal(await page.locator('.floating-contact').isVisible(), true, 'Contact shortcut is available away from demos and contact sections');
    await page.locator(".facts-grid").first().scrollIntoViewIfNeeded();
    for (const label of await page.locator(".fact-label").all()) {
      assert.equal(
        await label.evaluate((e) => e.scrollWidth > e.clientWidth + 1),
        false,
        `Clipped fact label ${width}`,
      );
    }
    const cta = page.locator(".cta-band").last();
    await cta.scrollIntoViewIfNeeded();
    if (width < 768) {
      await page.waitForFunction(() =>
        document
          .querySelector(".floating-contact")
          ?.hasAttribute("data-contact-visible"),
      );
      assert.equal(
        await page.locator(".floating-contact").isVisible(),
        false,
        "Floating contact covers CTA",
      );
      for (const link of await cta.locator(".cta-actions a").all()) {
        assert.equal(
          await link.evaluate((e) => e.scrollWidth > e.clientWidth + 1),
          false,
          "CTA button overflows",
        );
        assert(
          (await link.boundingBox()).height <= 50,
          "Contact button should fit on one line",
        );
      }
      const card = await cta.boundingBox(),
        footer = await page.locator("footer").boundingBox();
      assert(
        footer.y - card.y - card.height <= 80,
        "Excessive empty gap before footer",
      );
    }
    await page
      .locator(".facts-grid")
      .first()
      .screenshot({ path: `shots/release/facts-${width}.png` });
    await cta.screenshot({ path: `shots/release/cta-${width}.png` });
    await page.goto(site.url + "/brief/", { waitUntil: "networkidle" });
    // On a fresh document, the first Tab must reach the bypass link.
    await page.keyboard.press("Tab");
    assert.equal(
      await page
        .getByRole("link", { name: "К основному содержимому" })
        .evaluate((e) => e === document.activeElement),
      true,
    );
    await page.keyboard.press("Enter");
    assert.equal(
      await page
        .locator("#main-content")
        .evaluate((e) => e === document.activeElement),
      true,
    );
    const steps = page
      .getByRole("list", { name: "Шаги брифа" })
      .getByRole("button");
    for (const button of await steps.all()) {
      assert.match(await button.getAttribute("aria-label"), /^Шаг [1-4]: /);
      const box = await button.boundingBox();
      assert(box.height >= 48 && box.width >= 48, "Brief step touch target");
    }
    await page
      .getByRole("button", {
        name: "Сайты и лендинги от 120 000 ₸",
        exact: true,
      })
      .click();
    await page.getByRole("button", { name: /Лендинг от 120 000/ }).waitFor();
    await page.waitForFunction(
      () => document.activeElement?.tagName === "FIELDSET",
    );
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `brief overflow ${width}`,
    );
    await page.screenshot({ path: `shots/release/brief-${width}.png` });
    await page.close();
    console.log(
      `PASS ${width}: header, menu, SVGs, skip link, brief targets/names/focus, no overflow`,
    );
  }

  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 812 } });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(site.url + "/", { waitUntil: "networkidle" });
    // Sample both the reported dead interval and every later boundary, in both directions.
    for (const at of [
      0.15, 0.165, 0.3, 0.42, 0.54, 0.65, 0.76, 0.88, 1, 0.54, 0.165, 0,
    ]) {
      await page.locator(".cine").evaluate((section, at) => {
        const range =
          section.offsetHeight -
          section.querySelector("canvas").getBoundingClientRect().height;
        scrollTo({
          top: section.getBoundingClientRect().top + scrollY + range * at,
          behavior: "instant",
        });
      }, at);
      await page.waitForFunction((at) => {
        const transform = getComputedStyle(
          document.querySelector(".cine-progress-bar"),
        ).transform;
        const scale = Number(transform.match(/^matrix\(([^,]+)/)?.[1]);
        return Math.abs(scale - at) < 0.002;
      }, at);
      const state = await page.locator("[data-ch]").evaluateAll((es) => ({
        opacities: es.map((e) => Number(e.style.opacity)),
        interactive: es.filter((e) => !e.inert).length,
      }));
      assert(
        Math.max(...state.opacities) === 1,
        `blank hero ${width} at ${at}`,
      );
      assert(Math.abs(state.opacities.reduce((a, b) => a + b, 0) - 1) < 0.003);
      assert.equal(
        state.opacities.filter((value) => value > 0).length,
        1,
        "Text chapters must not overlap",
      );
      assert.equal(state.interactive, 1);
      if (at === 0.165)
        await page.screenshot({
          path: `shots/release/hero-transition-${width}.png`,
        });
    }
    await page.close();
    console.log(
      `PASS hero ${width}: no blank intervals, forward/backward scroll, only active chapter accepts input`,
    );
  }
  assert.deepEqual(errors, []);
  assert.deepEqual(missing, []);
  await browser?.close();
  // Reuse the existing complete demo scenarios against the same prefixed export.
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/check-demos.mjs"], {
      stdio: "inherit",
      env: { ...process.env, DEMO_TEST_URL: site.url },
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(Error(`Demo checks failed: ${code}`)),
    );
  });
  console.log("PASS release regression checks");
} finally {
  await browser?.close();
  await site.close();
}
