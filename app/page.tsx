import { PreviewNest } from "components/PreviewNest";
import { getAllBanners } from "src/data/banners";
import { RouteTo } from "src/routing";
import { endlessGeneratorOf, shuffleInPlace, tilde } from "src/utils";
import { getTopArticles, plausibleEventClass } from "src/data/plausible";
import {
  getLatestTopicsSummary,
  getUserAvatar,
  LatestTopicsSummary,
} from "src/data/forum";
import { compareByDate, getAllArticles, Metadata } from "src/article";
import { BannerBox } from "components/BannerBox";
import { Banner } from "src/data/banners";
import { TopArticles } from "src/data/plausible";
import Link from "next/link";
import Image from "next/image";
import { getAllAuthors } from "src/data/content";

// Revalidate this page every 5 minutes
export const revalidate = 300;

/** Home page */
const Page = async () => {
  const banners = await getAllBanners().then(shuffleInPlace);
  const topArticles = await getTopArticles();
  const latestForumSummary = await getLatestTopicsSummary();
  const articles = getAllArticles("content/articles").sort(compareByDate);
  const authors = await getAllAuthors();
  const filterCategory = (category: Metadata["category"]) =>
    articles
      // Skip latest article, it will be displayed on the top of the page anyway
      .slice(1)
      // Filter for requested category
      .filter((a) => a.category === category)
      // Return first ten
      .slice(0, 10);
  const mostRecentArticles = articles.slice(0, 10);
  const archive = shuffleInPlace(articles.filter((a) => a.featured)).slice(
    0,
    10
  );
  const opinions = filterCategory("názory a komentáře");
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
        analyticsId="latest-articles-box"
        authors={authors}
      />

      <h2 className="section-divider">podpořte nás</h2>
      <FundraisingSecion />

      <h2 className="section-divider">názory &amp; komentáře</h2>
      <PreviewNest
        articles={opinions}
        getBanner={getNextBanner}
        analyticsId="opinion-box"
        authors={authors}
      />

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
      <PreviewNest
        articles={podcast}
        getBanner={getNextBanner}
        analyticsId="podcast-box"
        authors={authors}
      />

      <h2 className="section-divider">nejčtenější články</h2>
      <TopArticleBox topArticles={topArticles} banner={getNextBanner()} />

      <h2 className="section-divider">seriály</h2>
      <PreviewNest
        articles={serials}
        getBanner={getNextBanner}
        analyticsId="serial-box"
        authors={authors}
      />

      <h2 className="section-divider">
        vybíráme z <a href={RouteTo.archive}>archivu</a>
      </h2>
      <PreviewNest
        articles={archive}
        getBanner={getNextBanner}
        analyticsId="archive-box"
        authors={authors}
      />
    </div>
  );
};

//
// Fundraising Section
//

const FundraisingSecion = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
    <div className="lg:col-span-2">
      <Image
        className="lg:col-span-2"
        src="https://i.ohlasy.info/i/0ef79d75.jpg"
        sizes="(min-width: 640px) 50vw, 100vw"
        width={5842}
        height={3894}
        alt="Tým Ohlasů"
      />
    </div>
    <div>
      <iframe
        width="100%"
        height="408"
        src="https://www.darujme.cz/widget?token=yuz8kfm2xy7lb0rb"
        name="widget-yuz8kfm2xy7lb0rb"
        style={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
          border: "none",
          boxShadow: "none",
          height: "408px",
        }}
      />
    </div>
  </div>
);

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
      {topArticles
        .filter((e) => !!e.title)
        .slice(0, 10)
        .map((entry, index) => (
          <li
            key={entry.title}
            className={`flex gap-4 ${index >= 5 ? "max-md:hidden" : ""}`}
          >
            <span className="block text-2xl text-[#666] text-right w-[3ex] flex-none">
              {index + 1}
            </span>
            <Link
              className={plausibleEventClass({
                name: "Internal Link",
                type: "top-articles-box",
              })}
              href={entry.path}
            >
              {tilde(entry.title!)}
            </Link>
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
