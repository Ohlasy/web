import {
  filterByYear,
  getArticlesByCategory,
  renderCSV,
  sum,
} from "app/stats/content-stats";
import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");
  const year =
    typeof yearParam === "string" ? parseInt(yearParam, 10) : undefined;
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
