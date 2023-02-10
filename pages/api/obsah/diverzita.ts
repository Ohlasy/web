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
    const matchingArticles = articles.filter(
      (a) => new Date(a.date).getFullYear() === year
    );
    const authors = unique(matchingArticles.map((a) => a.author));
    const isWoman = (name: string) =>
      name === "Pál" ||
      name === "Morris" ||
      name.endsWith("ová") ||
      name.endsWith("ská");
    const womanAuthors = authors.filter(isWoman).length;
    const manAuthors = authors.length - womanAuthors;
    response.write(`${year},${manAuthors},${womanAuthors}\n`);
  }
  response.end();
}
