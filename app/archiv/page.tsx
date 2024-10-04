import { getAllArticles } from "src/article";
import { ArchiveView } from "./ArchiveView";
import { buildFilterOptions } from "./filters";

async function Page() {
  const articles = getAllArticles("content/articles");
  const filterOptions = buildFilterOptions(articles);
  return <ArchiveView allArticles={articles} filterOptions={filterOptions} />;
}

export default Page;
