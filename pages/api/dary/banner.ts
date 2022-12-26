import { NextApiRequest, NextApiResponse } from "next";
import { getTransactions, sumTransactions } from "src/data-source/darujme";
import { Duration } from "src/utils";

const targetAmount = 200_000;

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
  const msPerYear = 365 * Duration.oneDay * 1000;
  const endDate = new Date();
  const startDate = new Date(Date.now() - msPerYear);
  const txs = await getTransactions(apiId, apiSecret, startDate, endDate);
  const sum = sumTransactions(txs);
  const percentage = Math.floor((sum / targetAmount) * 100);
  response.setHeader(
    "Cache-Control",
    `max-age=${Duration.oneDay}, s-maxage=${Duration.oneDay}, stale-while-revalidate`
  );
  response.redirect(`/api/dary/banner-image/?percentage=${percentage}`);
};
