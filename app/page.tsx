import { PreviewNest5, PreviewNest9 } from "components/PreviewNest";
import { getAllBanners } from "src/data-source/banners";
import { RouteTo } from "src/routing";
import { endlessGeneratorOf, shuffleInPlace } from "src/utils";
import { getTopArticles } from "src/data-source/plausible";
import {
  getLatestTopicsSummary,
  getUserAvatar,
  LatestTopicsSummary,
} from "src/data-source/forum";
import { compareByDate, getAllArticles, Metadata } from "src/article";
import { BannerBox } from "components/BannerBox";
import { Banner } from "src/data-source/banners";
import { TopArticles } from "src/data-source/plausible";
import Link from "next/link";
import Image from "next/image";

// Revalidate this page every 5 minutes
export const revalidate = 300;

/** Home page */
const Page = async () => {
  const banners = await getAllBanners();
  const topArticles = await getTopArticles();
  const latestForumSummary = await getLatestTopicsSummary();
  const articles = getAllArticles("content/articles").sort(compareByDate);
  const filterCategory = (category: Metadata["category"]) =>
    articles.filter((a) => a.category === category).slice(0, 10);
  const mostRecentArticles = articles.slice(0, 10);
  const archive = shuffleInPlace(articles.filter((a) => a.featured)).slice(
    0,
    10
  );
  const opinions = filterCategory("názory a komentáře");
  const interviews = filterCategory("rozhovory");
  const podcast = filterCategory("podcast");
  const serials = filterCategory("seriály");
  const bannerGenerator = endlessGeneratorOf(banners);
  const getNextBanner = () => bannerGenerator.next().value;

  return (
    <div className="container">
      {/* Most recent */}
      <PreviewNest9 articles={mostRecentArticles} getBanner={getNextBanner} />

      <h2 className="section-divider">názory &amp; komentáře</h2>
      <PreviewNest9 articles={opinions} getBanner={getNextBanner} />

      <h2 className="section-divider">
        <a href={RouteTo.forum}>diskuzní fórum</a>
      </h2>
      <ForumOverviewBox
        latestForumSummary={latestForumSummary}
        banner={getNextBanner()}
      />

      <h2 className="section-divider">rozhovory</h2>
      <PreviewNest5 articles={interviews} getBanner={getNextBanner} />

      <h2 className="section-divider">
        <a href={RouteTo.podcasts}>podcast</a>
      </h2>
      <PreviewNest5 articles={podcast} getBanner={getNextBanner} />

      <h2 className="section-divider">nejčtenější články</h2>
      <TopArticleBox topArticles={topArticles} banner={getNextBanner()} />

      <h2 className="section-divider">seriály</h2>
      <PreviewNest9 articles={serials} getBanner={getNextBanner} />

      <h2 className="section-divider">
        vybíráme z <a href={RouteTo.archive}>archivu</a>
      </h2>
      <PreviewNest5 articles={archive} getBanner={getNextBanner} />
    </div>
  );
};

//
// Top Articles
//

export type TopArticleBoxProps = {
  topArticles: TopArticles;
  banner: Banner;
};

const TopArticleBox = ({ topArticles, banner }: TopArticleBoxProps) => (
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

//
// Discussion Forum Box
//

type Props = {
  latestForumSummary: LatestTopicsSummary;
  banner: Banner;
};

const ForumOverviewBox = ({ latestForumSummary, banner }: Props) => {
  const { topic_list, users } = latestForumSummary;

  const topics = topic_list.topics
    // Topic #8 is an old welcome post, not sure why it’s always there
    .filter((topic) => topic.id !== 8)
    .slice(0, 10);

  const getAvatarForUserId = (id: number) => {
    const user = users.find((u) => u.id === id)!;
    return getUserAvatar(user, 200);
  };

  return (
    <>
      <div className="row">
        <div className="col-lg-8 forum-topic-list">
          {topics.map((topic) => (
            <div key={topic.id} className="row">
              <div className="col-sm-8">
                <a href={RouteTo.forumTopic(topic)}>{topic.title}</a>
              </div>
              <div className="col-sm-4">
                {topic.posters.map(({ user_id }) => (
                  <Image
                    key={user_id}
                    src={getAvatarForUserId(user_id)}
                    style={{ borderRadius: "50%", marginRight: "5px" }}
                    width={30}
                    height={30}
                    alt=""
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="col-lg-4 hidden-md hidden-sm hidden-xs">
          <div className="box">
            <BannerBox banner={banner} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
