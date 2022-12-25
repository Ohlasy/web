import { Article } from "./article";
import { getTopicUrl } from "./data-source/forum";

/** Site URL without trailing slash */
export const siteUrl = "https://ohlasy.info";

/** Get relative routes to frequently used places */
export const RouteTo = {
  // Static routes
  homePage: "/",
  podcasts: "/podcast",
  articleFeed: "/feed.xml",
  mainPodcastFeed: "/podcast.xml",
  hrebenovkaFeed: "/podcast/hrebenovka.xml",
  // Dynamic routes
  article: getArticlePath,
  forumTopic: getTopicUrl,
  // External routes
  archive: "http://archiv.ohlasy.info",
  forum: "https://forum.ohlasy.info",
  adsInfo: "https://wiki.ohlasy.info/4d80dd164e614461a16f4a65597c6304",
  companyInfo: "https://wiki.ohlasy.info/9101128690ce46d6908f322fff37065e",
  // Socials
  Facebook: "https://www.facebook.com/ohlasy",
  Mastodon: "https://boskovice.social/@ohlasy",
  YouTube: "https://www.youtube.com/channel/UCylOefq0Efb-A452MlTuejw",
  Instagram: "http://instagram.com/ohlasy_boskovice/",
  Vercel: "https://www.vercel.com?utm_source=[ohlasy]&utm_campaign=oss",
  Spotify: "https://open.spotify.com/show/5WSL7RX8M7vaL7HQ1uUj10",
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
