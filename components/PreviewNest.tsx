import { Metadata } from "src/article";
import { Banner } from "src/data-source/banners";
import { BannerBox } from "./BannerBox";
import {
  ArticlePreview,
  BigArticlePreview,
  SmallArticlePreview,
} from "./ArticlePreview";

export type PreviewNestProps = {
  getBanner: () => Banner;
  articles: Metadata[];
};

export const PreviewNest9: React.FC<PreviewNestProps> = ({
  articles,
  getBanner,
}) => (
  <div className="article-grid">
    <div className="row">
      <div className="col-sm-8 hidden-xs">
        <BigArticlePreview article={articles[0]} />
      </div>
      <div className="col-sm-8 visible-xs">
        <ArticlePreview article={articles[0]} type="fullheight" />
      </div>
      <div className="col-sm-4 hidden-xs">
        <div className="box">
          <BannerBox banner={getBanner()} />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-3 col-sm-4">
        <ArticlePreview article={articles[1]} type="fullheight" />
      </div>
      <div className="col-md-3 col-sm-4">
        <ArticlePreview article={articles[2]} type="fullheight" />
      </div>
      <div className="col-md-3 col-sm-4 hidden-xs">
        <SmallArticlePreview article={articles[3]} />
        <SmallArticlePreview article={articles[4]} />
        <SmallArticlePreview article={articles[5]} />
      </div>
      <div className="col-md-3 hidden-sm hidden-xs">
        <SmallArticlePreview article={articles[6]} />
        <SmallArticlePreview article={articles[7]} />
        <SmallArticlePreview article={articles[8]} />
      </div>
    </div>
  </div>
);

export const PreviewNest5: React.FC<PreviewNestProps> = ({
  articles,
  getBanner,
}) => (
  <div className="article-grid">
    <div className="row">
      <div className="col-sm-8 hidden-xs">
        <BigArticlePreview article={articles[0]} type="fullheight" />
      </div>
      <div className="col-sm-8 visible-xs">
        <ArticlePreview article={articles[0]} />
      </div>
      <div className="col-sm-4 hidden-xs">
        <div className="box">
          <BannerBox banner={getBanner()} />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-3 col-sm-4">
        <ArticlePreview article={articles[1]} type="fullheight" />
      </div>
      <div className="col-md-3 col-sm-4">
        <ArticlePreview article={articles[2]} type="fullheight" />
      </div>
      <div className="col-md-3 col-sm-4 hidden-xs">
        <ArticlePreview article={articles[3]} type="fullheight" />
      </div>
      <div className="col-md-3 hidden-sm hidden-xs">
        <ArticlePreview article={articles[4]} type="fullheight" />
      </div>
    </div>
  </div>
);
