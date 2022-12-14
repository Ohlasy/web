import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import {
  getArticlesByCategory,
  sum,
  send,
  renderCSV,
} from "src/data-source/content-stats";

export default send("text/csv", async () => {
  const articles = getAllArticles(articleRoot);
  const stats = sum(getArticlesByCategory(articles));
  return renderCSV(stats);
});
