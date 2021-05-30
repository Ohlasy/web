import { VercelRequest, VercelResponse } from "@vercel/node";
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

export interface GiftReport {
  fromDate: Date;
  toDate: Date;
  timestamp: Date;
  totalTransactions: number;
  recurrentDonations: number;
  oneTimeDonations: number;
  totalDonations: number;
  summary?: string;
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

export async function getDonationsReport(
  apiId: string,
  apiSecret: string,
  reportingPeriodDays: number
): Promise<GiftReport> {
  const msPerDay = 1000 * 3600 * 24;
  const endDate = new Date();
  const startDate = new Date(Date.now() - reportingPeriodDays * msPerDay);
  const txs = await getTransactions(apiId, apiSecret, startDate, endDate);
  const report: GiftReport = {
    fromDate: startDate,
    toDate: endDate,
    timestamp: new Date(),
    totalTransactions: txs.length,
    recurrentDonations: getRecurrentDonations(txs),
    oneTimeDonations: getOneTimeDonations(txs),
    totalDonations: getRecurrentDonations(txs) + getOneTimeDonations(txs),
  };
  report.summary = renderDonationReportSummary(report);
  return report;
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

export function renderDonationReportSummary(report: GiftReport): string {
  const locale = "cs-CZ";
  const fmtd = new Intl.DateTimeFormat(locale).format;
  const fmtc = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format;
  const text = `
    Od ${fmtd(report.fromDate)} do ${fmtd(report.toDate)} nám čtenáři
    poslali celkem ${fmtc(report.totalDonations)}, z toho
    ${fmtc(report.recurrentDonations)} dělají opakované dary
    a ${fmtc(report.oneTimeDonations)} dary jednorázové.
    `
    .replace(/\n\s*/g, " ")
    .trim();
  return text;
}

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const apiId = process.env.DARUJME_ID;
  const apiSecret = process.env.DARUJME_SECRET;
  const oneYearBack = 365;
  const report = await getDonationsReport(apiId, apiSecret, oneYearBack);
  const out = JSON.stringify(report, null, 2);
  response.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(out);
};
