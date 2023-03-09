import { test, expect } from "@playwright/test";

test("Test RSS feed", async ({ page }) => {
  const response = await page.request.get("/feed.xml");
  expect(response).toBeOK();
  expect(response.headers()["content-type"]).toEqual("application/rss+xml");
});
