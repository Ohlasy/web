import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import {
  getArticlesByAuthor,
  sum,
  renderCSV,
  filterByYear,
} from "src/data-source/content-stats";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");
  const year = typeof yearParam === "string" ? parseInt(yearParam) : undefined;
  const articles = getAllArticles(articleRoot).filter(filterByYear(year));
  const stats = sum(getArticlesByAuthor(articles));
  return new Response(renderCSV(stats), {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/csv",
    },
  });
}
