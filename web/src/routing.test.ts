import assert from "node:assert";
import test from "node:test";
import { absolute, getArticlePath, RouteTo } from "./routing";

test("Article path", () => {
  assert.equal(
    getArticlePath({
      date: "Wed Mar 03 2021 09:50:47 GMT",
      slug: "bagr-lopata",
    }),
    "/clanky/2021/03/bagr-lopata.html",
  );
});

test("Routes", () => {
  assert.equal(RouteTo.homePage, "/");
  assert.equal(absolute(RouteTo.homePage), "https://ohlasy.info/");
  assert.equal(absolute("foo"), "https://ohlasy.info/foo");
  assert.equal(absolute("/foo"), "https://ohlasy.info/foo");
  assert.equal(absolute("https://ohlasy.info/foo"), "https://ohlasy.info/foo");
});
