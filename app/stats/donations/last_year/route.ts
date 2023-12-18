import {
  sumOneTimeDonations,
  sumRecurrentDonations,
  getPastYearTransactionsByMonth,
} from "src/data-source/darujme";

export async function GET() {
  const apiId = process.env.DARUJME_ID;
  const apiSecret = process.env.DARUJME_SECRET;
  if (!apiId || !apiSecret) {
    return new Response("Missing Darujme auth in env", { status: 500 });
  }

  const report = await getPastYearTransactionsByMonth(apiId, apiSecret);
  let repeatingDonations = 0;
  let oneTimeDonations = 0;
  for (const month of report) {
    repeatingDonations += sumRecurrentDonations(month.transactions);
    oneTimeDonations += sumOneTimeDonations(month.transactions);
  }

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
