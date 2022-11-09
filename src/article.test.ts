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

test("Rendering", () => {
  for (const [sample, render] of parseSuite(suite)) {
    expect(renderArticleBody(sample)).toBe(render);
  }
});

const parseSuite = (suite: string) => {
  const out: string[][] = [];
  const chunks = suite.split(/[-=]{3}\n/);
  while (true) {
    const [source, render] = chunks.splice(0, 2);
    if (source && render) {
      out.push([source, render]);
    } else {
      break;
    }
  }
  return out;
};

const suite = `
Trivial case.
---
<p>Trivial case.</p>
===
*Basic markup.*
---
<p><em>Basic markup.</em></p>
===
Do not touch "double quotes", 'single quotes' & „nice quotes“.
---
<p>Do not touch "double quotes", 'single quotes' &amp; „nice quotes“.</p>
`;
