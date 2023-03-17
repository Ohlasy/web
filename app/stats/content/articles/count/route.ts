import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { renderCSV } from "app/stats/content-stats";

export async function GET() {
  let stats: Record<string, number> = {};
  const articles = getAllArticles(articleRoot);
  articles.forEach((article) => {
    const pubDate = new Date(article.date);
    const month = `${pubDate.getMonth() + 1}/${pubDate.getFullYear()}`;
    stats[month] = stats[month] ? stats[month] + 1 : 1;
  });
  return new Response(renderCSV(stats), {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/csv",
    },
  });
}
