import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

interface PlausibleResponse {
  results: {
    page: string;
    visitors: number;
  }[];
}

async function queryTopPages(
  apiKey: string,
  siteId = "ohlasy.info",
  period = "30d",
  property = "event:page",
  limit = 15
): Promise<PlausibleResponse> {
  const root = "https://plausible.io/api/v1/stats/breakdown";
  const url = `${root}?site_id=${siteId}&period=${period}&property=${property}&limit=${limit}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return (await response.json()) as any;
}

// TBD: This is a sorry hack, we should get the titles locally or from Plausible.
async function getPageTitle(url: string) {
  const response = await fetch(url);
  const src = await response.text();
  const matches = src.match(/<title>([^<]*)<\/title>/);
  return matches ? matches[1] : "";
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const apiKey = process.env.PLAUSIBLE_KEY;
  if (!apiKey) {
    response.status(500).send("Missing API key in env");
    return;
  }
  const report = await queryTopPages(apiKey);
  const topArticles = report.results
    // We only want regular articles
    .filter((item) => item.page.match("^/clanky"))
    // Convert to expected format
    .map((item) => ({
      url: item.page,
    }))
    // Only take 10
    .slice(0, 10);
  const articlesWithTitles = await Promise.all(
    topArticles.map(async (item) => ({
      title: await getPageTitle("https://ohlasy.info" + item.url),
      ...item,
    }))
  );
  const out = JSON.stringify(articlesWithTitles, null, 2);
  response.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(out);
};