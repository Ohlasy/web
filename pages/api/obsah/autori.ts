import {
  getArticleIndex,
  getArticlesByAuthor,
  sum,
  send,
  renderCSV,
} from "./_shared";

export default send("text/csv", async () => {
  const articles = await getArticleIndex();
  const stats = sum(getArticlesByAuthor(articles));
  return renderCSV(stats);
});
