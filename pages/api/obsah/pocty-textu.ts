import {
  getArticleIndex,
  send,
  renderCSV,
} from "src/data-source/content-stats";

export default send("text/csv", async () => {
  let stats: Record<string, number> = {};
  const articles = await getArticleIndex();
  articles.forEach((article) => {
    const pubDate = new Date(article.pubDate);
    const month = `${pubDate.getMonth() + 1}/${pubDate.getFullYear()}`;
    stats[month] = stats[month] ? stats[month] + 1 : 1;
  });
  return renderCSV(stats);
});
