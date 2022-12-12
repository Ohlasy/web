import axios from "axios";

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
  const response = await axios.get(endpoint, {
    params: {
      apiId,
      apiSecret,
      ...params,
    },
  });
  return extract(response.data);
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