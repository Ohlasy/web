import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { Article, parsePath, readArticle } from "src/article";
import { filterUndefines, getFilesRecursively } from "src/utils";
import { marked } from "marked";

export type PageProps = {
  article: Article;
};

interface QueryParams extends ParsedUrlQuery {
  path: string[];
}
const Page: NextPage<PageProps> = ({ article }) => {
  const toHTML = (str: string) =>
    marked.parse(str, {
      breaks: true,
      pedantic: false,
      smartypants: false,
    });
  return (
    <div>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: toHTML(article.body) }}></div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<PageProps, QueryParams> = async (
  context
) => {
  const { path } = context.params!;
  const [year, month, slug] = path;
  const nakedSlug = slug.replace(".html", "");
  const filePath = getFilesRecursively(`content/articles/${year}/${+month}`)
    // This is a sad hack, see longer comment below. The URL path
    // does not identify the article uniquely, so we just use some
    // simple heuristic to find it in the appropriate folder.
    // TBD: should we even rely on the folder structure, or should
    // we just parse all articles into some structure and query that?
    .find((path) => path.endsWith(`${nakedSlug}.md`));
  if (!filePath) {
    throw `Cannot find article path for “${path.join("/")}”.`;
  }
  const article = filterUndefines(readArticle(filePath));
  return {
    props: { article },
    revalidate: 300, // update every 5 minutes
  };
};

/**
 * The routing is slightly stupid (for historic reasons), since the
 * month format differs on disk (“5” for May) and in the URL (“05” for May)
 * _and_ the URL path is not enough to uniquely identify an article, since
 * there the filesystem path also contains the day of publication that’s
 * absent in the URL. These differences have to be taken into account when
 * reading static props for the page above.
 */
export const getStaticPaths: GetStaticPaths<QueryParams> = async () => {
  const getPathFragments = ([date, slug]: [Date, string]) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const paddedMonth = String(month).padStart(2, "0");
    return [`${year}`, paddedMonth, `${slug}.html`];
  };
  const paths = getFilesRecursively("content/articles")
    // Get all article paths
    .filter((path) => path.endsWith(".md"))
    // Parse out date and slug
    .map(parsePath)
    // Convert date and slug to path fragments such as ["2022", "10", "obrana-drahy.html"]
    .map(getPathFragments)
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
