import Image from "next/image";
import { getAllArticles } from "src/article";
import { RouteTo } from "src/routing";
import {
  getAllAuthors,
  Author,
  getPodcastEpisodes,
} from "src/data-source/content";
import { ReactNode } from "react";

const Page = async () => {
  const episodes = await getPodcastEpisodes("content/podcast.yml");
  const articles = getAllArticles("content/articles");
  const authors = await getAllAuthors();
  const countArticles = (name: string) =>
    articles.filter((article) => article.author === name).length;
  const authorsByArticleCount = authors
    .map((author) => ({
      ...author,
      articleCount: countArticles(author.name),
    }))
    .sort((a, b) => b.articleCount - a.articleCount);
  return (
    <div className="flex flex-col gap-10">
      <section className="grid lg:grid-cols-3 gap-7 lg:mt-7">
        <Image
          className="lg:col-span-2 lg:order-2"
          src="https://i.ohlasy.info/i/9b34a8e0.jpg"
          sizes="(min-width: 1024px) 50vw, 100vw"
          width={3776}
          height={2517}
          alt="Tým Ohlasů"
        />
        <div className="max-w-prose flex flex-col gap-2">
          <p>
            Ohlasy jsou nezávislé regionální noviny pro Boskovice a okolí,
            založené v roce 2015. Chceme dělat kvalitní regionální novinařinu,
            která zlepšuje život ve městě i celém regionu.
          </p>
          <p>
            Noviny společně založili a vedou Tomáš Trumpeš (texty, koordinace
            autorů) a Tomáš Znamenáček (redakce a korektury, technika,
            fotografie, provoz).
          </p>
          <p>
            Společně s několika desítkami pravidelných autorů i občasných
            přispěvatelů jsme od založení vydali{" "}
            <a href={RouteTo.archive}>{articles.length} článků</a>,{" "}
            <a href={RouteTo.podcasts}>{episodes.length} dílů podcastu</a> a 
            <a href={RouteTo.YouTube}>desítky videí</a>.
          </p>
        </div>
      </section>
      <section className="mb-20">
        <SectionHeader>Autoři & Autorky</SectionHeader>
        <AuthorList authors={authorsByArticleCount} />
      </section>
    </div>
  );
};

const AuthorList = ({ authors }: { authors: Author[] }) => {
  const archiveUrl = (name: string) =>
    `https://archiv.ohlasy.info/?autor=${name.replaceAll(" ", "+")}`;
  return (
    <div className="flex flex-row flex-wrap gap-7 justify-center">
      {authors.map((a) => (
        <a
          key={a.name}
          className="text-center max-w-[150px]"
          href={archiveUrl(a.name)}
        >
          <Image
            key={a.name}
            src={a.profilePhotoUrl!}
            width={150}
            height={150}
            className="rounded-full mb-2 m-auto border-4 border-white hover:border-brown"
            alt=""
          />
          <h3 className="text-offBlack">{a.name}</h3>
        </a>
      ))}
    </div>
  );
};

const SectionHeader = ({ children }: { children: ReactNode }) => (
  <h2 className="font-bold text-2xl text-center mb-7 border-b-[1px] pb-2 border-gray">
    {children}
  </h2>
);

export default Page;
