import { Layout } from "components/Layout";
import { PreviewNest5, PreviewNest9 } from "components/PreviewNest";
import { GetStaticProps, NextPage } from "next";
import { Banner, getAllBanners } from "src/data-source/banners";
import { Route } from "src/routing";
import { endlessGeneratorOf, filterUndefines, shuffleInPlace } from "src/utils";
import { ForumOverviewBox } from "components/ForumBox";
import { getTopArticles, TopArticles } from "src/data-source/plausible";
import { TopArticleBox } from "components/TopArticles";
import {
  getLatestTopicsSummary,
  LatestTopicsSummary,
} from "src/data-source/forum";
import {
  compareByDate,
  getAllArticles,
  Metadata,
  stripBody,
} from "src/article";

export type PageProps = {
  banners: Banner[];
  latestForumSummary: LatestTopicsSummary;
  topArticles: TopArticles;
  mostRecentArticles: Metadata[];
  opinions: Metadata[];
  interviews: Metadata[];
  podcast: Metadata[];
  serials: Metadata[];
  archive: Metadata[];
};

const Page: NextPage<PageProps> = (props) => {
  const bannerGenerator = endlessGeneratorOf(props.banners);
  const getNextBanner = () => bannerGenerator.next().value;
  return (
    <Layout title="Ohlasy dění na Boskovicku">
      <div className="container">
        {/* Most recent */}
        <PreviewNest9
          articles={props.mostRecentArticles}
          getBanner={getNextBanner}
        />

        <h2 className="section-divider">názory &amp; komentáře</h2>
        <PreviewNest9 articles={props.opinions} getBanner={getNextBanner} />

        <h2 className="section-divider">
          <a href={Route.toForum}>diskuzní fórum</a>
        </h2>
        <ForumOverviewBox
          latestForumSummary={props.latestForumSummary}
          banner={getNextBanner()}
        />

        <h2 className="section-divider">rozhovory</h2>
        <PreviewNest5 articles={props.interviews} getBanner={getNextBanner} />

        <h2 className="section-divider">
          <a href={Route.toPodcast}>podcast</a>
        </h2>
        <PreviewNest5 articles={props.podcast} getBanner={getNextBanner} />

        <h2 className="section-divider">nejčtenější články</h2>
        <TopArticleBox
          topArticles={props.topArticles}
          banner={getNextBanner()}
        />

        <h2 className="section-divider">seriály</h2>
        <PreviewNest9 articles={props.serials} getBanner={getNextBanner} />

        <h2 className="section-divider">
          vybíráme z <a href={Route.toArchive}>archivu</a>
        </h2>
        <PreviewNest5 articles={props.archive} getBanner={getNextBanner} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const banners = await getAllBanners();
  const topArticles = await getTopArticles();
  const latestForumSummary = await getLatestTopicsSummary();
  const articles = getAllArticles("content/articles")
    .sort(compareByDate)
    .map(stripBody);
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
  return {
    props: filterUndefines({
      banners,
      topArticles,
      latestForumSummary,
      mostRecentArticles,
      opinions,
      interviews,
      podcast,
      serials,
      archive,
    }),
    revalidate: 300, // update every 5 minutes
  };
};

export default Page;
