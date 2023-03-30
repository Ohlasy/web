import { Metadata as Article } from "src/article";
import { Banner } from "src/data-source/banners";
import { BannerBox } from "./BannerBox";
import { tilde as t } from "src/utils";
import Image from "next/image";
import { RouteTo } from "src/routing";
import Balancer from "react-wrap-balancer";
import Link from "next/link";

export type PreviewNestProps = {
  getBanner: () => Banner;
  articles: Article[];
  aboveFold?: boolean;
};

export const PreviewNest = ({
  articles,
  getBanner,
  aboveFold = false,
}: PreviewNestProps) => (
  <div className="grid grid-cols-1 gap-7">
    <FeaturePreview article={articles[0]} aboveFold={aboveFold} />
    <div className="grid md:grid-cols-3 gap-7">
      <SecondaryPreview article={articles[1]} />
      <SecondaryPreview article={articles[2]} />
      <BannerBox banner={getBanner()} />
    </div>
  </div>
);

type ArticleProps = {
  article: Article;
  aboveFold?: boolean;
};

const FeaturePreview = ({ article, aboveFold = false }: ArticleProps) => (
  <Link
    className="grid lg:grid-cols-3 lg:gap-7 bg-lightGray text-offBlack"
    href={RouteTo.article(article)}
  >
    <div className="p-4 flex flex-col gap-y-2">
      {article.category === "názory a komentáře" && (
        <div>
          <OpinionMarker />
        </div>
      )}
      <h2 className="font-bold text-2xl">
        <Balancer>{t(article.title)}</Balancer>
      </h2>
      <p className="italic">{t(article.perex)}</p>
    </div>
    <div className="col-span-2 max-lg:order-first">
      <div className="relative w-full aspect-video lg:aspect-[3/2]">
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

const SecondaryPreview = ({ article }: ArticleProps) => (
  <Link className="bg-lightGray text-offBlack" href={RouteTo.article(article)}>
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
      {article.category === "názory a komentáře" && (
        <div>
          <OpinionMarker />
        </div>
      )}
    </div>
  </Link>
);

const OpinionMarker = () => (
  <div className="inline-block rounded border-[1px] border-brown text-brown text-sm py-[1px] px-2">
    názorový text
  </div>
);
