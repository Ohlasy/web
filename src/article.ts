import matter from "gray-matter";
import { getFilesRecursively } from "./utils";
import { withDefault } from "./decoding";
import fs from "fs";
import {
  array,
  boolean,
  decodeType,
  field,
  optional,
  Pojo,
  record,
  string,
  union,
} from "typescript-json-decoder";

//
// Types and decoding
//

/** Article metadata such as title, author, category, etc. */
export type Metadata = decodeType<typeof decodeMetadata>;

/** Article metadata + article body */
export interface Article extends Metadata {
  body: string;
}

/** Decode a live Date object (ie. not a date stamp string), returning a string timestamp */
export const decodeDate = (value: Pojo): string => {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return `${value}`;
  } else {
    throw `Expected a date, got ${typeof value} instead`;
  }
};

/** Decode article metadata from an object */
export const decodeMetadata = record({
  title: string,
  author: string,
  perex: optional(string),
  coverPhoto: field("cover-photo", optional(string)),
  tags: withDefault(array(string), []),
  serial: optional(string),
  featured: withDefault(boolean, false),
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

//
// Reading from files
//

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
export function getAllArticles(root: string): Article[] {
  return getFilesRecursively(root)
    .filter((path) => path.endsWith(".md"))
    .map(readArticle);
}

//
// Helpers
//

/** Compare articles by publish date, sorting last published first */
export const compareByDate = <A extends Pick<Article, "date">>(a1: A, a2: A) =>
  Date.parse(a2.date) - Date.parse(a1.date);
