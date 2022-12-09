import { Article, getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { send, renderCSV } from "src/data-source/content-stats";

const readingSpeedInWordsPerMinute = 200;

const countWords = (str: string) => str.split(/\s+/).length;

const readingTime = (article: Article) =>
  countWords(article.body) / readingSpeedInWordsPerMinute;

export default send("text/csv", async () => {
  const articles = getAllArticles(articleRoot);
  let stats: Record<string, number> = {};
  for (const article of articles) {
    const dateStamp = new Date(article.date).toISOString();
    stats[dateStamp] = readingTime(article);
  }
  return renderCSV(stats);
});
