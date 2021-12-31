import matter from "gray-matter";
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
import { getFilesRecursively } from "./utils";

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
export function decodeArticle(src: string): Article {
  const { content, data } = matter(src);
  return {
    body: content,
    ...decodeMetadata(data),
  };
}

export function getAllArticles(root = "_posts"): Article[] {
  return getFilesRecursively(root).map(decodeArticle);
}
