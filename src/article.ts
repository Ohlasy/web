import matter from "gray-matter";
import { getFilesRecursively } from "./utils";
import { decodeDate, withDefault } from "./decoding";
import fs from "fs";
import {
  array,
  decodeType,
  field,
  optional,
  record,
  string,
  union,
} from "typescript-json-decoder";

/** Article metadata such as title, author, category, etc. */
export type Metadata = decodeType<typeof decodeMetadata>;

/** Article metadata + article body */
export interface Article extends Metadata {
  body: string;
}

/** Decode article metadata from an object */
export const decodeMetadata = record({
  title: string,
  author: string,
  perex: optional(string),
  coverPhoto: field("cover-photo", optional(string)),
  tags: withDefault(array(string), []),
  slug: string,
  date: decodeDate,
  category: optional(
    union(
      "zpravodajství",
      "názory a komentáře",
      "seriály",
      "rozhovory",
      "podcast",
      "ankety"
    )
  ),
});

/** Decode article from a standard frontmatter + body text file */
export function decodeArticle(
  src: string,
  defaults: Record<string, any> = {}
): Article {
  const { content, data } = matter(src);
  const mergedMeta = { ...defaults, ...data };
  return {
    body: content,
    ...decodeMetadata(mergedMeta),
  };
}

/**
 * Parse article path to get article date and slug
 *
 * The expected filename format is `2021-2-26-vystavba-chmelnice.md`.
 */
export function parsePath(path: string): [Date, string] {
  const filename = path.replace(/^.*[\\\/]/, "");
  const matches = filename.match(/^(\d+-\d+-\d+)-(.*)\.md$/);

  if (!matches || matches.length < 2) {
    throw `Invalid file name format: ${filename}`;
  }

  const date = new Date(matches[1]);
  const slug = matches[2];

  if (isNaN(date.getTime())) {
    throw `Invalid date ${date} in ${filename}`;
  }

  if (!slug.match(/^[a-z0-9-_]+$/i)) {
    throw `Invalid slug “${slug}” in ${filename}`;
  }

  return [date, slug];
}

/**
 * Read article from a file
 *
 * This also automatically fills in the correct default values for
 * `slug` and `date`.
 */
export function readArticle(path: string): Article {
  const src = fs.readFileSync(path, { encoding: "utf-8" });
  const [date, slug] = parsePath(path);
  return decodeArticle(src, { date, slug });
}

/** Read all articles under a given directory root */
export function getAllArticles(root = "_posts"): Article[] {
  return getFilesRecursively(root).map(readArticle);
}

/** Return the path used for an article given its date and slug */
export function getArticlePath(meta: Pick<Metadata, "date" | "slug">): string {
  const year = meta.date.getFullYear();
  const month = meta.date.getMonth() + 1;
  const paddedMonth = String(month).padStart(2, "0");
  return `/clanky/${year}/${paddedMonth}/${meta.slug}.html`;
}
