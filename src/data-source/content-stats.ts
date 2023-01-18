import { NextApiRequest, NextApiResponse } from "next";
import { Article } from "src/article";

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

export function sum<Value>(
  values: Record<string, Value[]>
): Record<string, number> {
  let counts = {} as Record<string, number>;
  for (const [key, vals] of Object.entries(values)) {
    counts[key] = (vals as Value[]).length;
  }
  return counts;
}

export const getArticlesByAuthor = (as: Article[]) =>
  groupBySelector(as, (a) => a.author);

export const getArticlesByCategory = (as: Article[]) =>
  groupBySelector(as, (a) => a.category);

export const filterByYear = (year: number | undefined) => (a: Article) => {
  return year ? new Date(a.date).getFullYear() === year : true;
};

export function renderCSV(stats: Record<string, number>): string {
  return Object.entries(stats)
    .sort(([k1, v1], [k2, v2]) => v2 - v1)
    .map(([key, val]) => `${key}; ${val}`)
    .join("\n");
}

export function send(
  contentType: string,
  producer: () => Promise<string>
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  return async (_, response) => {
    try {
      const value = await producer();
      response.setHeader(
        "Cache-Control",
        `s-maxage=3600, stale-while-revalidate`
      );
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("Content-Type", contentType);
      response.status(200).send(value);
    } catch {
      response.status(500).send("Error loading source data.");
    }
  };
}
