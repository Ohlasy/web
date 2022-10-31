import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const apiToken = process.env.FIO_API_KEY as string;
  const msPerDay = 1000 * 3600 * 24;
  const endDate = new Date();
  const startDate = new Date(Date.now() - 30 * msPerDay);
  const txUrl = buildTransactionListUrl(apiToken, startDate, endDate);
  const bankResponse = await fetch(txUrl);
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=60, stale-while-revalidate=86400"
  );
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(JSON.stringify(await bankResponse.json(), null, 2));
};

function buildTransactionListUrl(
  apiToken: string,
  fromDate: Date,
  toDate: Date
): string {
  const from = formatDate(fromDate);
  const to = formatDate(toDate);
  return `https://www.fio.cz/ib_api/rest/periods/${apiToken}/${from}/${to}/transactions.json`;
}

/** Format date to a string used in the API (YYYY-MM-dd) */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const fmt = (x: number) => x.toString().padStart(2, "0");
  return [year, month, day].map(fmt).join("-");
}
