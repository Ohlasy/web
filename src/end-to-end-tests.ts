import assert from "node:assert";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { after, before, suite, test } from "node:test";
import next from "next";

let server: Server;
let base: string;

before(
  async () => {
    const app = next({ dev: false, dir: process.cwd() });
    await app.prepare();
    const handler = app.getRequestHandler();
    server = createServer((req, res) => handler(req, res));
    await new Promise<void>((resolve) => server.listen(0, resolve));
    const { port } = server.address() as AddressInfo;
    base = `http://localhost:${port}`;
  },
  { timeout: 120_000 },
);

after(async () => {
  await new Promise<void>((resolve, reject) =>
    server.close((err) => (err ? reject(err) : resolve())),
  );
});

suite("Basics", () => {
  test("Basic sanity tests", async () => {
    const html = await fetch(`${base}/`).then((r) => r.text());
    assert.match(html, /<title[^>]*>[^<]*Ohlasy dění na Boskovicku/);
  });

  test("Not found page", async () => {
    const response = await fetch(`${base}/does_not_exist`);
    assert.equal(response.status, 404);
  });

  test("Fundraising shortcut #1", async () => {
    const response = await fetch(`${base}/darujte/`, { redirect: "manual" });
    assert.equal(response.status, 307);
    assert.equal(
      response.headers.get("location"),
      "https://www.darujme.cz/darovat/1213575",
    );
  });

  test("Fundraising shortcut #2", async () => {
    const response = await fetch(`${base}/darujme/`, { redirect: "manual" });
    assert.equal(response.status, 307);
    assert.equal(
      response.headers.get("location"),
      "https://www.darujme.cz/darovat/1213575",
    );
  });
});

suite("Feed endpoints", () => {
  const feedEndpoints = {
    "/feed.xml": "application/rss+xml",
    "/podcast.xml": "application/rss+xml",
    "/podcast/hrebenovka.xml": "application/rss+xml",
  };
  for (const [endpoint, contentType] of Object.entries(feedEndpoints)) {
    test(`Endpoint works: ${endpoint}`, async () => {
      const response = await fetch(`${base}${endpoint}`);
      assert.ok(response.ok, `Expected OK response, got ${response.status}`);
      assert.equal(response.headers.get("content-type"), contentType);
    });
  }
});

suite("Article pages", () => {
  test("Article renders with the right title", async () => {
    const html = await fetch(`${base}/clanky/2023/03/josef-svancara.html`).then(
      (r) => r.text(),
    );
    assert.match(html, /<title[^>]*>[^<]*Každý má svůj příběh/);
  });

  test("Missing article returns 404", async () => {
    const response = await fetch(`${base}/clanky/does_not_exist`);
    assert.equal(response.status, 404);
  });
});
