import Markdoc from "@markdoc/markdoc";
import { ArticleContent } from "app/clanky/[...path]/ArticleContent";
import { BannerBox } from "components/BannerBox";
import { PreviewNest9 } from "components/PreviewNest";
import fs from "fs";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { join } from "path";
import React from "react";
import Balancer from "react-wrap-balancer";
import { Article, compareByDate, readArticle } from "src/article";
import { Banner } from "src/data-source/banners";
import { getCachedData } from "src/data-source/cache";
import { Author } from "src/data-source/content";
import {
  articleRoot,
  getFilesRecursively,
  getFileSystemPathForUrlPathFragments,
  getUrlPathFragmentsForFileSystemPath,
} from "src/server-utils";
import {
  endlessGeneratorOf,
  getSignedResizedImage,
  IMAGE_SIGNING_KEY,
  tilde,
} from "src/utils";

type Params = {
  path: string[];
};

type Props = {
  params: Params;
};

const Page = async ({ params }: Props) => {
  const { path } = params!;
  const articlePath = getFileSystemPathForUrlPathFragments(path);
  if (!articlePath) {
    console.error(`Cannot find article path for “${path.join("/")}”.`);
    notFound();
  }

  const article = readArticle(articlePath);
  const { banners, articles, authors } = await getCachedData();

  const serialIntroPost =
    article.category === "seriály"
      ? // TBD: Add path routing similar to Route
        fs.readFileSync(
          join(process.cwd(), "content", "serials", article.serial + ".md"),
          "utf-8"
        )
      : undefined;

  const author = authors.find((a) => a.name === article.author)!;
  const relatedArticles = articles
    .filter((a) => a.category === article.category)
    .filter((a) => a.date !== article.date)
    .sort(compareByDate)
    .slice(0, 10);

  const bannerGenerator = endlessGeneratorOf(banners);
  const getNextBanner = () => bannerGenerator.next().value;
  return (
    <>
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
    </>
  );
};

const Title = ({ article }: { article: Article }) =>
  article.category === "názory a komentáře" ? (
    <h2 className="main-header">
      <Balancer>
        {article.author}: {tilde(article.title)}
      </Balancer>
    </h2>
  ) : (
    <h2 className="main-header">
      <Balancer>{tilde(article.title)}</Balancer>
    </h2>
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

type InfoBoxProps = {
  author: Author;
  article: Article;
};

// TBD: Add minimum box height for authors with no e-mail?
const InfoBox = ({ author, article }: InfoBoxProps) => {
  const date = new Date(article.date).toLocaleDateString("cs-CZ", {
    dateStyle: "long",
  });
  return (
    <div className="article-info">
      <Image
        src={author.profilePhotoUrl!}
        width={100}
        height={100}
        alt=""
        className="profile-picture"
      />
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

export async function generateStaticParams(): Promise<Params[]> {
  return (
    getFilesRecursively(articleRoot)
      // Get all article paths
      .filter((path) => path.endsWith(".md"))
      // Convert date and slug to path fragments such as ["2022", "10", "obrana-drahy.html"]
      .map(getUrlPathFragmentsForFileSystemPath)
      // Store path in the format expected by router
      .map((fragments) => ({
        path: fragments,
      }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const path = getFileSystemPathForUrlPathFragments(params.path) || notFound();
  const post = readArticle(path);
  return {
    title: post.title,
    openGraph: {
      title: post.title,
      description: post.perex,
      images: [
        {
          url: getSignedResizedImage(post.coverPhoto, 1200, IMAGE_SIGNING_KEY),
        },
      ],
    },
  };
}

export default Page;
