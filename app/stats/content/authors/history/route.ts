import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { unique } from "src/utils";

export function GET() {
  const articles = getAllArticles(articleRoot);
  const years = unique(
    articles.map((article) => new Date(article.date).getFullYear())
  ).slice(0, -1);
  const authors = unique(articles.map((a) => a.author)).filter(
    (author) =>
      articles.filter((article) => article.author === author).length >= 10
  );

  let csv = `Rok,${authors.map((a) => `"${a}"`).join(",")}\n`;
  for (const year of years) {
    const yearlyArticles = articles.filter(
      (a) => new Date(a.date).getFullYear() === year
    );
    const counts = authors.map(
      (author) =>
        yearlyArticles.filter((article) => article.author === author).length
    );
    csv += `${year},${counts.join(",")}\n`;
  }

  return new Response(csv, {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/csv",
    },
  });
}
