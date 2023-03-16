import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import { unique } from "src/utils";

export function GET() {
  const articles = getAllArticles(articleRoot);
  const years = unique(
    articles.map((article) => new Date(article.date).getFullYear())
  );

  let csv = `rok;"počet autorů";"počet autorek"\n`;
  for (const year of years) {
    const matchingArticles = articles.filter(
      (a) => new Date(a.date).getFullYear() === year
    );
    const authors = unique(matchingArticles.map((a) => a.author));
    const isWoman = (name: string) =>
      name === "Pál" ||
      name === "Morris" ||
      name.endsWith("ová") ||
      name.endsWith("ská");
    const womanAuthors = authors.filter(isWoman).length;
    const manAuthors = authors.length - womanAuthors;
    csv += `${year},${manAuthors},${womanAuthors}\n`;
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
