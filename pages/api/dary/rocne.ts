import { NextApiRequest, NextApiResponse } from "next";
import {
  getOneTimeDonations,
  getPastYearTransactionsByMonth,
  getRecurrentDonations,
} from "src/data-source/darujme";

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
  const report = await getPastYearTransactionsByMonth(apiId, apiSecret);
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=60, stale-while-revalidate=86400"
  );
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "text/csv");
  response.status(200);
  response.write("měsíc; pravidelné dary; jednorázové dary\n");
  for (const month of report) {
    const recurring = getRecurrentDonations(month.transactions);
    const oneTime = getOneTimeDonations(month.transactions);
    response.write(
      `${month.month.month}/${month.month.year}; ${recurring}; ${oneTime}\n`
    );
  }
  response.end();
};
