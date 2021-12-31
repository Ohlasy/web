import matter from "gray-matter";
import { getFilesRecursively } from "./utils";
import fs from "fs";
import {
  array,
  DecoderFunction,
  decodeType,
  field,
  optional,
  Pojo,
  record,
  string,
  union,
} from "typescript-json-decoder";

/** Try decoding with the provided decoder and return a default value if it fails */
const withDefault = <T>(decoder: DecoderFunction<T>, defaultValue: T) => {
  return (value: Pojo) => {
    try {
      return decoder(value);
    } catch (_) {
      return defaultValue;
    }
  };
};

const date = (value: Pojo): Date => {
  if (Object.prototype.toString.call(value) === "[object Date]") {
    return value as any;
  } else {
    throw `Expected a date, got ${typeof value} instead`;
  }
};

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
  date: date,
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
 * Return the “slug” part of a path
 *
 * The file name must be in the `2021-2-26-vystavba-chmelnice.md` format.
 */
export function getSlugFromPath(path: string): string {
  return path
    .replace(/^.*[\\\/]/, "") // 2021-2-26-vystavba-chmelnice.md
    .replace(/^\d+-\d+-\d+-/, "") // vystavba-chmelnice.md
    .replace(/\.md$/, ""); // vystavba-chmelnice
}

export function readArticle(path: string): Article {
  // TODO: Validate the path format?
  const src = fs.readFileSync(path, { encoding: "utf-8" });
  return decodeArticle(src, {
    slug: getSlugFromPath(path),
    date: fs.statSync(path).ctime,
  });
}

export function getAllArticles(root = "_posts"): Article[] {
  return getFilesRecursively(root).map(readArticle);
}
