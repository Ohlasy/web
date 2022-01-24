import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

export interface Article {
  title: string;
  author: string;
  category?: string;
  pubDate: string;
  coverPhoto: string;
  perex: string;
  serial?: string;
  relativeURL: string;
  tags: string[];
  numberOfWords: number;
}

export async function getArticleIndex(): Promise<Article[]> {
  const response = await fetch("https://ohlasy.info/assets/articles.js");
  let articles: Article[] = (await response.json()) as any;
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].author == "Anna Dudková") {
      articles[i].author = "Anna Dušilová";
    }
  }
  return articles;
}

export function groupBySelector<Key extends keyof any, Value>(
  values: Value[],
  sel: (_: Value) => Key | null | undefined
): Record<Key, Value[]> {
  const out = {} as Record<Key, Value[]>;
  for (const v of values) {
    const key = sel(v);
    if (key) {
      out[key] = out[key] || [];
      out[key].push(v);
    }
  }
  return out;
}

export function sum<Key extends keyof any, Value>(
  values: Record<Key, Value[]>
): Record<Key, number> {
  let counts = {} as Record<Key, number>;
  for (const [key, vals] of Object.entries(values)) {
    counts[key] = (vals as Value[]).length;
  }
  return counts;
}

export const getArticlesByAuthor = (as: Article[]) =>
  groupBySelector(as, (a) => a.author);

export const getArticlesByCategory = (as: Article[]) =>
  groupBySelector(as, (a) => a.category);

export function renderCSV(stats: Record<string, number>): string {
  return Object.entries(stats)
    .sort(([k1, v1], [k2, v2]) => v2 - v1)
    .map(([key, val]) => `${key}; ${val}`)
    .join("\n");
}

export function send(
  contentType: string,
  producer: () => Promise<string>
): (req: VercelRequest, res: VercelResponse) => Promise<void> {
  return async (_, response) => {
    try {
      const value = await producer();
      response.setHeader(
        "Cache-Control",
        "max-age=0, s-maxage=60, stale-while-revalidate=86400"
      );
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("Content-Type", contentType);
      response.status(200).send(value);
    } catch {
      response.status(500).send("Error loading source data.");
    }
  };
}
