import { NextApiRequest, NextApiResponse } from "next";
import {
  getOneTimeDonations,
  getRecurrentDonations,
  getTransactions,
} from "src/darujme";

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const apiId = process.env.DARUJME_ID;
  const apiSecret = process.env.DARUJME_SECRET;
  if (!apiId || !apiSecret) {
    response.status(500).send("Missing Darujme auth in env");
    return;
  }
  const oneYearBack = 365;
  const msPerDay = 1000 * 3600 * 24;
  const endDate = new Date();
  const startDate = new Date(Date.now() - oneYearBack * msPerDay);
  const txs = await getTransactions(apiId, apiSecret, startDate, endDate);
  const repeatingDonations = getRecurrentDonations(txs);
  const oneTimeDonations = getOneTimeDonations(txs);
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=60, stale-while-revalidate=86400"
  );
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "text/csv");
  response.status(200);
  response.write(`pravidelné dary; ${repeatingDonations}\n`);
  response.write(`jednorázové dary; ${oneTimeDonations}\n`);
  response.end();
};
