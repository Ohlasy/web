import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAllArticles } from "src/article";
import {
  type Author,
  getAllAuthors,
  getPodcastEpisodes,
} from "src/data/content";
import { RouteTo } from "src/routing";

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
      <section className="grid lg:grid-cols-3 gap-7 lg:mt-7 bg-light-gray">
        <Image
          className="lg:col-span-2 lg:order-2"
          src="https://i.ohlasy.info/i/0ef79d75.jpg"
          sizes="(min-width: 1024px) 50vw, 100vw"
          width={5842}
          height={3894}
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
            <a href={RouteTo.companyInfo} className="typo-link">
              spolek Ohlasy
            </a>
            .
          </p>
          <p>
            Společně s několika desítkami pravidelných autorů i občasných
            přispěvatelů jsme od založení vydali{" "}
            <Link href={RouteTo.archive} className="typo-link">
              {articles.length} článků
            </Link>
            ,{" "}
            <Link href={RouteTo.podcasts} className="typo-link">
              {episodes.length} dílů podcastu
            </Link>
            ,{" "}
            <Link href={RouteTo.store} className="typo-link">
              pět knih
            </Link>{" "}
            a 
            <a href={RouteTo.YouTube} className="typo-link">
              desítky videí
            </a>
            .
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
            name="Kristina Studená"
            photoUrl={profilePhotoUrlFor("Kristina Studená")}
            mail="kristina.studena@gmail.com"
            info="texty"
          />
          <PersonCard
            name="Magda Znamenáčková"
            photoUrl={profilePhotoUrlFor("Magda Znamenáčková")}
            info="vydávání knih, moderování"
            mail="magda@ohlasy.info"
          />
          <PersonCard
            name="Marek Osouch"
            photoUrl={profilePhotoUrlFor("Marek Osouch")}
            mail="marek@ohlasy.info"
            info="zpravodajství"
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

const AuthorList = ({ authors }: { authors: Author[] }) => (
  <div className="flex flex-row flex-wrap gap-7 justify-center">
    {authors.map((a) => (
      <a
        key={a.name}
        className="text-center max-w-[150px]"
        href={RouteTo.articlesByAuthor(a.name)}
      >
        <Image
          key={a.name}
          src={a.profilePhotoUrl!}
          width={150}
          height={150}
          className="rounded-full mb-2 m-auto border-4 border-white hover:border-brown"
          alt=""
        />
        <h3 className="text-off-black">{a.name}</h3>
      </a>
    ))}
  </div>
);

const SectionHeader = ({ children }: { children: ReactNode }) => (
  <h2 className="font-bold text-2xl text-center mb-7 border-b pb-2 border-gray">
    {children}
  </h2>
);

export default Page;
