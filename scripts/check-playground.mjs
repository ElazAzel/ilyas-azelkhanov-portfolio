import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { chromium } from "playwright";
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".txt": "text/plain",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
};
const server = createServer(async (req, res) => {
  try {
    let p = join(
      process.cwd(),
      "out",
      decodeURIComponent(new URL(req.url, "http://local").pathname),
    );
    if ((await stat(p)).isDirectory()) p = join(p, "index.html");
    res.writeHead(200, {
      "content-type": mime[extname(p)] || "application/octet-stream",
    });
    res.end(await readFile(p));
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(4180, "127.0.0.1", r));
const browser = await chromium.launch(
  process.platform === "win32" ? { channel: "msedge" } : {},
);
const errors = [];
try {
  for (const width of [320, 375, 768, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4180/", { waitUntil: "networkidle" });
    const stage = page.locator("#playground");
    await stage.scrollIntoViewIfNeeded();
    const coffee = stage.locator("#project-panel-mini-apps");
    await coffee.locator(".pd").waitFor();
    await coffee
      .getByRole("button", { name: "Выбрать Капучино", exact: true })
      .click();
    await coffee.getByRole("button", { name: /Добавить в заказ/ }).click();
    await coffee.getByRole("button", { name: /Корзина · 1/ }).waitFor();
    for (const id of [
      "bots",
      "websites",
      "automation",
      "training",
      "mini-apps",
    ]) {
      await stage
        .getByRole("button", { name: "Следующий пример", exact: true })
        .click();
      const panel = stage.locator(`#project-panel-${id}`);
      await panel.locator(".pd").waitFor();
      assert.equal(await stage.locator(".playground-panel:visible").count(), 1);
      assert.equal(
        await stage
          .locator('.playground-choices button[aria-pressed="true"]')
          .getAttribute("id"),
        `project-choice-${id}`,
      );
      assert.equal(
        await panel
          .locator(".pd")
          .first()
          .evaluate((e) => e.scrollWidth > e.clientWidth + 1),
        false,
        `${id} internal overflow at ${width}`,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `${id} page overflow at ${width}`,
      );
      if (id === "websites") {
        await stage.evaluate((e) =>
          e.scrollIntoView({ block: "start", behavior: "instant" }),
        );
        await page.screenshot({ path: `shots/playground-${width}.png` });
      }
    }
    await coffee.getByRole("button", { name: /Корзина · 1/ }).waitFor();
    for (const button of await stage
      .locator(".playground-choices button")
      .all()) {
      if (!(await button.isVisible())) continue;
      const box = await button.boundingBox();
      assert(box.height >= 48 && box.width >= 48);
    }
    const choices = stage.locator(".playground-choices");
    if (width < 768) {
      const picker = stage.getByRole("combobox", { name: "Выберите проект" });
      await picker.selectOption("bots");
      const box = await picker.boundingBox();
      assert(box.height >= 48);
      assert.equal(await choices.isVisible(), false);
      assert.equal(await page.locator(".floating-contact").isVisible(), false);
    } else {
      await choices.getByRole("button", { name: /PITSTOP/ }).focus();
      await page.keyboard.press("Enter");
    }
    assert.equal(await stage.locator("#project-panel-bots").isVisible(), true);
    assert.equal(
      await stage.locator(".playground-stage-header a").getAttribute("href"),
      "/services/bots/",
    );
    assert.equal(
      await stage
        .locator("#project-panel-bots")
        .evaluate((e) => getComputedStyle(e).animationName),
      "none",
    );
    console.log(
      `PASS playground ${width}: five demos, retained coffee order, keyboard, next control, service links, touch targets, reduced motion, no overflow`,
    );
    await page.close();
  }
  for (const width of [375, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:4180/", { waitUntil: "networkidle" });
    assert.equal(
      await page.locator(".cine-steps, [data-cine-step]").count(),
      0,
    );
    for (const [index, at] of [
      [1, 0.3],
      [3, 0.76],
      [0, 0],
    ]) {
      await page.locator(".cine").evaluate((section, at) => {
        const canvas = section.querySelector("canvas");
        const range =
          section.offsetHeight - canvas.getBoundingClientRect().height;
        window.scrollTo({
          top: section.getBoundingClientRect().top + scrollY + range * at,
          behavior: "instant",
        });
      }, at);
      await page.waitForFunction(
        (index) =>
          document.querySelector(".cine").dataset.chapter === String(index),
        index,
      );
    }
    await page.screenshot({ path: `shots/scene-clean-${width}.png` });
    await stageShot(page, width);
    console.log(
      `PASS cinematic ${width}: no numbered overlay, scroll scenes and reverse navigation`,
    );
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS playground and cinematic scene: no JavaScript errors");
} finally {
  await browser.close();
  server.close();
}
async function stageShot(page, width) {
  const stage = page.locator("#playground");
  await stage.evaluate((e) =>
    e.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  await stage.locator(".pd").first().waitFor();
  if (width < 768) {
    await stage
      .getByRole("combobox", { name: "Выберите проект" })
      .selectOption("websites");
  } else {
    await stage
      .locator(".playground-choices")
      .getByRole("button", { name: /FORMA/ })
      .click();
  }
  const panel = stage.locator("#project-panel-websites");
  await panel.locator(".pd").waitFor();
  await page.waitForFunction(() =>
    document
      .querySelector("#project-panel-websites")
      .getAnimations()
      .every((a) => a.playState === "finished"),
  );
  await page.screenshot({ path: `shots/playground-motion-${width}.png` });
}
