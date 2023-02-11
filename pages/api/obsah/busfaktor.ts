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
  );
  response.setHeader("Cache-Control", `s-maxage=3600, stale-while-revalidate`);
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Content-Type", "text/csv");
  response.status(200);
  for (const year of years) {
    const allYearArticles = articles.filter(
      (a) => new Date(a.date).getFullYear() === year
    );
    const matchingArticles = allYearArticles.filter(
      (a) => a.author === "Tomáš Trumpeš"
    );
    response.write(
      `${year},${allYearArticles.length},${matchingArticles.length}\n`
    );
  }
  response.end();
}
