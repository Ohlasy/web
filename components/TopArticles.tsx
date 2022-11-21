import Link from "next/link";
import { Banner } from "src/data-source/banners";
import { TopArticles } from "src/data-source/plausible";
import { BannerBox } from "./BannerBox";

export type Props = {
  topArticles: TopArticles;
  banner: Banner;
};

export const TopArticleBox = ({ topArticles, banner }: Props) => (
  <div className="row">
    <div className="col-md-4 col-sm-6">
      <ol className="article-list">
        {topArticles.slice(0, 5).map((entry) => (
          <li key={entry.title}>
            <Link href={entry.path}>{entry.title}</Link>
          </li>
        ))}
      </ol>
    </div>
    <div className="col-md-4 col-sm-6">
      <ol className="article-list" start={5}>
        {topArticles.slice(5, 10).map((entry) => (
          <li key={entry.title}>
            <Link href={entry.path}>{entry.title}</Link>
          </li>
        ))}
      </ol>
    </div>
    <div className="col-md-4 hidden-sm hidden-xs">
      <div className="box">
        <BannerBox banner={banner} />
      </div>
    </div>
  </div>
);
