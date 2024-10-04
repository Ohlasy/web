"use client";

import { Article } from "src/article";
import { FilterOptions, match } from "./filters";
import Link from "next/link";
import Image from "next/image";
import { RouteTo } from "src/routing";
import { tilde } from "src/utils";
import { useSearchParams } from "next/navigation";

type Props = {
  allArticles: ReadonlyArray<Article>;
  filterOptions: FilterOptions;
};

export const ArchiveView = ({ allArticles }: Props) => {
  // Read initial filter settings from URL search params
  const searchParams = useSearchParams() ?? [];
  const settings = Object.fromEntries(searchParams.entries());

  // Filter all articles according to settings
  const matchingArticles = allArticles
    .filter((a) => match(a, settings))
    .sort(compareByDate);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {matchingArticles.map((a) => (
        <ArticlePreview key={a.date + a.title} article={a} />
      ))}
    </div>
  );
};

const ArticlePreview = ({ article }: { article: Article }) => {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("cs-CZ", { dateStyle: "medium" });
  return (
    <Link
      className="flex flex-col gap-2 text-black"
      href={RouteTo.article(article)}
    >
      <div className="relative aspect-video">
        <Image
          src={article.coverPhoto}
          className="object-cover"
          sizes="(min-width: 768px) 30vw, 100vw"
          alt=""
          fill
        />
      </div>
      <h2 className="text-balance font-bold">{tilde(article.title)}</h2>
      <p className="text-sm uppercase text-offBlack">
        {article.author} {formatDate(article.date)}
      </p>
      <p className="line-clamp-6 text-sm text-balance">
        {tilde(article.perex)}
      </p>
    </Link>
  );
};

/** Compare articles by publish date, sorting last published first */
const compareByDate = <A extends Pick<Article, "date">>(a1: A, a2: A) =>
  Date.parse(a2.date) - Date.parse(a1.date);
