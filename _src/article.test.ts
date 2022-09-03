import { getArticlePath, parsePath, readArticle } from "./article";
import { getFilesRecursively } from "./utils";

test("Decode all articles", () => {
  const articlePaths = getFilesRecursively("_posts");
  for (const path of articlePaths.filter((path) => path.endsWith(".md"))) {
    try {
      const _ = readArticle(path);
    } catch (e) {
      fail(`Article fails to decode: ${path}`);
    }
  }
  console.log(`Successfully decoded ${articlePaths.length} articles.`);
});

test("Parse article path", () => {
  expect(parsePath("2021-2-26-vystavba-chmelnice.md")).toEqual([
    new Date("2021-2-26"),
    "vystavba-chmelnice",
  ]);
  expect(() => parsePath("2021-2-90-vystavba-chmelnice.md")).toThrow();
  expect(() => parsePath("2021-2-vystavba-chmelnice.md")).toThrow();
  expect(() => parsePath("2021-2-12-.md")).toThrow();
  expect(() => parsePath("2021-2-12-křeč.md")).toThrow();
  expect(() => parsePath("2021-2-12-sleva-50%.md")).toThrow();
});

test("Article paths", () => {
  expect(
    getArticlePath({
      date: new Date("2021-3-30"),
      slug: "bagr-lopata",
    })
  ).toBe("/clanky/2021/03/bagr-lopata.html");
});
