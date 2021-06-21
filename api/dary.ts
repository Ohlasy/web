import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getOneTimeDonations,
  getRecurrentDonations,
  getTransactions,
  GiftReport,
} from "./_darujme";

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
