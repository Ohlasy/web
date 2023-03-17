import { Article, getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { renderCSV } from "src/data-source/content-stats";

const readingSpeedInWordsPerMinute = 200;

const countWords = (str: string) => str.split(/\s+/).length;

const readingTime = (article: Article) =>
  countWords(article.body) / readingSpeedInWordsPerMinute;

export async function GET() {
  const articles = getAllArticles(articleRoot);
  let stats: Record<string, number> = {};
  for (const article of articles) {
    const dateStamp = new Date(article.date).toISOString();
    stats[dateStamp] = readingTime(article);
  }
  return new Response(renderCSV(stats), {
    status: 200,
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/csv",
    },
  });
}
