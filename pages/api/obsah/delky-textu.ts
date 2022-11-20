import {
  getArticleIndex,
  send,
  renderCSV,
} from "src/data-source/content-stats";

const readingSpeedInWordsPerMinute = 200;

export default send("text/csv", async () => {
  const articles = await getArticleIndex();
  let stats: Record<string, number> = {};
  for (const article of articles) {
    const dateStamp = new Date(article.pubDate).toISOString();
    stats[dateStamp] = article.numberOfWords / readingSpeedInWordsPerMinute;
  }
  return renderCSV(stats);
});
