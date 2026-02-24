import assert from "node:assert";
import test from "node:test";
import Markdoc from "@markdoc/markdoc";
import { parsePath, readArticle } from "./article";
import { defaultMarkdocConfig } from "./markdoc-schema";
import { getFilesRecursively } from "./server-utils";

test("Decode all articles", async (t) => {
  const allArticlePaths = getFilesRecursively("content/articles")
    // Only take Markdown posts
    .filter((path) => path.endsWith(".md"));
  for (const path of allArticlePaths) {
    await t.test(`Decode ${path}`, () => {
      const article = readArticle(path);
      const syntaxTree = Markdoc.parse(article.body);
      const bodyErrors = Markdoc.validate(syntaxTree, defaultMarkdocConfig)
        // TBD
        .filter((e) => e.error.id !== "child-invalid");
      bodyErrors.forEach((e) => {
        throw e;
      });
    });
  }
});

test("Parse article path", () => {
  assert.deepEqual(parsePath("2021-2-26-vystavba-chmelnice.md"), [
    new Date("2021-2-26"),
    "vystavba-chmelnice",
  ]);
  assert.throws(() => parsePath("2021-2-90-vystavba-chmelnice.md"));
  assert.throws(() => parsePath("2021-2-vystavba-chmelnice.md"));
  assert.throws(() => parsePath("2021-2-12-.md"));
  assert.throws(() => parsePath("2021-2-12-křeč.md"));
  assert.throws(() => parsePath("2021-2-12-sleva-50%.md"));
});
