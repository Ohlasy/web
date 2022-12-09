import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { send, renderCSV } from "src/data-source/content-stats";

export default send("text/csv", async () => {
  let stats: Record<string, number> = {};
  const articles = getAllArticles(articleRoot);
  articles.forEach((article) => {
    const pubDate = new Date(article.date);
    const month = `${pubDate.getMonth() + 1}/${pubDate.getFullYear()}`;
    stats[month] = stats[month] ? stats[month] + 1 : 1;
  });
  return renderCSV(stats);
});
