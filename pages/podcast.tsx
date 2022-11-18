import { ArticlePreview } from "components/ArticlePreview";
import { Layout } from "components/Layout";
import { GetStaticProps } from "next";
import { filterUndefines } from "src/utils";
import {
  compareByDate,
  getAllArticles,
  Metadata,
  stripBody,
} from "src/article";

type PageProps = {
  articles: Metadata[];
};

const PodcastPage = ({ articles }: PageProps) => {
  return (
    <Layout title="Ohlasy Podcast">
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <h2>Pod–co?</h2>
            <p>
              Obšírnější článek o tom, co jsou podcasty, si můžete přečíst
              <a href="https://blog.audiolibrix.cz/tema/co-je-to-podcast/">
                {" "}
                například tady
              </a>
              . Stručně řečeno je to pohodlná forma poslechu audioseriálů na
              všechna možná témata. Poslouchat můžete kdekoliv, nejčastější je
              ale asi chytrý telefon, kde vám nové díly automaticky naskočí a
              můžete si je v klidu poslechnout třeba na procházce, v autě nebo
              při žehlení (doporučujeme!).
            </p>
            <p>
              U nás zatím ve formě podcastu vychází záznamy z pořadu Ohlasy
              naživo. Pokud byste měli tip na další pořady, které byste si v
              podcastu rádi poslechli, napište nám!
            </p>
          </div>
          <div className="col-md-4">
            <h2>Rychlý poslech</h2>
            <ul className="list-unstyled">
              <li>
                <a href="https://podcasts.apple.com/cz/podcast/ohlasy/id1480020344">
                  Apple Podcasts
                </a>
              </li>
              <li>
                <a href="https://www.google.com/podcasts?feed=aHR0cHM6Ly9vaGxhc3kuaW5mby9wb2RjYXN0LnhtbA%3D%3D">
                  Google Podcasts
                </a>
              </li>
              <li>
                <a href="/podcast.xml">RSS</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container">
        <h2>Epizody</h2>
        <div className="row">
          {articles.map((article) => (
            <div className="col-md-3 col-sm-4" key={article.title}>
              <ArticlePreview article={article} />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const articles = getAllArticles("content/articles")
    .filter((a) => a.category === "podcast")
    .sort(compareByDate)
    .map(stripBody);
  return {
    props: filterUndefines({ articles }),
    revalidate: 300, // update every 5 minutes
  };
};

export default PodcastPage;
