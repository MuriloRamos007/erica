import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(m.text());
});
await page.goto("http://127.0.0.1:5178");
await page.screenshot({ path: "verification/cover-final.png" });
await page.keyboard.press("Tab");
await page.keyboard.press("Enter");
await page.locator("h1").waitFor();
await page.waitForTimeout(1900);
await page.screenshot({ path: "verification/intro-final.png" });
await page.getByRole("button", { name: /Continue/ }).click();
for (let i = 1; i <= 24; i++) {
  await page
    .locator(`[data-verse="${i}"]`)
    .evaluate((e) =>
      e.scrollIntoView({ block: "center", behavior: "instant" }),
    );
  await page.waitForTimeout(180);
  if (i === 12) {
    await page.waitForTimeout(1100);
    assert.match(
      await page.locator(".progress-heart").getAttribute("aria-label"),
      /12 de 24/,
    );
    await page.screenshot({ path: "verification/half-heart.png" });
  }
}
await page.locator(".final-letter").waitFor();
await page.locator(".progress-heart").click({ clickCount: 3 });
await page.locator(".secret").waitFor();
await page
  .locator('[data-paragraph="12"]')
  .evaluate((e) => e.scrollIntoView({ block: "center", behavior: "instant" }));
await page.waitForTimeout(2000);
await page.screenshot({ path: "verification/ending-final.png" });
await page.getByRole("button", { name: "Ver tudo outra vez" }).click();
await page.locator(".heart-card").waitFor();
assert.equal(await page.evaluate(() => scrollY), 0);
assert.deepEqual(errors, []);
console.log(
  "Normal motion, keyboard opening, half heart, complete heart, easter egg, final message and smooth replay passed. Console clean.",
);
await browser.close();
