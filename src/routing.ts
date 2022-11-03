import { Article, parsePath } from "./article";
import { getFilesRecursively } from "./utils";

/** Site URL without trailing slash */
export const siteUrl = "https://ohlasy.info";

/** Get relative routes to frequently used places */
export const Route = {
  toHomePage: "/",
  toArticleFeed: "/feed.xml",
  toPodcast: "/podcast.html",
  toPodcastFeed: "/podcast.xml",
  toArticle: getArticlePath,
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

//
// Filesystem paths
//

/** Root folder containing all the articles */
export const articleRoot = "content/articles";

/**
 * Convert a filesystem path to URL path fragments that make up the article URL
 * such as `["2022", "03", "obrana-drahy.html"]`
 *
 * The routing is slightly stupid (for historic reasons), since the
 * month format differs on disk (“5” for May) and in the URL (“05” for May)
 * _and_ the URL path is not enough to uniquely identify an article, since
 * there the filesystem path also contains the day of publication that’s
 * absent in the URL.
 *
 * TBD: Could we introduce a better URL format and use a permanent redirect for
 * the old URLs?
 */
export function getUrlPathFragmentsForFileSystemPath(path: string): string[] {
  const [date, slug] = parsePath(path);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const paddedMonth = String(month).padStart(2, "0");
  return [`${year}`, paddedMonth, `${slug}.html`];
}

/**
 * Convert URL fragments such as `["2022", "03", "obrana-drahy.html"]` to a filesystem
 * path to the article identified by the URL
 *
 * This is a sad hack, too. The URL path does not identify the article uniquely, so we
 * just use some simple heuristic to find it in the appropriate folder.
 *
 * TBD: should we even rely on the folder structure, or should we just parse all articles
 * into some structure and query that?
 */
export function getFileSystemPathForUrlPathFragments(
  fragments: string[]
): string | undefined {
  const [year, month, slug] = fragments;
  const nakedSlug = slug.replace(".html", "");
  return getFilesRecursively(`${articleRoot}/${year}/${+month}`).find((path) =>
    path.endsWith(`${nakedSlug}.md`)
  );
}
