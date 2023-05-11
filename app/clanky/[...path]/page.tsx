import { ArticleContent } from "app/clanky/[...path]/ArticleContent";
import { BannerBox } from "app/(shared)/BannerBox";
import { PreviewNest } from "app/(shared)/PreviewNest";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import Balancer from "react-wrap-balancer";
import { Article, compareByDate, readArticle } from "src/article";
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
    notFound();
  }

  const article = readArticle(articlePath);
  const { banners, articles, authors } = await getCachedData();

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
      <main>
        <div className="grid md:grid-cols-3 gap-7">
          <article className="md:col-span-2">
            <Title article={article} />
            <ArticleContent src={article.body} />
            <InfoBox article={article} author={author} />
          </article>
          <aside className="flex flex-col gap-7">
            <BannerBox banner={getNextBanner()} />
            <div className="max-md:hidden">
              <BannerBox banner={getNextBanner()} />
            </div>
          </aside>
        </div>
      </main>
      {relatedArticles.length >= 9 && (
        <div className="">
          <h2 className="section-divider">další {article.category}</h2>
          <PreviewNest
            articles={relatedArticles}
            getBanner={getNextBanner}
            analyticsId="related-articles-box"
          />
        </div>
      )}
    </>
  );
};

const Title = ({ article }: { article: Article }) => {
  const title =
    article.category === "názory a komentáře"
      ? `${article.author}: ${tilde(article.title)}`
      : tilde(article.title);
  return (
    <h2 className="text-4xl leading-tight font-bold mb-3">
      <Balancer>{title}</Balancer>
    </h2>
  );
};

type InfoBoxProps = {
  author: Author;
  article: Article;
};

const InfoBox = ({ author, article }: InfoBoxProps) => {
  const date = new Date(article.date).toLocaleDateString("cs-CZ", {
    dateStyle: "long",
  });
  return (
    <div className="mt-10 bg-lightGray p-7 pt-5 border-t-[1px] border-silver flex gap-7 flex-wrap content-center">
      <Image
        src={author.profilePhotoUrl!}
        width={100}
        height={100}
        alt=""
        className="rounded-full"
      />
      <ul>
        <li>{article.author}</li>
        {author.mail && (
          <li>
            <a href={`mailto:${author.mail}`}>{author.mail}</a>
          </li>
        )}
        {author.bio && <li>{author.bio}</li>}
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
    description: post.perex,
    openGraph: {
      title: post.title,
      description: post.perex,
      images: getSignedResizedImage(post.coverPhoto, 1200, IMAGE_SIGNING_KEY),
    },
  };
}

export default Page;
