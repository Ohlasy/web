import { test, expect } from "@playwright/test";

test("Basic sanity tests", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ohlasy dění na Boskovicku/);
});

test("Not found page", async ({ page }) => {
  const response = await page.request.get("/does_not_exist");
  expect(response.status()).toBe(404);
});

test("Not found page under /clanky", async ({ page }) => {
  const response = await page.request.get("/clanky/does_not_exist");
  expect(response.status()).toBe(404);
});
