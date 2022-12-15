import Markdoc from "@markdoc/markdoc";
import { ArticleContent } from "components/ArticleContent";
import { BannerBox } from "components/BannerBox";
import { Layout } from "components/Layout";
import { PreviewNest9 } from "components/PreviewNest";
import fs from "fs";
import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import {
  Article,
  compareByDate,
  Metadata,
  readArticle,
  stripBody,
} from "src/article";
import { Banner } from "src/data-source/banners";
import { getCachedData } from "src/data-source/cache";
import { Author } from "src/data-source/content";
import {
  articleRoot,
  getFilesRecursively,
  getFileSystemPathForUrlPathFragments,
  getUrlPathFragmentsForFileSystemPath,
} from "src/server-utils";
import { endlessGeneratorOf, filterUndefines, tilde } from "src/utils";

//
// Page
//

type PageProps = {
  author: Author;
  article: Article;
  banners: Banner[];
  relatedArticles: Metadata[];
  serialIntroPost?: string;
};

interface QueryParams extends ParsedUrlQuery {
  path: string[];
}

const Page: NextPage<PageProps> = ({
  article,
  author,
  banners,
  relatedArticles,
  serialIntroPost,
}) => {
  const bannerGenerator = endlessGeneratorOf(banners);
  const getNextBanner = () => bannerGenerator.next().value;
  return (
    <Layout
      title={article.title}
      description={article.perex}
      image={article.coverPhoto}
    >
      <main className="container">
        <div className="row article-row">
          <article className="col-md-8">
            <Title article={article} />
            <ArticleContent src={article.body} />
            <InfoBox article={article} author={author} />
          </article>
          <Sidebar
            serialIntroPost={serialIntroPost}
            getBanner={getNextBanner}
          />
        </div>
      </main>
      {relatedArticles.length >= 9 && (
        <div className="container">
          <h2 className="section-divider">další {article.category}</h2>
          <PreviewNest9 articles={relatedArticles} getBanner={getNextBanner} />
        </div>
      )}
    </Layout>
  );
};

const Title: React.FC<Pick<PageProps, "article">> = ({ article }) =>
  article.category === "názory a komentáře" ? (
    <h2 className="main-header">
      {article.author}: {tilde(article.title)}
    </h2>
  ) : (
    <h2 className="main-header">{tilde(article.title)}</h2>
  );

type SidebarProps = {
  serialIntroPost?: string;
  getBanner: () => Banner;
};

const Sidebar: React.FC<SidebarProps> = ({ serialIntroPost, getBanner }) => {
  if (serialIntroPost) {
    const document = Markdoc.transform(Markdoc.parse(serialIntroPost));
    const renderTree = Markdoc.renderers.react(document, React);
    return (
      <aside className="col-md-4 text-muted">
        <h2 className="sidebar-header">O seriálu</h2>
        {renderTree}
      </aside>
    );
  } else {
    return (
      <aside className="col-md-4 hidden-sm hidden-xs">
        <div className="box">
          <BannerBox banner={getBanner()} />
        </div>
        <div className="box">
          <BannerBox banner={getBanner()} />
        </div>
      </aside>
    );
  }
};

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
    console.error(`Cannot find article path for “${path.join("/")}”.`);
    return { notFound: true };
  }

  const article = readArticle(articlePath);
  const { banners, articles, authors } = await getCachedData();

  const serialIntroPost =
    article.category === "seriály"
      ? // TBD: Add path routing similar to Route
        fs.readFileSync(`content/serials/${article.serial}.md`, "utf-8")
      : undefined;

  const author = authors.find((a) => a.name === article.author)!;
  const relatedArticles = articles
    .filter((a) => a.category === article.category)
    .filter((a) => a.date !== article.date)
    .sort(compareByDate)
    .map(stripBody)
    .slice(0, 10);

  return {
    props: filterUndefines({
      article,
      author,
      banners,
      relatedArticles,
      serialIntroPost,
    }),
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
