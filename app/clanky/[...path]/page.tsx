import { readArticle, renderArticleBody } from "src/article";
import { getFilesRecursively } from "src/utils";
import {
  articleRoot,
  getFileSystemPathForUrlPathFragments,
  getUrlPathFragmentsForFileSystemPath,
} from "src/routing";

export type StaticParams = {
  path: string[];
};

export type PageProps = {
  params: StaticParams;
};

const Page = ({ params }: PageProps) => {
  const { path } = params;
  const articlePath = getFileSystemPathForUrlPathFragments(path);
  if (!articlePath) {
    throw `Cannot find article path for “${path.join("/")}”.`;
  }
  // TBD: Do we still need to filter undefineds here? If not, can we
  // start using regular objects such as Date without keeping them in strings?
  const article = readArticle(articlePath);
  const html = renderArticleBody(article.body);
  return (
    <div>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  );
};

// TBD: It would be great if we could pass the filesystem path of the article
// along with the path segments, then we wouldn’t have to search for it again
// above and we wouldn’t even have to check for the possible error.
export const generateStaticParams = async (): Promise<StaticParams[]> =>
  // Get all article paths
  getFilesRecursively(articleRoot)
    // Filter out garbage
    .filter((path) => path.endsWith(".md"))
    // Convert date and slug to path fragments such as ["2022", "10", "obrana-drahy.html"]
    // TBD: What about the .html extension, is it supposed to be here? I think not.
    .map(getUrlPathFragmentsForFileSystemPath)
    // Store path in the format expected by router
    .map((path) => ({ path }));

export default Page;
