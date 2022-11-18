import Link from "next/link";
import { Metadata } from "src/article";
import { Route } from "src/routing";
import { getSignedResizedImage, IMAGE_SIGNING_KEY } from "src/utils";

export type ArticlePreviewProps = {
  article: Metadata;
  type?: string;
};

export const BigArticlePreview: React.FC<ArticlePreviewProps> = ({
  article,
}) => (
  <div className="article-preview article-preview-big">
    <div className="row">
      <Link href={Route.toArticle(article)}>
        <div className="col-sm-4">
          <div className="article-preview-text">
            <Title {...article} />
            <p className="article-perex hidden-md hidden-sm">{article.perex}</p>
          </div>
        </div>
        <div className="col-sm-8">
          {/* TBD: Replace optionality with a default value */}
          {article.coverPhoto && (
            <div
              className="force-feature-aspect"
              style={{
                backgroundImage: `url(${thumbnail(article.coverPhoto)})`,
              }}
            />
          )}
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
    <Link href={Route.toArticle(article)}>
      <div className="force-hd-aspect">
        {/* TBD: Replace optionality with a default value */}
        {article.coverPhoto && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={thumbnail(article.coverPhoto)}
            className="img-responsive"
            alt=""
          />
        )}
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
    <Link href={Route.toArticle(article)}>
      <Title {...article} />
    </Link>
  </div>
);

const Title = (article: Metadata) => (
  <>
    {article.category === "názory a komentáře" && (
      <h2>
        {article.title}
        <br />
        <span className="text-danger">{article.author}</span>
      </h2>
    )}
    {article.category !== "názory a komentáře" && <h2>{article.title}</h2>}
  </>
);

const thumbnail = (imageUrl: string) =>
  getSignedResizedImage(imageUrl, 640, IMAGE_SIGNING_KEY);
