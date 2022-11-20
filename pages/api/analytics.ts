import { NextApiRequest, NextApiResponse } from "next";
import { queryTopPages } from "src/data-source/plausible";
import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { getArticlePath } from "src/routing";

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const apiKey = process.env.PLAUSIBLE_KEY;
  if (!apiKey) {
    response.status(500).send("Missing API key in env");
    return;
  }
  const report = await queryTopPages(apiKey);
  const allArticles = getAllArticles(articleRoot);
  // TBD: This is very inefficient
  const getPageTitle = (path: string) =>
    allArticles.find((a) => getArticlePath(a) === path)?.title;
  const topArticles = report.results
    // We only want regular articles
    .filter((item) => item.page.match("^/clanky"))
    // Convert to expected format
    .map((item) => ({
      url: item.page,
      title: getPageTitle(item.page),
    }))
    // Only take 10
    .slice(0, 10);
  const out = JSON.stringify(topArticles, null, 2);
  response.setHeader("Cache-Control", "max-age=0, s-maxage=86400");
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(out);
};
