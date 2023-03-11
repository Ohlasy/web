import { test, expect } from "@playwright/test";
import sharp from "sharp";

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

test("Image resizing works", async ({ page }) => {
  const params = new URLSearchParams({
    src: "https://i.ohlasy.info/i/c1552107.jpg",
    proof: "cce2434090b1ecf1c0ddc72ab2dc809c664df492",
    width: "640",
  });
  const response = await page.request.get(`/api/resize?${params}`);
  expect(response).toBeOK();
  expect(response.headers()["content-type"]).toEqual("image/jpeg");
  let img = sharp(Buffer.from(await response.body()));
  const metadata = await img.metadata();
  expect(metadata.width).toBe(640);
});
