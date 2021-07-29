import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getOneTimeDonations,
  getRecurrentDonations,
  getTransactions,
  Transaction,
} from "./_shared";

export interface Month {
  /** Number of month, 1-based */
  month: number;
  /** Full year */
  year: number;
}

export interface MonthlyReport {
  month: Month;
  transactions: Transaction[];
}

export function getPastFullMonths(fromDate: Date, count: number): Month[] {
  let out: Month[] = [];
  for (let m = 1; m <= count; m++) {
    const date = new Date(fromDate.getFullYear(), fromDate.getMonth() - m, 1);
    out.push({ month: date.getMonth() + 1, year: date.getFullYear() });
  }
  return out;
}

export function firstDayOfMonth(month: Month): Date {
  return new Date(month.year, month.month - 1, 1);
}

export function lastDayOfMonth(month: Month): Date {
  return new Date(month.year, month.month, 0);
}

export async function getPastYearTransactionsByMonth(
  apiId: string,
  apiSecret: string
): Promise<MonthlyReport[]> {
  let report: MonthlyReport[] = [];
  for (const month of getPastFullMonths(new Date(), 12)) {
    const fromDate = firstDayOfMonth(month);
    const toDate = lastDayOfMonth(month);
    const txs = await getTransactions(apiId, apiSecret, fromDate, toDate);
    report.push({
      month: month,
      transactions: txs,
    });
  }
  return report;
}

export default async (
  request: VercelRequest,
  response: VercelResponse
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
