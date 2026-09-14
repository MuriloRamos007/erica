import { chromium } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const results = [];
await mkdir("verification", { recursive: true });
for (const viewport of [
  { width: 390, height: 844 },
  { width: 1366, height: 768 },
  { width: 1920, height: 1080 },
  { width: 768, height: 1024 },
  { width: 360, height: 740 },
]) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  const errors = [];
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(response.status() + " " + response.url());
  });
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5178/erica/");
  await page.locator(".heart-card").waitFor();
  assert.equal(await page.locator("[data-verse]").count(), 0);
  await page.screenshot({ path: `verification/cover-${viewport.width}.png` });
  await page
    .getByRole("button", { name: "Abrir a carta de aniversário para Érica" })
    .click();
  await page.locator("h1").waitFor();
  await page.getByRole("button", { name: /Continue/ }).click();
  assert.equal(await page.locator("[data-verse]").count(), 24);
  const expectedPoem = JSON.parse(
    "[" +
      (await readFile("src/data/poem.ts", "utf8"))
        .split("[")[1]
        .split("]")[0]
        .replace(/,\s*$/, "") +
      "]",
  );
  assert.deepEqual(
    await page.locator("[data-verse] p").allTextContents(),
    expectedPoem,
  );
  for (let i = 1; i <= 24; i++) {
    await page
      .locator(`[data-verse="${i}"]`)
      .evaluate((e) =>
        e.scrollIntoView({ block: "center", behavior: "instant" }),
      );
    await page.waitForTimeout(75);
  }
  await page.locator(".final-letter").waitFor();
  assert.match(
    await page.locator(".progress-heart").getAttribute("aria-label"),
    /24 de 24/,
  );
  assert.equal(await page.locator(".verse.visible").count(), 24);
  const expectedLetter = JSON.parse(
    "[" +
      (await readFile("src/data/finalMessage.ts", "utf8"))
        .split("[")[1]
        .split("]")[0]
        .replace(/,\s*$/, "") +
      "]",
  );
  assert.deepEqual(
    await page.locator("[data-paragraph] > p").allTextContents(),
    expectedLetter,
  );
  await page
    .locator('[data-paragraph="8"]')
    .evaluate((e) =>
      e.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await page.waitForTimeout(100);
  await page.screenshot({ path: `verification/letter-${viewport.width}.png` });
  const photo = page.locator(".photo-button").first();
  await photo.evaluate((e) =>
    e.scrollIntoView({ block: "center", behavior: "instant" }),
  );
  await photo.click();
  assert.equal(await page.locator("dialog").evaluate((e) => e.open), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((e) => e.open), false);
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  for (const img of await page.locator("img").all()) {
    await img.evaluate((e) =>
      e.scrollIntoView({ block: "center", behavior: "instant" }),
    );
    await img.evaluate((e) => e.decode());
  }
  await page.getByRole("button", { name: "Ver tudo outra vez" }).click();
  await page.locator(".heart-card").waitFor();
  assert.equal(await page.locator(".final-letter").count(), 0);
  assert.equal(await page.locator("[data-verse]").count(), 0);
  await page.locator(".heart-card").click();
  await page.getByRole("button", { name: /Continue/ }).click();
  assert.match(
    await page.locator(".progress-heart").getAttribute("aria-label"),
    /0 de 24/,
  );
  assert.deepEqual(errors, []);
  results.push({
    viewport,
    status: "passed",
    verses: 24,
    paragraphs: 13,
    images: "decoded",
    replay: "passed",
    consoleErrors: errors,
  });
  await page.close();
}
await browser.close();
await writeFile("verification/results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
