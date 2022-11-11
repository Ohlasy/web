import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { Article, readArticle } from "src/article";
import { filterUndefines, getFilesRecursively } from "src/utils";
import { ArticleContent } from "components/ArticleContent";
import {
  articleRoot,
  getFileSystemPathForUrlPathFragments,
  getUrlPathFragmentsForFileSystemPath,
} from "src/routing";

export type PageProps = {
  article: Article;
};

interface QueryParams extends ParsedUrlQuery {
  path: string[];
}
const Page: NextPage<PageProps> = ({ article }) => (
  <>
    <h2>{article.title}</h2>
    <ArticleContent src={article.body} />
  </>
);

export const getStaticProps: GetStaticProps<PageProps, QueryParams> = async ({
  params,
}) => {
  const { path } = params!;
  const articlePath = getFileSystemPathForUrlPathFragments(path);
  if (!articlePath) {
    throw `Cannot find article path for “${path.join("/")}”.`;
  }
  const article = filterUndefines(readArticle(articlePath));
  return {
    props: { article },
    revalidate: 300, // update every 5 minutes
  };
};

// TBD: It’s a shame we can’t pass the article filesystem path along with
// the params and have to search for it in `getStaticProps` above again.
export const getStaticPaths: GetStaticPaths<QueryParams> = async () => {
  const paths = getFilesRecursively(articleRoot)
    // Get all article paths
    .filter((path) => path.endsWith(".md"))
    // Convert date and slug to path fragments such as ["2022", "10", "obrana-drahy.html"]
    .map(getUrlPathFragmentsForFileSystemPath)
    // Store path in the format expected by router
    .map((fragments) => ({
      params: {
        path: fragments,
      },
    }));
  return {
    paths,
    fallback: false,
  };
};

export default Page;
