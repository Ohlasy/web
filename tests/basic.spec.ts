import { test, expect } from "@playwright/test";

test("Basic sanity tests", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ohlasy dění na Boskovicku/);
});
