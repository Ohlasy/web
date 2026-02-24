import Image from "next/image";
import Link from "next/link";
import { type Metadata as Article, getArticleNotices } from "src/article";
import type { Banner } from "src/data/banners";
import type { Author } from "src/data/content";
import { plausibleEventClass } from "src/data/plausible";
import { RouteTo } from "src/routing";
import { tilde as t } from "src/utils";
import { BannerBox } from "./BannerBox";

export type PreviewNestProps = {
  getBanner: () => Banner;
  articles: Article[];
  aboveFold?: boolean;
  analyticsId?: string;
  authors: Author[];
};

export const PreviewNest = ({
  articles,
  getBanner,
  analyticsId,
  authors,
  aboveFold = false,
}: PreviewNestProps) => {
  const getAuthor = (article: Article) =>
    authors.find((a) => a.name === article.author)!;
  return (
    <div className="grid grid-cols-1 gap-7">
      <FeaturePreview
        article={articles[0]}
        aboveFold={aboveFold}
        analyticsId={analyticsId}
        author={getAuthor(articles[0])}
      />
      <div className="grid md:grid-cols-3 gap-7">
        <SecondaryPreview
          article={articles[1]}
          analyticsId={analyticsId}
          author={getAuthor(articles[1])}
        />
        <SecondaryPreview
          article={articles[2]}
          analyticsId={analyticsId}
          author={getAuthor(articles[2])}
        />
        <BannerBox banner={getBanner()} />
      </div>
    </div>
  );
};

type ArticleProps = {
  article: Article;
  aboveFold?: boolean;
  analyticsId?: string;
  author: Author;
};

const FeaturePreview = ({
  article,
  analyticsId,
  author,
  aboveFold = false,
}: ArticleProps) => {
  const notices = getArticleNotices(article);
  return (
    <Link
      className={mergeClasses(
        "grid lg:grid-cols-3 lg:gap-7 bg-lightGray text-offBlack",
        analyticsId,
      )}
      href={RouteTo.article(article)}
    >
      <div className="p-4 flex flex-col gap-y-2">
        {notices.length > 0 && (
          <div className="flex gap-2">
            {notices.map((m) => (
              <NoticeBubble key={m} label={m} />
            ))}
          </div>
        )}
        <h2 className="font-bold text-2xl text-balance">{t(article.title)}</h2>
        <p className="text-sm uppercase flex flex-row gap-2 items-center">
          <Image
            src={author.profilePhotoUrl!}
            className="rounded-full inline-block border border-gray"
            alt=""
            width={25}
            height={25}
          />
          <span>{author.name}</span>
        </p>
        <p className="italic line-clamp-9">{t(article.perex)}</p>
      </div>
      <div className="col-span-2 max-lg:order-first">
        <div className="relative w-full aspect-video lg:aspect-3/2">
          <Image
            src={article.coverPhoto}
            sizes="(min-width: 1024px) 800px, 100vw"
            className="object-cover"
            priority={aboveFold}
            alt=""
            fill
          />
        </div>
      </div>
    </Link>
  );
};

const SecondaryPreview = ({ article, analyticsId }: ArticleProps) => {
  const notices = getArticleNotices(article);
  return (
    <Link
      className={mergeClasses("bg-lightGray text-offBlack", analyticsId)}
      href={RouteTo.article(article)}
    >
      <div className="relative w-full aspect-video">
        <Image
          src={article.coverPhoto}
          sizes="(min-width: 1024px) 350px, (min-width: 768px) 33vw, 100vw"
          className="object-cover"
          alt=""
          fill
        />
      </div>
      <div className="p-4 pb-6 flex flex-col gap-y-2">
        <h2>{t(article.title)}</h2>
        {notices.length > 0 && (
          <div className="flex gap-2">
            {notices.map((m) => (
              <NoticeBubble key={m} label={m} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

const NoticeBubble = ({ label }: { label: string }) => (
  <div className="inline-block rounded-sm border border-brown text-brown text-sm py-px px-2">
    {label}
  </div>
);

const mergeClasses = (baseClasses: string, analyticsId: string | undefined) => {
  if (analyticsId) {
    const plausibleClasses = plausibleEventClass({
      name: "Internal Link",
      type: analyticsId,
    });
    return [baseClasses, plausibleClasses].join(" ");
  } else {
    return baseClasses;
  }
};
