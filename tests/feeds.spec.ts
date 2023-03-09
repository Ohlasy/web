import { test, expect } from "@playwright/test";

const ContentType = {
  rss: "application/rss+xml",
  json: "application/json",
};

const endpoints = {
  "/feed.xml": ContentType.rss,
  "/podcast.xml": ContentType.rss,
  "/api/articles": ContentType.json,
};

for (const [endpoint, contentType] of Object.entries(endpoints)) {
  test(`Endpoint works: ${endpoint}`, async ({ page }) => {
    const response = await page.request.get(endpoint);
    expect(response).toBeOK();
    expect(response.headers()["content-type"]).toEqual(contentType);
    if (contentType === "application/json") {
      expect(await response.json()).toBeTruthy();
    }
  });
}
