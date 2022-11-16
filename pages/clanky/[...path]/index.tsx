import { GetStaticProps, GetStaticPaths, NextPage } from "next";
import { ParsedUrlQuery } from "querystring";
import { Article, readArticle } from "src/article";
import { filterUndefines, getFilesRecursively } from "src/utils";
import { ArticleContent } from "components/ArticleContent";
import { Layout } from "components/Layout";
import { Author, getAllAuthors } from "src/content";
import { Banner, getAllBanners, getAllBannersCached } from "src/banners";
import { BannerBox } from "components/BannerBox";
import Head from "next/head";
import {
  articleRoot,
  getFileSystemPathForUrlPathFragments,
  getUrlPathFragmentsForFileSystemPath,
} from "src/path-conversion";

//
// Page
//

type PageProps = {
  author: Author;
  article: Article;
  banners: Banner[];
};

interface QueryParams extends ParsedUrlQuery {
  path: string[];
}

const Page: NextPage<PageProps> = ({ article, author, banners }) => (
  <Layout title={article.title}>
    <Head>
      {/* eslint-disable-next-line @next/next/no-css-tags */}
      <link href="/article.css" rel="stylesheet" />
    </Head>
    <main className="container">
      <div className="row article-row">
        <article className="col-md-8">
          <Title article={article} />
          <ArticleContent src={article.body} />
          <InfoBox article={article} author={author} />
        </article>
        <Sidebar article={article} banners={banners} />
      </div>
    </main>
  </Layout>
);

const Title: React.FC<Pick<PageProps, "article">> = ({ article }) =>
  article.category === "názory a komentáře" ? (
    <h2 className="main-header">
      {article.author}: {article.title}
    </h2>
  ) : (
    <h2 className="main-header">{article.title}</h2>
  );

const Sidebar: React.FC<Pick<PageProps, "article" | "banners">> = ({
  article,
  banners,
}) =>
  !!article.serial ? (
    <aside className="col-md-4 text-muted">
      <h2 className="sidebar-header">O seriálu</h2>
      <p>TBD: Serial sidebar</p>
    </aside>
  ) : (
    <aside className="col-md-4 hidden-sm hidden-xs">
      <div className="box">
        <BannerBox banner={banners[0]} />
      </div>
      <div className="box">
        <BannerBox banner={banners[1]} />
      </div>
    </aside>
  );

// TBD: Add minimum box height for authors with no e-mail?
const InfoBox: React.FC<Pick<PageProps, "author" | "article">> = ({
  author,
  article,
}) => {
  const date = new Date(article.date).toLocaleDateString("cs-CZ", {
    dateStyle: "long",
  });
  return (
    <div className="article-info">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={author.profilePhotoUrl} alt="" className="profile-picture" />
      <ul className="list-unstyled">
        <li>{article.author}</li>
        {author.mail && (
          <li>
            <a href={`mailto:${author.mail}`}>{author.mail}</a>
          </li>
        )}
        {author.bio && <li className="text-muted">{author.bio}</li>}
        <li>vyšlo {date}</li>
      </ul>
    </div>
  );
};

//
// Data loading
//

export const getStaticProps: GetStaticProps<PageProps, QueryParams> = async ({
  params,
}) => {
  const { path } = params!;
  const articlePath = getFileSystemPathForUrlPathFragments(path);
  if (!articlePath) {
    throw `Cannot find article path for “${path.join("/")}”.`;
  }
  const article = readArticle(articlePath);
  const author = await getAllAuthors().then(
    (authors) => authors.find((a) => a.name === article.author)!
  );
  const banners = await getAllBannersCached();
  return {
    props: filterUndefines({ article, author, banners }),
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
