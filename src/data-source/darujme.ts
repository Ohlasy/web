import fetch from "node-fetch";

export interface TransactionResponse {
  transactions: Transaction[];
}

export interface Transaction {
  transactionId: number;
  sentAmount: Amount | null;
  pledge: Pledge;
}

export interface Amount {
  cents: number;
  currency: string;
}

export interface Pledge {
  pledgeId: number;
  isRecurrent: boolean;
}

async function call<T>(
  apiId: string,
  apiSecret: string,
  path: string,
  params: { [key: string]: string } = {},
  extract: (data: any) => T = (d: any) => d
): Promise<T> {
  const baseUrl = "https://www.darujme.cz/api/v1/organization/1200499";
  const endpoint = baseUrl + "/" + path;
  const response = await fetch(
    endpoint +
      "?" +
      new URLSearchParams({
        apiId,
        apiSecret,
        ...params,
      })
  );
  const json = await response.json();
  return extract(json);
}

export async function getTransactions(
  apiId: string,
  apiSecret: string,
  fromDate: Date,
  toDate: Date
): Promise<Transaction[]> {
  return call(
    apiId,
    apiSecret,
    "transactions-by-filter",
    {
      fromReceivedDate: formatDate(fromDate),
      toReceivedDate: formatDate(toDate),
    },
    (data) => data.transactions
  );
}

export const getRecurrentDonations = (txs: Transaction[]) =>
  sumTransactions(txs.filter((t) => t.pledge.isRecurrent));

export const getOneTimeDonations = (txs: Transaction[]) =>
  sumTransactions(txs.filter((t) => !t.pledge.isRecurrent));

export const sumTransactions = (txs: Transaction[]) =>
  txs.map((t) => t.sentAmount?.cents || 0).reduce((a, b) => a + b, 0) / 100;

/** Format date to a string used in the Darujme API (YYYY-MM-dd) */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const fmt = (x: number) => x.toString().padStart(2, "0");
  return [year, month, day].map(fmt).join("-");
}

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
