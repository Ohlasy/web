import { parsePath, readArticle } from "./article";
import { getFilesRecursively } from "./server-utils";
import { defaultMarkdocConfig } from "./markdoc-schema";
import Markdoc from "@markdoc/markdoc";

const allArticlePaths = getFilesRecursively("content/articles")
  // Only take Markdown posts
  .filter((path) => path.endsWith(".md"));

test.each(allArticlePaths)("Decode %s", (path) => {
  try {
    const article = readArticle(path);
    const syntaxTree = Markdoc.parse(article.body);
    const bodyErrors = Markdoc.validate(syntaxTree, defaultMarkdocConfig)
      // TBD: fix later
      .filter((e) => e.error.id !== "child-invalid");
    bodyErrors.forEach((e) => fail(e));
  } catch (e) {
    fail(`Article fails to decode`);
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
