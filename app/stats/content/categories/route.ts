import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import {
  getArticlesByCategory,
  sum,
  renderCSV,
  filterByYear,
} from "src/data-source/content-stats";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");
  const year = typeof yearParam === "string" ? parseInt(yearParam) : undefined;
  const articles = getAllArticles(articleRoot).filter(filterByYear(year));
  const stats = sum(getArticlesByCategory(articles));
  return new Response(renderCSV(stats), {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/csv",
    },
  });
}
