import { getAllArticles } from "src/article";
import { getArticlePath } from "src/routing";
import { articleRoot } from "src/server-utils";
import {
  array,
  decodeType,
  number,
  record,
  string,
} from "typescript-json-decoder";

//
// Plausible support
//

type TopPageResponse = decodeType<typeof decodeTopPageResponse>;
const decodeTopPageResponse = record({
  results: array(
    record({
      page: string,
      visitors: number,
    })
  ),
});

async function queryTopPages(
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
    cache: "force-cache",
  });
  return decodeTopPageResponse(await response.json());
}

//
// Public API
//

export type TopArticles = { path: string; title?: string }[];

export async function getTopArticles(
  plausibleApiKey = process.env.PLAUSIBLE_KEY ?? ""
): Promise<TopArticles> {
  const report = await queryTopPages(plausibleApiKey);
  const allArticles = getAllArticles(articleRoot);
  // TBD: This is very inefficient
  const getPageTitle = (path: string) =>
    allArticles.find((a) => getArticlePath(a) === path)?.title;
  return (
    report.results
      // We only want regular articles
      .filter((item) => item.page.match("^/clanky"))
      // Convert to expected format
      .map((item) => ({
        path: item.page,
        title: getPageTitle(item.page),
      }))
      // Only take 10
      .slice(0, 10)
  );
}

export type PlausibleCustomGoal = {
  name: "Internal Link";
  type: string;
};

export const plausibleEventClass = ({ type }: PlausibleCustomGoal) =>
  `plausible-event-name=Internal+Link plausible-event-type=${type}`;
