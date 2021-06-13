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
    const out = JSON.stringify(countStats(articles), null, 2);
    response.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
    response.setHeader("Content-Type", "application/json");
    response.status(200).send(out);
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
