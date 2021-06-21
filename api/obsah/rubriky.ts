import {
  getArticleIndex,
  getArticlesByCategory,
  sum,
  send,
  renderCSV,
} from "./_shared";

export default send("text/csv", async () => {
  const articles = await getArticleIndex();
  const stats = sum(getArticlesByCategory(articles));
  return renderCSV(stats);
});
