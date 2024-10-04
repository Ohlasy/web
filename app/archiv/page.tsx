import Image from "next/image";
import Link from "next/link";
import { Article, compareByDate, getAllArticles } from "src/article";
import { RouteTo } from "src/routing";
import { tilde } from "src/utils";

async function Page() {
  const articles = getAllArticles("content/articles");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {articles.sort(compareByDate).map((a) => (
        <ArticlePreview key={a.date} article={a} />
      ))}
    </div>
  );
}

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
      <p className="text-sm uppercase">
        {article.author} {formatDate(article.date)}
      </p>
      <p className="line-clamp-6 text-sm text-balance">
        {tilde(article.perex)}
      </p>
    </Link>
  );
};

export default Page;
