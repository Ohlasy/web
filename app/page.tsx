import { PreviewNest5, PreviewNest9 } from "components/PreviewNest";
import { getAllBanners } from "src/data-source/banners";
import { RouteTo } from "src/routing";
import { endlessGeneratorOf, shuffleInPlace } from "src/utils";
import { ForumOverviewBox } from "components/ForumBox";
import { getTopArticles } from "src/data-source/plausible";
import { TopArticleBox } from "components/TopArticles";
import { getLatestTopicsSummary } from "src/data-source/forum";
import { Metadata as NextMetadata } from "next";
import { compareByDate, getAllArticles, Metadata } from "src/article";

export const metadata: NextMetadata = {
  title: "Ohlasy dění na Boskovicku",
  openGraph: {
    title: "Ohlasy dění na Boskovicku",
    description: "Internetové noviny pro Boskovice a okolí",
    locale: "cs-CZ",
    type: "website",
    images: [
      {
        url: "https://i.ohlasy.info/i/a5c62deb.jpg",
      },
    ],
  },
};

// TODO: ISR
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

export default Page;
