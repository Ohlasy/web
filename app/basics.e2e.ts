import { test, expect } from "@playwright/test";

test("Basic sanity tests", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ohlasy dění na Boskovicku/);
});

test("Not found page", async ({ page }) => {
  const response = await page.request.get("/does_not_exist");
  expect(response.status()).toBe(404);
});

test("Fundraising shortcut #1", async ({ page }) => {
  await page.goto("/darujte");
  await expect(page).toHaveTitle(/Provoz regionálních novin Ohlasy/);
});

test("Fundraising shortcut #2", async ({ page }) => {
  await page.goto("/darujme");
  await expect(page).toHaveTitle(/Provoz regionálních novin Ohlasy/);
});
