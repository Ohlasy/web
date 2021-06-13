import fetch from "node-fetch";

export interface Article {
  title: string;
  author: string;
  category: string;
  pubDate: string;
  coverPhoto: string;
  perex: string;
  serial?: string;
  relativeURL: string;
  tags: string[];
}

export async function getArticleIndex(): Promise<Article[]> {
  const response = await fetch("https://ohlasy.info/assets/articles.js");
  let articles: Article[] = await response.json();
  for (let i = 0; i < articles.length; i++) {
    if (articles[i].author == "Anna Dudková") {
      articles[i].author = "Anna Dušilová";
    }
  }
  return articles;
}

export function groupBySelector<Key extends keyof any, Value>(
  values: Value[],
  sel: (_: Value) => Key | null
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
