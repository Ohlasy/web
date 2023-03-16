import {
  getOneTimeDonations,
  getRecurrentDonations,
  getTransactions,
} from "src/data-source/darujme";

export async function GET() {
  const apiId = process.env.DARUJME_ID;
  const apiSecret = process.env.DARUJME_SECRET;
  if (!apiId || !apiSecret) {
    return new Response("Missing Darujme auth in env", { status: 500 });
  }

  const oneYearBack = 365;
  const msPerDay = 1000 * 3600 * 24;
  const endDate = new Date();
  const startDate = new Date(Date.now() - oneYearBack * msPerDay);
  const txs = await getTransactions(apiId, apiSecret, startDate, endDate);
  const repeatingDonations = getRecurrentDonations(txs);
  const oneTimeDonations = getOneTimeDonations(txs);

  let csv = `pravidelné dary; ${repeatingDonations}\n`;
  csv += `jednorázové dary; ${oneTimeDonations}\n`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Cache-Control": "max-age=0, s-maxage=84600, stale-while-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/csv",
    },
  });
}
