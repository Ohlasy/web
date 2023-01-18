import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import {
  getArticlesByAuthor,
  sum,
  renderCSV,
  filterByYear,
} from "src/data-source/content-stats";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    const year =
      typeof request.query.year === "string"
        ? parseInt(request.query.year)
        : undefined;
    const articles = getAllArticles(articleRoot).filter(filterByYear(year));
    const stats = sum(getArticlesByAuthor(articles));
    response.setHeader(
      "Cache-Control",
      `s-maxage=3600, stale-while-revalidate`
    );
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Content-Type", "text/csv");
    response.status(200).send(renderCSV(stats));
  } catch {
    response.status(500).send("Error loading source data.");
  }
}
