import {
  array,
  decodeType,
  number,
  record,
  string,
} from "typescript-json-decoder";

export type TopPageResponse = decodeType<typeof decodeTopPageResponse>;
export const decodeTopPageResponse = record({
  results: array(
    record({
      page: string,
      visitors: number,
    })
  ),
});

export async function queryTopPages(
  apiKey: string,
  siteId = "ohlasy.info",
  period = "30d",
  property = "event:page",
  limit = 15
): Promise<TopPageResponse> {
  const root = "https://plausible.io/api/v1/stats/breakdown";
  const url = `${root}?site_id=${siteId}&period=${period}&property=${property}&limit=${limit}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  return decodeTopPageResponse(await response.json());
}
