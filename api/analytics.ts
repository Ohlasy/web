import { VercelRequest, VercelResponse } from "@vercel/node";
import { JWT } from "google-auth-library";

export async function queryAnalytics<Response>(
  email: string,
  privateKey: string,
  options: Record<string, string>
): Promise<Response> {
  const client = new JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
  });
  const response = await client.request<Response>({
    url: buildAnalyticsUrl(options),
  });
  return response.data;
}

export async function queryTopArticles(email: string, privateKey: string) {
  interface Response {
    rows: string[][];
  }

  const options = {
    "ids": "ga:97173197",
    "start-date": "60daysAgo",
    "end-date": "yesterday",
    "metrics": "ga:pageviews",
    "dimensions": "ga:pagePath,ga:pageTitle",
    "sort": "-ga:pageviews",
    "filters": "ga:pagePath=@/clanky/20",
    "max-results": "10",
  };
  const response: Response = await queryAnalytics(email, privateKey, options);
  return response.rows.map((row) => {
    return {
      url: row[0],
      title: row[1],
    };
  });
}

export function buildAnalyticsUrl(options: Record<string, string>): string {
  const baseUrl = "https://www.googleapis.com/analytics/v3/data/ga";
  const params = new URLSearchParams(options);
  return baseUrl + "?" + params.toString();
}

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const mail = process.env.ANALYTICS_MAIL;
  const key = process.env.ANALYTICS_KEY;
  const report = await queryTopArticles(mail, key);
  const out = JSON.stringify(report, null, 2);
  response.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(out);
};
