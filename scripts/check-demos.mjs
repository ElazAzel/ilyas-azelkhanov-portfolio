import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createServer } from "node:http";
import { mkdir, readFile, stat } from "node:fs/promises";
import { join, extname } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../out/", import.meta.url));
const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};
const server = process.env.DEMO_TEST_URL
  ? null
  : createServer(async (req, res) => {
      try {
        let path = join(
          root,
          decodeURIComponent(new URL(req.url, "http://x").pathname),
        );
        if ((await stat(path)).isDirectory()) path = join(path, "index.html");
        res.writeHead(200, {
          "content-type": mime[extname(path)] || "application/octet-stream",
        });
        res.end(await readFile(path));
      } catch {
        res.writeHead(404).end();
      }
    });
if (server) await new Promise((r) => server.listen(4175, "127.0.0.1", r));
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH }
    : process.platform === "win32"
      ? { channel: "msedge" }
      : {},
);
const errors = [];
const base = process.env.DEMO_TEST_URL || "http://127.0.0.1:4175";
async function waitFor(check, message) {
  for (let i = 0; i < 60; i++) {
    if (await check()) return;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw Error(message);
}
async function open(page, path) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  const demo = page.locator("[data-demo]").first();
  await demo.scrollIntoViewIfNeeded();
  await demo.locator(".pd").first().waitFor();
  return demo;
}
async function checkTraining(page, width, edgeCases = false) {
  const d = await open(page, "/training/");
  const mobile = await d.locator(".workshop-progress").isVisible();
  if (mobile) {
    assert.equal(await d.locator(".workshop-program").isVisible(), false);
    assert.equal(await d.locator(".workshop-config-panel:visible").count(), 1);
    for (const button of await d.locator(".workshop-roles button").all()) {
      const box = await button.boundingBox();
      assert.ok(
        box.height >= 48 && box.width >= 48,
        "touch-sized department choices",
      );
      assert.equal(
        await button.evaluate((el) => {
          const range = document.createRange();
          range.selectNodeContents(el);
          const text = range.getBoundingClientRect();
          const box = el.getBoundingClientRect();
          return text.left >= box.left && text.right <= box.right;
        }),
        true,
        "department label fits inside its button",
      );
    }
    assert.equal(
      await d
        .getByLabel("Участники", { exact: true })
        .evaluate((el) => getComputedStyle(el).fontSize),
      "16px",
    );
  }
  await d.getByRole("button", { name: "HR", exact: true }).click();
  await d.getByLabel("Участники", { exact: true }).selectOption("l");
  await d
    .getByLabel("Площадка", { exact: true })
    .selectOption("Офлайн в Алматы");
  if (mobile)
    await d.getByRole("button", { name: "Далее: формат", exact: true }).click();
  await d.getByRole("button", { name: /^Курс/ }).click();
  if (mobile) {
    assert.match(
      await d.locator(".workshop-estimate").innerText(),
      /960\s*000/,
    );
    await d.getByRole("button", { name: "Далее: темы", exact: true }).click();
  }
  // The entire topic row is tappable, including its text.
  await d.locator(".workshop-topics label").first().click();
  assert.equal(await d.locator(".workshop-topics input:checked").count(), 4);
  if (mobile) {
    await d.getByRole("button", { name: "Назад: формат", exact: true }).click();
    assert.equal(
      await d
        .getByRole("button", { name: /^Курс/ })
        .getAttribute("aria-pressed"),
      "true",
    );
    await d.getByRole("button", { name: "Далее: темы", exact: true }).click();
    assert.equal(await d.locator(".workshop-topics input:checked").count(), 4);
    if (edgeCases) {
      for (let i = 1; i < 4; i++)
        await d.locator(".workshop-topics label").nth(i).click();
      assert.equal(
        await d.locator(".workshop-topics input:checked").count(),
        1,
      );
      assert.equal(
        await d.locator(".workshop-topics input:checked").isDisabled(),
        true,
      );
      await d.locator(".workshop-topics input").first().focus();
      await page.keyboard.press("Space");
      assert.equal(
        await d.locator(".workshop-topics input:checked").count(),
        2,
      );
      await page.keyboard.press("Space");
      assert.equal(
        await d.locator(".workshop-topics input:checked").count(),
        1,
      );
    }
    await d
      .getByRole("button", { name: "Посмотреть программу", exact: true })
      .click();
    await waitFor(
      () =>
        d
          .locator(".workshop-program")
          .evaluate((el) => document.activeElement === el),
      "program gets focus after step navigation",
    );
    assert.equal(await d.locator(".workshop-settings").isVisible(), false);
    assert.equal(
      await d
        .getByRole("button", { name: "Шаг 4: Программа", exact: true })
        .getAttribute("aria-current"),
      "step",
    );
    const nav = await d.locator(".workshop-progress").boundingBox();
    const header = await page.locator(".site-header").boundingBox();
    assert.ok(
      nav.y >= header.y + header.height - 1,
      "navigation clears the site header",
    );
    assert.equal(
      await page.locator(".floating-contact").isVisible(),
      false,
      "floating contact does not cover the builder",
    );
  }
  assert.equal(await d.locator(".workshop-timeline article").count(), 4);
  assert.match(
    await d.locator(".workshop-program > footer strong").innerText(),
    /960\s*000/,
  );
  const download = page.waitForEvent("download");
  // The download next to the price is reachable before scrolling through the agenda.
  await d
    .getByRole("button", { name: "Скачать программу", exact: true })
    .first()
    .click();
  const file = await download;
  assert.equal(file.suggestedFilename(), "ai-workshop-program.txt");
  const program = await readFile(await file.path(), "utf8");
  assert.match(
    program,
    /HR · 4 встречи по 2 часа · 21–40 человек · Офлайн в Алматы/,
  );
  assert.match(program, /960\s*000/);
  assert.equal((program.match(/Встреча \d/g) || []).length, 4);
  assert.match(
    await d
      .getByRole("link", { name: /Обсудить эту программу/ })
      .getAttribute("href"),
    /wa\.me/,
  );
  if (mobile && edgeCases) {
    await mkdir("shots/training-mobile", { recursive: true });
    await page.screenshot({
      path: `shots/training-mobile/result-${width}.png`,
    });
    if (width === 430) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      assert.equal(await d.locator(".workshop-progress").isVisible(), false);
      assert.equal(await d.locator(".workshop-settings").isVisible(), true);
      assert.equal(
        await d.locator(".workshop-config-panel:visible").count(),
        3,
      );
      assert.equal(await d.locator(".workshop-program").isVisible(), true);
      await page.setViewportSize({ width, height: 844 });
      assert.equal(await d.locator(".workshop-program").isVisible(), true);
      assert.equal(await d.locator(".workshop-settings").isVisible(), false);
    }
    await d
      .getByRole("button", { name: "Изменить настройки", exact: true })
      .click();
    assert.equal(
      await d
        .getByRole("button", { name: "HR", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await d.getByRole("button", { name: "HR", exact: true }).click();
    assert.equal(
      await d.locator(".workshop-topics input:checked").count(),
      1,
      "reselecting the same team preserves custom topics",
    );
    assert.equal(
      await d.getByLabel("Участники", { exact: true }).inputValue(),
      "l",
    );
    assert.equal(
      await d.getByLabel("Площадка", { exact: true }).inputValue(),
      "Офлайн в Алматы",
    );
    await page.screenshot({ path: `shots/training-mobile/edit-${width}.png` });
    // The contact shortcut returns when the constructor leaves the viewport.
    await page.locator("main > section").last().scrollIntoViewIfNeeded();
    await waitFor(
      () => page.locator(".floating-contact").isVisible(),
      "contact shortcut returns outside constructor",
    );
  }
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  console.log(
    "PASS",
    width,
    "training: step navigation, retained choices, touch controls, pricing, program download" +
      (edgeCases ? ", minimum topic, keyboard, contact visibility" : ""),
  );
}
try {
  for (const width of [375, 1440]) {
    const page = await browser.newPage({
      viewport: { width, height: 1000 },
      acceptDownloads: true,
    });
    page.on("pageerror", (e) => errors.push(e.message));
    let d = await open(page, "/services/mini-apps/");
    await d
      .getByRole("button", { name: "Выбрать Капучино", exact: true })
      .click();
    await d.getByRole("button", { name: /400 мл/ }).click();
    await d.getByRole("button", { name: /Овсяное/ }).click();
    await d.getByRole("button", { name: /Добавить в заказ/ }).click();
    await d.getByRole("button", { name: "Выпечка", exact: true }).click();
    await d
      .getByRole("button", { name: "Выбрать Круассан", exact: true })
      .click();
    await d.getByRole("button", { name: /Добавить в заказ/ }).click();
    await d.getByRole("button", { name: /Корзина · 2/ }).click();
    assert.match(
      await d.locator(".coffee-receipt strong").innerText(),
      /2\s*700/,
    );
    await d
      .getByRole("button", { name: "Увеличить Круассан", exact: true })
      .click();
    assert.match(
      await d.locator(".coffee-receipt strong").innerText(),
      /3\s*500/,
    );
    await d
      .getByRole("button", { name: "Уменьшить Круассан", exact: true })
      .click();
    await d.getByLabel("Время самовывоза").selectOption("Через 15 минут");
    await d.getByRole("button", { name: /Подтвердить заказ/ }).click();
    await d
      .getByRole("button", { name: "Начать готовить", exact: true })
      .click();
    assert.equal(
      await d.locator(".coffee-order h4").innerText(),
      "Бариста готовит",
    );
    await d
      .locator('.coffee-ticket[data-active="true"]')
      .getByRole("button", { name: "Заказ готов", exact: true })
      .click();
    assert.equal(
      await d.locator(".coffee-order h4").innerText(),
      "Можно забирать",
    );
    console.log(
      "PASS",
      width,
      "coffee: customized price, pastry, quantities, checkout, live barista status",
    );

    d = await open(page, "/services/bots/");
    await d
      .getByRole("button", { name: "Записаться в сервис", exact: true })
      .click();
    await d.getByRole("button", { name: /Диагностика/ }).click();
    await d.getByRole("button", { name: "15:30", exact: true }).click();
    await d
      .getByRole("button", { name: "Подтвердить запись", exact: true })
      .click();
    await waitFor(
      async () =>
        !(await d
          .getByRole("button", { name: "Записать ещё автомобиль", exact: true })
          .isDisabled()),
      "bot reply not ready",
    );
    await d
      .getByRole("button", {
        name: "Подтвердить у администратора",
        exact: true,
      })
      .click();
    await d
      .locator(".tg-message--bot")
      .filter({ hasText: "Запись №308 подтверждена" })
      .waitFor();
    await d.getByLabel("Сообщение боту").fill("статус");
    await d
      .getByRole("button", { name: "Отправить сообщение", exact: true })
      .click();
    await waitFor(
      async () =>
        /подтверждена/.test(
          await d.locator(".tg-message--bot").last().innerText(),
        ),
      "status missing",
    );
    console.log(
      "PASS",
      width,
      "bot: booking, administrator confirmation, typed status query",
    );

    d = await open(page, "/services/automation/");
    await d
      .getByRole("button", { name: "Запустить обработку", exact: true })
      .click();
    await d.getByRole("button", { name: /Открыть CRM/ }).waitFor();
    assert.match(
      await d.locator(".flow-total strong").innerText(),
      /435\s*000/,
    );
    await d.getByRole("button", { name: /Открыть CRM/ }).click();
    await d.getByRole("button", { name: "Согласовать", exact: true }).click();
    await d.getByLabel("Фильтр статуса CRM").selectOption("Согласована");
    assert.equal(await d.locator("tbody tr").count(), 1);
    await d.getByRole("button", { name: "Входящие", exact: true }).click();
    await d
      .getByLabel("Текст заявки")
      .fill("К 25 октября нужны 12 футболок в Астану");
    await d
      .getByRole("button", { name: "Запустить обработку", exact: true })
      .click();
    await d.getByRole("button", { name: /Открыть CRM/ }).waitFor();
    assert.match(await d.locator(".flow-total strong").innerText(), /74\s*400/);
    await d.getByLabel("Текст заявки").fill("Нужен расчёт");
    await d
      .getByRole("button", { name: "Запустить обработку", exact: true })
      .click();
    await d.getByRole("alert").waitFor();
    console.log(
      "PASS",
      width,
      "automation: quote arithmetic, CRM approval/filter, custom parsing, invalid input",
    );

    d = await open(page, "/services/websites/");
    await d.getByRole("button", { name: /Смотреть проекты/ }).click();
    await d.getByRole("button", { name: "Дома", exact: true }).click();
    assert.equal(await d.locator(".interior-project-card").count(), 1);
    await d.locator(".interior-project-card").click();
    await d.getByRole("button", { name: /Хочу обсудить/ }).click();
    await d.getByRole("button", { name: "Дом", exact: true }).click();
    await d.getByRole("slider", { name: "Площадь объекта" }).focus();
    await page.keyboard.press("ArrowRight");
    await d
      .locator(".interior-brief .pd-select")
      .selectOption("Пространство для семьи");
    await d.getByRole("button", { name: /Сформировать бриф/ }).click();
    assert.match(await d.getByRole("status").innerText(), /Дом · 73/);
    let download = page.waitForEvent("download");
    await d.getByRole("button", { name: "Скачать бриф", exact: true }).click();
    assert.equal((await download).suggestedFilename(), "forma-brief.txt");
    await d
      .getByRole("button", { name: "Рентген этого сайта", exact: true })
      .click();
    await d
      .getByRole("button", { name: "Включить рентген", exact: true })
      .click();
    assert.equal(
      await page
        .locator("html")
        .evaluate((el) => el.classList.contains("xray")),
      true,
    );
    await d
      .getByRole("button", { name: "Сайт интерьерной студии", exact: true })
      .click();
    assert.equal(
      await page
        .locator("html")
        .evaluate((el) => el.classList.contains("xray")),
      false,
    );
    console.log(
      "PASS",
      width,
      "website: project filter, detail, brief controls, download",
    );

    await checkTraining(page, width);
    await page.close();
  }
  for (const width of [320, 390, 430]) {
    const page = await browser.newPage({
      viewport: { width, height: width === 320 ? 667 : 844 },
      isMobile: true,
      hasTouch: true,
      acceptDownloads: true,
      reducedMotion: "reduce",
    });
    page.on("pageerror", (e) => errors.push(e.message));
    await checkTraining(page, width, true);
    await page.close();
  }
  assert.deepEqual(errors, []);
  console.log("PASS no JavaScript errors");
} finally {
  await browser.close();
  server?.close();
}
