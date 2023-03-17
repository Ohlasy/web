import { resolve, join } from "path";
import { parsePath } from "./article";
import fs from "fs";

/** Root folder containing all the articles */
export const articleRoot = "content/articles";

/** Returns a flat array of all files under given directory */
export function getFilesRecursively(dir: string): string[] {
  let found: string[] = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const path = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      found = found.concat(getFilesRecursively(path));
    } else {
      found.push(path);
    }
  }
  return found;
}

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
  if (!year || !month || !slug) {
    return undefined;
  }
  const nakedSlug = slug.replace(".html", "");
  const folder = join(
    process.cwd(),
    "content",
    "articles",
    year,
    // strip leading zero
    (+month).toString()
  );
  return getFilesRecursively(folder).find((path) =>
    path.endsWith(`${nakedSlug}.md`)
  );
}
