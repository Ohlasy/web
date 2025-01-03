import { Article, getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { Banner, getAllBanners } from "./banners";
import { Author, getAllAuthors } from "./content";

type Cache = {
  banners: Banner[];
  articles: Article[];
  authors: Author[];
};

let cache: Cache | undefined = undefined;

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
