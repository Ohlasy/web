import { getPastYearTransactionsByMonth } from "src/data-source/darujme";
import { unique } from "src/utils";

export async function GET(): Promise<Response> {
  const apiId = process.env.DARUJME_ID;
  const apiSecret = process.env.DARUJME_SECRET;
  if (!apiId || !apiSecret) {
    return new Response("Missing Darujme auth in env", { status: 500 });
  }

  let csv = `měsíc; počet pravidelných dárců\n`;

  const report = await getPastYearTransactionsByMonth(apiId, apiSecret);
  for (const month of report) {
    const recurrentPledgeIds = month.transactions
      .filter((tx) => tx.pledge.isRecurrent)
      .map((tx) => tx.pledge.pledgeId);
    const count = unique(recurrentPledgeIds).length;
    csv += `${month.month.month}/${month.month.year}; ${count}\n`;
  }

  return new Response(csv, {
    status: 200,
    headers: {
      "Cache-Control": "max-age=0, s-maxage=86400, stale-while-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/csv",
    },
  });
}
