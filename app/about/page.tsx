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

  const profilePhotoUrlFor = (name: string) =>
    authors.find((candidate) => candidate.name === name)!.profilePhotoUrl!;

  return (
    <div className="flex flex-col gap-10">
      <section className="grid lg:grid-cols-3 gap-7 lg:mt-7 bg-lightGray">
        <Image
          className="lg:col-span-2 lg:order-2"
          src="https://i.ohlasy.info/i/9b34a8e0.jpg"
          sizes="(min-width: 1024px) 50vw, 100vw"
          width={3776}
          height={2517}
          alt="Tým Ohlasů"
        />
        <div className="max-w-prose flex flex-col gap-2 p-5">
          <p>
            Ohlasy jsou nezávislé regionální noviny pro Boskovice a okolí.
            Chceme dělat kvalitní regionální novinařinu, která zlepšuje život ve
            městě i celém regionu.
          </p>
          <p>
            Noviny v roce 2015 společně založili a vedou Tomáš Trumpeš a Tomáš
            Znamenáček, od roku 2019 jako{" "}
            <a href={RouteTo.companyInfo}>spolek Ohlasy</a>.
          </p>
          <p>
            Společně s několika desítkami pravidelných autorů i občasných
            přispěvatelů jsme od založení vydali{" "}
            <a href={RouteTo.archive}>{articles.length} článků</a>,{" "}
            <a href={RouteTo.podcasts}>{episodes.length} dílů podcastu</a>, tři
            knihy a 
            <a href={RouteTo.YouTube}>desítky videí</a>.
          </p>
        </div>
      </section>
      <section>
        <SectionHeader>Redakce</SectionHeader>
        <div className="flex flex-row flex-wrap justify-evenly gap-7">
          <PersonCard
            name="Tomáš Trumpeš"
            photoUrl={profilePhotoUrlFor("Tomáš Trumpeš")}
            info="texty, koordinace autorů, moderování"
            mail="tomas.trumpes@ohlasy.info"
          />
          <PersonCard
            name="Tomáš Znamenáček"
            photoUrl={profilePhotoUrlFor("Tomáš Znamenáček")}
            info="redakce a korektury, technika, fotografie, provoz"
            mail="tomas.znamenacek@ohlasy.info"
          />
          <PersonCard
            name="Marek Osouch"
            photoUrl={profilePhotoUrlFor("Marek Osouch")}
            mail="osouch.marek@gmail.com"
            info="zpravodajství"
          />
          <PersonCard
            name="Magda Znamenáčková"
            photoUrl={profilePhotoUrlFor("Magda Znamenáčková")}
            info="vydávání knih, moderování"
            mail="magda@ohlasy.info"
          />
          <PersonCard
            name="Nikol Halamásková"
            photoUrl={profilePhotoUrlFor("Nikol Halamásková")}
            mail="nikihalami@email.cz"
            info="sociální sítě"
          />
        </div>
      </section>
      <section className="mb-20">
        <SectionHeader>Autoři & Autorky</SectionHeader>
        <AuthorList authors={authorsByArticleCount} />
      </section>
    </div>
  );
};

const PersonCard = ({
  name,
  info,
  photoUrl,
  mail,
}: {
  name: string;
  info: string;
  photoUrl: string;
  mail: string;
}) => (
  <div className="w-[180px] text-center">
    <Image
      src={photoUrl}
      className="rounded-full mb-3 m-auto"
      width={150}
      height={150}
      alt=""
    />
    <h3>{name}</h3>
    <p className="text-sm mb-1">
      <a href={`mailto:${mail}`}>{mail}</a>
    </p>
    <p className="text-sm">{info}</p>
  </div>
);

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
