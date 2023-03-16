import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { unique } from "src/utils";

export function GET() {
  const articles = getAllArticles(articleRoot);
  const years = unique(
    articles.map((article) => new Date(article.date).getFullYear())
  );

  let csv = `rok;"článků celkem";"článků od hlavního autora"\n`;
  for (const year of years) {
    const allYearArticles = articles.filter(
      (a) => new Date(a.date).getFullYear() === year
    );
    const matchingArticles = allYearArticles.filter(
      (a) => a.author === "Tomáš Trumpeš"
    );
    csv += `${year},${allYearArticles.length},${matchingArticles.length}\n`;
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
