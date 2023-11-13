import { Article, compareByDate, getAllArticles } from "src/article";
import { Metadata } from "next";
import { RouteTo } from "src/routing";
import Image from "next/image";
import { tilde } from "src/utils";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ohlasy Podcast",
  openGraph: {
    title: "Ohlasy Podcast",
    description: "Dění na Boskovicku, záznamy debat a rozhovorů",
  },
};

const PodcastPage = async () => {
  const articles = getAllArticles("content/articles")
    .filter((a) => a.category === "podcast")
    .sort(compareByDate);

  return (
    <div className="grid gap-7">
      <Intro />
      <EpisodeList articles={articles} />
    </div>
  );
};

const Intro = () => (
  <>
    <div className="grid lg:grid-cols-3 lg:gap-7 bg-lightGray">
      <div className="p-4">
        <h2 className="text-3xl font-bold mb-3">Podcast Ohlasy</h2>
        <p className="mb-3">
          Obšírnější článek o tom, co jsou podcasty, si můžete přečíst
          <a href="https://blog.audiolibrix.cz/tema/co-je-to-podcast/">
            {" "}
            například tady
          </a>
          . Stručně řečeno je to pohodlná forma poslechu audioseriálů na všechna
          možná témata. Poslouchat můžete kdekoliv, nejčastější je ale asi
          chytrý telefon, kde vám nové díly automaticky naskočí a můžete si je
          v klidu poslechnout třeba na procházce, v autě nebo při žehlení
          (doporučujeme!).
        </p>
        <div className="flex flex-col gap-2">
          <PlayerPill href={RouteTo.Spotify} title="Spotify" />
          <PlayerPill href={RouteTo.ApplePodcasts} title="Apple Podcasts" />
          <PlayerPill href={RouteTo.YouTubePodcast} title="YouTube" />
        </div>
      </div>

      <div className="max-lg:order-first lg:col-span-2">
        <Image
          src="https://i.ohlasy.info/i/b1981cd6.jpg"
          sizes="(min-width: 1024px) 750px, 100vw"
          width={4032}
          height={3024}
          priority
          alt=""
        />
      </div>
    </div>
  </>
);

const PlayerPill = ({ href, title }: { href: string; title: string }) => (
  <a
    href={href}
    className="rounded-full border-[1px] border-brown px-2 hover:bg-brown hover:text-white"
  >
    ▷ {title}
  </a>
);

const EpisodeList = ({ articles }: { articles: Article[] }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-7">
    {articles.map((article) => (
      <div className="bg-lightGray" key={article.title}>
        <Link
          className="bg-lightGray text-offBlack"
          href={RouteTo.article(article)}
        >
          <div className="relative w-full aspect-video">
            <Image
              src={article.coverPhoto}
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
              alt=""
              fill
            />
          </div>
          <div className="p-4 pb-6">
            <h2>{tilde(article.title)}</h2>
          </div>
        </Link>
      </div>
    ))}
  </div>
);

export default PodcastPage;
