import { parsePath, readArticle } from "./article";
import { getFilesRecursively } from "./utils";

test("Decode all articles", () => {
  const articlePaths = getFilesRecursively("content/articles")
    // Only take Markdown posts
    .filter((path) => path.endsWith(".md"));
  for (const path of articlePaths) {
    try {
      const _ = readArticle(path);
    } catch (e) {
      fail(`Article fails to decode: ${path}`);
    }
  }
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
