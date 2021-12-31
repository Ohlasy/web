import { decodeArticle } from "./article";
import { getFilesRecursively } from "./utils";
import fs from "fs";

test("Decode all articles", () => {
  const articlePaths = getFilesRecursively("_posts");
  for (const path of articlePaths) {
    const src = fs.readFileSync(path, { encoding: "utf-8" });
    try {
      const _ = decodeArticle(src);
    } catch (e) {
      fail(`Article fails to decode: ${path}`);
    }
  }
  console.log(`Successfully decoded ${articlePaths.length} articles.`);
});
