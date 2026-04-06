import { expect, test } from "@playwright/test";

const ContentType = {
  rss: "application/rss+xml",
  json: "application/json",
};

const endpoints = {
  "/feed.xml": ContentType.rss,
  "/podcast.xml": ContentType.rss,
  "/podcast/hrebenovka.xml": ContentType.rss,
};

for (const [endpoint, contentType] of Object.entries(endpoints)) {
  test(`Endpoint works: ${endpoint}`, async ({ page }) => {
    const response = await page.request.get(endpoint);
    await expect(response).toBeOK();
    expect(response.headers()["content-type"]).toEqual(contentType);
    if (contentType === "application/json") {
      expect(await response.json()).toBeTruthy();
    }
  });
}
