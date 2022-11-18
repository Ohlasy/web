import { Layout } from "components/Layout";
import { PreviewNest5, PreviewNest9 } from "components/PreviewNest";
import { GetStaticProps, NextPage } from "next";
import { Article, compareByDate, getAllArticles, Metadata } from "src/article";
import { Banner, getAllBanners } from "src/banners";
import { Route } from "src/routing";
import { filterUndefines, shuffleInPlace } from "src/utils";

export type PageProps = {
  banners: Banner[];
  mostRecentArticles: Metadata[];
  opinions: Metadata[];
  interviews: Metadata[];
  podcast: Metadata[];
  serials: Metadata[];
  archive: Metadata[];
};

const Page: NextPage<PageProps> = (props) => {
  const {
    banners,
    mostRecentArticles,
    opinions,
    interviews,
    podcast,
    serials,
    archive,
  } = props;
  const bannerGenerator = endlessGeneratorOf(banners);
  const getNextBanner = () => bannerGenerator.next().value;
  return (
    <Layout title="Ohlasy dění na Boskovicku">
      <div className="container">
        <PreviewNest9 articles={mostRecentArticles} getBanner={getNextBanner} />
        <h2 className="section-divider">názory &amp; komentáře</h2>
        <PreviewNest9 articles={opinions} getBanner={getNextBanner} />
        <h2 className="section-divider">rozhovory</h2>
        <PreviewNest5 articles={interviews} getBanner={getNextBanner} />
        <h2 className="section-divider">
          <a href={Route.toPodcast}>podcast</a>
        </h2>
        <PreviewNest5 articles={podcast} getBanner={getNextBanner} />
        <h2 className="section-divider">seriály</h2>
        <PreviewNest9 articles={serials} getBanner={getNextBanner} />
        <h2 className="section-divider">
          vybíráme z <a href={Route.toArchive}>archivu</a>
        </h2>
        <PreviewNest5 articles={archive} getBanner={getNextBanner} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const banners = await getAllBanners();
  const stripBody = (article: Article): Metadata => {
    const { body, ...metadata } = article;
    return metadata;
  };
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

//
// Helpers
//

function* endlessGeneratorOf<T>(items: T[]): Generator<T, T, unknown> {
  let index = 0;
  while (true) {
    yield items[index];
    index = (index + 1) % items.length;
  }
}

export default Page;
