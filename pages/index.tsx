import { Layout } from "components/Layout";
import { PreviewNest5, PreviewNest9 } from "components/PreviewNest";
import { GetStaticProps, NextPage } from "next";
import { filterUndefines, shuffleInPlace } from "src/utils";
import { Article, compareByDate, getAllArticles, Metadata } from "src/article";

export type PageProps = {
  mostRecentArticles: Metadata[];
  opinions: Metadata[];
  interviews: Metadata[];
  podcast: Metadata[];
  serials: Metadata[];
  archive: Metadata[];
};

const Page: NextPage<PageProps> = (props) => {
  const {
    mostRecentArticles,
    opinions,
    interviews,
    podcast,
    serials,
    archive,
  } = props;
  return (
    <Layout title="Ohlasy dění na Boskovicku">
      <div className="container">
        <PreviewNest9 articles={mostRecentArticles} />
        <h2 className="section-divider">názory &amp; komentáře</h2>
        <PreviewNest9 articles={opinions} />
        <h2 className="section-divider">rozhovory</h2>
        <PreviewNest5 articles={interviews} />
        <h2 className="section-divider">
          <a href="/podcast/">podcast</a>
        </h2>
        <PreviewNest5 articles={podcast} />
        <h2 className="section-divider">seriály</h2>
        <PreviewNest9 articles={serials} />
        <h2 className="section-divider">
          vybíráme z <a href="https://archiv.ohlasy.info">archivu</a>
        </h2>
        <PreviewNest5 articles={archive} />
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
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
