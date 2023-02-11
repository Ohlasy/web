import { NextApiRequest, NextApiResponse } from "next";
import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { unique } from "src/utils";

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const articles = getAllArticles(articleRoot);
  const years = unique(
    articles.map((article) => new Date(article.date).getFullYear())
  ).slice(0, -1);
  const authors = unique(articles.map((a) => a.author));
  response.setHeader("Cache-Control", `s-maxage=3600, stale-while-revalidate`);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "text/csv");
  response.status(200);
  response.write(`Rok,${authors.map((a) => `"${a}"`).join(",")}\n`);
  for (const year of years) {
    const yearlyArticles = articles.filter(
      (a) => new Date(a.date).getFullYear() === year
    );
    const counts = authors.map(
      (author) =>
        yearlyArticles.filter((article) => article.author === author).length
    );
    response.write(`${year},${counts.join(",")}\n`);
  }
  response.end();
}
