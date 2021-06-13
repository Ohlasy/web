import { getArticleIndex, getArticlesByAuthor, sum } from "./_articles";
import { send, renderCSV } from "./_utils";

export default send("text/csv", async () => {
  const articles = await getArticleIndex();
  const stats = sum(getArticlesByAuthor(articles));
  return renderCSV(stats);
});
