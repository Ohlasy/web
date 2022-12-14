import { getAllArticles } from "src/article";
import { articleRoot } from "src/server-utils";
import {
  getArticlesByAuthor,
  sum,
  send,
  renderCSV,
} from "src/data-source/content-stats";

export default send("text/csv", async () => {
  const articles = getAllArticles(articleRoot);
  const stats = sum(getArticlesByAuthor(articles));
  return renderCSV(stats);
});
