import { getArticlePath, getSlugFromPath, readArticle } from "./article";
import { getFilesRecursively } from "./utils";

test("Decode all articles", () => {
  const articlePaths = getFilesRecursively("_posts");
  for (const path of articlePaths) {
    try {
      const _ = readArticle(path);
    } catch (e) {
      fail(`Article fails to decode: ${path}`);
    }
  }
  console.log(`Successfully decoded ${articlePaths.length} articles.`);
});

test("Get slug from path", () => {
  const s = getSlugFromPath;
  expect(s("2021-2-26-vystavba-chmelnice.md")).toBe("vystavba-chmelnice");
  expect(s("/foo/2021-2-26-vystavba-chmelnice.md")).toBe("vystavba-chmelnice");
});

test("Article paths", () => {
  expect(
    getArticlePath({
      date: new Date("2021-3-30"),
      slug: "bagr-lopata",
    })
  ).toBe("/clanky/2021/03/bagr-lopata.html");
});
