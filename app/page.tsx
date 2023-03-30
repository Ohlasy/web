import { PreviewNest } from "components/PreviewNest";
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
    <div>
      {/* Most recent */}
      <PreviewNest
        articles={mostRecentArticles}
        getBanner={getNextBanner}
        aboveFold={true}
      />

      <h2 className="section-divider">názory &amp; komentáře</h2>
      <PreviewNest articles={opinions} getBanner={getNextBanner} />

      <h2 className="section-divider">
        <a href={RouteTo.forum}>diskuzní fórum</a>
      </h2>
      <ForumOverviewBox
        latestForumSummary={latestForumSummary}
        banner={getNextBanner()}
      />

      <h2 className="section-divider">
        <a href={RouteTo.podcasts}>podcast</a>
      </h2>
      <PreviewNest articles={podcast} getBanner={getNextBanner} />

      <h2 className="section-divider">rozhovory</h2>
      <PreviewNest articles={interviews} getBanner={getNextBanner} />

      <h2 className="section-divider">nejčtenější články</h2>
      <TopArticleBox topArticles={topArticles} banner={getNextBanner()} />

      <h2 className="section-divider">seriály</h2>
      <PreviewNest articles={serials} getBanner={getNextBanner} />

      <h2 className="section-divider">
        vybíráme z <a href={RouteTo.archive}>archivu</a>
      </h2>
      <PreviewNest articles={archive} getBanner={getNextBanner} />
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
  <div className="grid lg:grid-cols-3 gap-7">
    <ol className="col-span-2 grid md:grid-cols-2 gap-7">
      {topArticles.slice(0, 10).map((entry, index) => (
        <li key={entry.title} className="flex gap-3">
          <span className="block text-2xl text-[#666] text-right w-[3ex] pr-2 border-r-[1px] border-silver flex-none">
            {index + 1}
          </span>
          <Link href={entry.path}>{entry.title}</Link>
        </li>
      ))}
    </ol>
    <div className="max-lg:hidden">
      <BannerBox banner={banner} />
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
      <div className="grid lg:grid-cols-3 gap-x-7">
        <div className="col-span-2">
          {topics.map((topic) => (
            <div
              className="grid md:grid-cols-3 border-b-[1px] border-dotted border-silver last:border-0 pb-2 mb-2 gap-x-7"
              key={topic.id}
            >
              <a href={RouteTo.forumTopic(topic)} className="col-span-2">
                {topic.title}
              </a>
              <div>
                {topic.posters.map(({ user_id }) => (
                  <Image
                    key={user_id}
                    src={getAvatarForUserId(user_id)}
                    className="inline-block rounded-full mr-1"
                    width={30}
                    height={30}
                    alt=""
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="max-lg:hidden">
          <BannerBox banner={banner} />
        </div>
      </div>
    </>
  );
};

export default Page;
