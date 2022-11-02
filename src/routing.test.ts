import { absolute, getArticlePath, Route } from "./routing";

test("Article path", () => {
  expect(
    getArticlePath({
      date: "Wed Mar 03 2021 09:50:47 GMT",
      slug: "bagr-lopata",
    })
  ).toBe("/clanky/2021/03/bagr-lopata.html");
});

test("Routes", () => {
  expect(Route.toHomePage).toBe("/");
  expect(absolute(Route.toHomePage)).toBe("https://ohlasy.info/");
  expect(absolute("foo")).toBe("https://ohlasy.info/foo");
  expect(absolute("/foo")).toBe("https://ohlasy.info/foo");
  expect(absolute("https://ohlasy.info/foo")).toBe("https://ohlasy.info/foo");
});
