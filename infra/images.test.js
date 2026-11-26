import assert from "node:assert/strict";
import { test } from "node:test";
import { imageSize } from "image-size";

const baseUrl = "https://thumbs.ohlasy.info";
const scaledImageUrl = (sourceImageUrl, width, height) =>
  `${baseUrl}/insecure/rs:fill:${width}:${height}/plain/${sourceImageUrl}`;
const randomWidth = () => 100 + Math.floor(Math.random() * 400);

// TBD: The caching times are quite long, will this hit older, already cached images eventually?
const uniqueTestingImageUrl = () =>
  scaledImageUrl("https://i.ohlasy.info/i/a5c62deb.jpg", randomWidth(), 200);

test("Basic scaling", async () => {
  const response = await fetch(
    scaledImageUrl("https://i.ohlasy.info/i/a5c62deb.jpg", 300, 200),
  );
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^image\//);

  const bytes = Buffer.from(await response.arrayBuffer());
  const { width, height } = imageSize(bytes);

  assert.equal(width, 300);
  assert.equal(height, 200);
});

test("Convert image format", async () => {
  const response = await fetch(
    scaledImageUrl("https://i.ohlasy.info/i/a5c62deb.jpg@webp", 300, 200),
  );
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/webp");

  const bytes = Buffer.from(await response.arrayBuffer());
  const { type, width, height } = imageSize(bytes);
  assert.equal(type, "webp");
  assert.equal(width, 300);
  assert.equal(height, 200);
});

test("Negotiate modern format via Accept header", async () => {
  const response = await fetch(uniqueTestingImageUrl(), {
    headers: { Accept: "image/webp,image/avif,*/*" },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "image/avif");
  const bytes = Buffer.from(await response.arrayBuffer());
  assert.equal(imageSize(bytes).type, "avif");
});

test("Vary CDN cache by Accept header", async () => {
  const url = uniqueTestingImageUrl();

  // A webp-capable (but not avif) browser warms the cache with a webp variant.
  const webp = await fetch(url, { headers: { Accept: "image/webp,*/*" } });
  assert.equal(webp.status, 200);
  assert.equal(webp.headers.get("content-type"), "image/webp");
  assert.equal(imageSize(Buffer.from(await webp.arrayBuffer())).type, "webp");

  // An avif-capable browser requesting the same URL must get avif, not the
  // previously cached webp variant.
  const avif = await fetch(url, {
    headers: { Accept: "image/avif,image/webp,*/*" },
  });
  assert.equal(avif.status, 200);
  assert.equal(avif.headers.get("content-type"), "image/avif");
  assert.equal(imageSize(Buffer.from(await avif.arrayBuffer())).type, "avif");
});

test("Reject disallowed source domains", async () => {
  const response = await fetch(
    scaledImageUrl("https://example.com/foo.jpg", 300, 200),
  );
  assert.equal(response.status, 404);
  const body = await response.text();
  assert.match(body, /Invalid source URL/i);
});

test("Forbid root path access", async () => {
  const response = await fetch(`${baseUrl}/`);
  assert.equal(response.status, 403);
});

test("Cache scaled images at the CDN", async () => {
  const url = uniqueTestingImageUrl();

  const first = await fetch(url);
  assert.equal(first.status, 200);
  assert.equal(first.headers.get("cdn-cache"), "MISS");
  await first.arrayBuffer();

  const second = await fetch(url);
  assert.equal(second.status, 200);
  assert.equal(second.headers.get("cdn-cache"), "HIT");
  await second.arrayBuffer();
});
