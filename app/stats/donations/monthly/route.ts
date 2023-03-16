import {
  sumOneTimeDonations,
  getPastYearTransactionsByMonth,
  sumRecurrentDonations,
} from "src/data-source/darujme";

export async function GET() {
  const apiId = process.env.DARUJME_ID;
  const apiSecret = process.env.DARUJME_SECRET;
  if (!apiId || !apiSecret) {
    return new Response("Missing Darujme auth in env", { status: 500 });
  }

  const report = await getPastYearTransactionsByMonth(apiId, apiSecret);
  let csv = "měsíc; pravidelné dary; jednorázové dary\n";
  for (const month of report) {
    const recurring = sumRecurrentDonations(month.transactions);
    const oneTime = sumOneTimeDonations(month.transactions);
    csv += `${month.month.month}/${month.month.year}; ${recurring}; ${oneTime}\n`;
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
