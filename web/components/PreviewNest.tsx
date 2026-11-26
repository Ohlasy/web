import Image from "next/image";
import Link from "next/link";
import { type Metadata as Article, getArticleNotices } from "@/src/article";
import type { Author } from "@/src/data/authors";
import type { Banner } from "@/src/data/banners";
import { RouteTo } from "@/src/routing";
import { tilde as t } from "@/src/utils";
import { BannerBox } from "./BannerBox";
import { SmallArticlePreview } from "./SmallArticlePreview";
import { TextPill } from "./TextPill";

export type PreviewNestProps = {
  getBanner: () => Banner;
  articles: Article[];
  aboveFold?: boolean;
  authors: Author[];
};

export const PreviewNest = ({
  articles,
  getBanner,
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
        author={getAuthor(articles[0])}
      />
      <div className="grid md:grid-cols-3 gap-7">
        <SmallArticlePreview article={articles[1]} />
        <SmallArticlePreview article={articles[2]} />
        <BannerBox banner={getBanner()} />
      </div>
    </div>
  );
};

type ArticleProps = {
  article: Article;
  aboveFold?: boolean;
  author: Author;
};

const FeaturePreview = ({
  article,
  author,
  aboveFold = false,
}: ArticleProps) => {
  const notices = getArticleNotices(article);
  return (
    <Link
      className="grid lg:grid-cols-3 lg:gap-7 bg-light-gray text-off-black"
      href={RouteTo.article(article)}
    >
      <div className="p-4 flex flex-col gap-y-2">
        {notices.length > 0 && (
          <div className="flex gap-2">
            {notices.map((m) => (
              <TextPill key={m} label={m} />
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
            fetchPriority="high"
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
