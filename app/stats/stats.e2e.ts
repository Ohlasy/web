import { test, expect } from "@playwright/test";

const endpoints = [
  "/stats/donations/monthly",
  "/stats/donations/last_year",
  "/stats/content/authors",
  "/stats/content/authors/history",
  "/stats/content/authors/diversity",
  "/stats/content/authors/bus_factor",
  "/stats/content/articles/length",
  "/stats/content/articles/count",
  "/stats/content/categories",
];

for (const endpoint of endpoints) {
  test(`Endpoint works: ${endpoint}`, async ({ page }) => {
    const response = await page.request.get(endpoint);
    expect(response).toBeOK();
    expect(response.headers()["content-type"]).toEqual("text/csv");
  });
}
