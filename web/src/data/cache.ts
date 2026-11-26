import { type Article, getAllArticles } from "@/src/article";
import { articleRoot } from "@/src/server-utils";
import { type Author, getAllAuthors } from "./authors";
import { type Banner, getAllBanners } from "./banners";

type Cache = {
  banners: Banner[];
  articles: Article[];
  authors: Author[];
};

let cache: Cache | undefined;

export async function getCachedData(): Promise<Cache> {
  if (cache === undefined) {
    cache = {
      banners: await getAllBanners(),
      articles: getAllArticles(articleRoot),
      authors: await getAllAuthors(),
    };
  }
  return cache;
}
