import Image from "next/image";
import Link from "next/link";
import { type Metadata as Article, getArticleNotices } from "@/src/article";
import { RouteTo } from "@/src/routing";
import { tilde } from "@/src/utils";
import { TextPill } from "./TextPill";

export type Props = {
  article: Article;
};

export const SmallArticlePreview = ({ article }: Props) => {
  const notices = getArticleNotices(article);
  return (
    <Link
      className="bg-light-gray text-off-black"
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
        <h2>{tilde(article.title)}</h2>
        {notices.length > 0 && (
          <div className="flex gap-2">
            {notices.map((m) => (
              <TextPill key={m} label={m} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};
