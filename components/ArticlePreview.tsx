import Image from "next/image";
import Link from "next/link";
import { Metadata } from "src/article";
import { RouteTo } from "src/routing";
import { tilde } from "src/utils";

export type ArticlePreviewProps = {
  article: Metadata;
  type?: string;
};

export const BigArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
}) => (
  <div className="article-preview article-preview-big">
    <div className="row">
      <Link href={RouteTo.article(article)}>
        <div className="col-sm-4">
          <div className="article-preview-text">
            <Title {...article} />
            <p className="article-perex hidden-md hidden-sm">
              {tilde(article.perex)}
            </p>
          </div>
        </div>
        <div className="col-sm-8">
          <div className="force-feature-aspect">
            <Image
              src={article.coverPhoto}
              style={{ objectFit: "cover" }}
              sizes="(min-width: 900px) 490px, 100vw"
              alt=""
              fill
            />
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export const ArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
  type = "",
}) => (
  <div className={`article-preview article-preview-middle ${type}`}>
    <Link href={RouteTo.article(article)}>
      <div
        style={{
          aspectRatio: 16 / 9,
          position: "relative",
          overflow: "hidden",
          marginBottom: "20px",
        }}
      >
        <Image
          src={article.coverPhoto}
          style={{ objectFit: "cover" }}
          sizes="(min-width: 900px) 260px, 100vw"
          alt=""
          fill
        />
      </div>
      <Title {...article} />
    </Link>
  </div>
);

export const SmallArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
  type = "",
}) => (
  <div className={`article-preview article-preview-small ${type}`}>
    <Link href={RouteTo.article(article)}>
      <Title {...article} />
    </Link>
  </div>
);

const Title = (article: Metadata) => (
  <>
    {article.category === "názory a komentáře" && (
      <h2>
        {tilde(article.title)}
        <br />
        <span className="text-danger">{article.author}</span>
      </h2>
    )}
    {article.category !== "názory a komentáře" && (
      <h2>{tilde(article.title)}</h2>
    )}
  </>
);
