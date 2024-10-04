import { getAllArticles, stripBody } from "src/article";
import { ArchiveView } from "./ArchiveView";
import { buildFilterOptions } from "./filters";
import { Suspense } from "react";

async function Page() {
  const articles = getAllArticles("content/articles").map(stripBody);
  const filterOptions = buildFilterOptions(articles);
  return (
    <Suspense fallback="Nahrávám…">
      <ArchiveView allArticles={articles} filterOptions={filterOptions} />
    </Suspense>
  );
}

export default Page;
