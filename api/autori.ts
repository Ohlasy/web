import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";

interface Article {
  author: string;
}

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  try {
    const fetchResponse = await fetch("https://ohlasy.info/assets/articles.js");
    const articles: Article[] = await fetchResponse.json();
    response.setHeader(
      "Cache-Control",
      "max-age=0, s-maxage=60, stale-while-revalidate=86400"
    );
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "text/json");
    response.status(200).send(renderCSV(countStats(articles)));
  } catch {
    response.status(500).send("Error loading source data.");
  }
};

export function countStats(articles: Article[]): Record<string, number> {
  const authors: Record<string, number> = {};
  for (const article of articles) {
    authors[article.author] = authors[article.author] || 0;
    authors[article.author]++;
  }
  return authors;
}

export function renderCSV(stats: Record<string, number>): string {
  return Object.entries(stats)
    .sort(([k1, v1], [k2, v2]) => v2 - v1)
    .map(([key, val]) => `${key}; ${val}`)
    .join("\n");
}
