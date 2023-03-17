import { test, expect } from "@playwright/test";

test("Basic sanity tests", async ({ page }) => {
  await page.goto("/clanky/2023/03/josef-svancara.html");
  await expect(page).toHaveTitle(/Každý má svůj příběh/);
});

test("Not found page", async ({ page }) => {
  const response = await page.request.get("/clanky/does_not_exist");
  expect(response.status()).toBe(404);
});
