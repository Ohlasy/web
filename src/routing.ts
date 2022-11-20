import { Article } from "./article";
import { getTopicUrl } from "./forum";

/** Site URL without trailing slash */
export const siteUrl = "https://ohlasy.info";

/** Get relative routes to frequently used places */
export const Route = {
  // Static routes
  toHomePage: "/",
  toArticleFeed: "/feed.xml",
  toPodcast: "/podcast",
  toPodcastFeed: "/podcast.xml",
  // Dynamic routes
  toArticle: getArticlePath,
  toForumTopic: getTopicUrl,
  // External routes
  toFacebook: "https://www.facebook.com/ohlasy",
  toVercel: "https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss",
  toArchive: "http://archiv.ohlasy.info",
  toForum: "https://forum.ohlasy.info",
  toAdsInfo: "https://wiki.ohlasy.info/4d80dd164e614461a16f4a65597c6304",
  toCompanyInfo: "https://wiki.ohlasy.info/9101128690ce46d6908f322fff37065e",
};

/**
 * Convert a relative path to an absolute URL
 *
 * Paths that are already absolute will be left untouched.
 */
export const absolute = (path = "/") => {
  if (path.startsWith("http")) {
    return path;
  } else if (path.startsWith("/")) {
    return siteUrl + path;
  } else {
    return siteUrl + "/" + path;
  }
};

/**
 * Return the path used for an article given its date and slug
 *
 * Includes leading slash, ie. `/clanky/2021/03/bagr-lopata.html`
 */
export function getArticlePath(
  article: Pick<Article, "date" | "slug">
): string {
  const date = new Date(article.date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const paddedMonth = String(month).padStart(2, "0");
  return `/clanky/${year}/${paddedMonth}/${article.slug}.html`;
}
