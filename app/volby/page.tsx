import type { Metadata } from "next";
import Image from "next/image";
import { FundraisingBox } from "@/components/FundraisingBox";
import { SectionDivider } from "@/components/SectionDivider";
import { SmallArticlePreview } from "@/components/SmallArticlePreview";
import {
  type Metadata as ArticleMetadata,
  getAllArticles,
  stripBody,
} from "@/src/article";
import { getResizedImageUrl } from "@/src/utils";

export const metadata: Metadata = {
  title: "Komunální volby 2026",
  description:
    "Všechny důležité informace na jednom místě: rozhovory s lídry*němi kandidátek, programová anketa, podcasty a další",
  openGraph: {
    images: getResizedImageUrl("https://i.ohlasy.info/i/369e00cb.jpeg", 1920),
  },
};

type Interview = {
  videoId: string;
  title: string;
};

const interviewIds: Interview[] = [
  { videoId: "sBOe7mc_V6s", title: "Lukáš Holík, ANO Naše Boskovice" },
  { videoId: "pz6bczpIcDA", title: "Jana Syrovátková, Změna22" },
  { videoId: "liLDyilbhmo", title: "Radek Stříž, Kopeme za Boskovice" },
  { videoId: "b5YuUACNqQ8", title: "Jaromíra Vítková, Lidovci" },
  { videoId: "MnPCqlTCzqY", title: "Petr Malach, Srdce pro Boskovice" },
  { videoId: "tm_zYVTHpKQ", title: "Karel Trefný, SPD" },
  { videoId: "1fbOcqZZiBU", title: "Michal Staněk, Boskováci" },
];

export default async function ElectionPage() {
  const articles = getAllArticles("content/articles")
    // Only take election articles
    .filter(({ tags }) => tags.includes("komunální volby 2026"))
    // In reverse chronological order
    .reverse()
    // Without article body
    .map(stripBody);
  const isProgrammePoll = (a: ArticleMetadata) =>
    a.title.includes("Programová anketa");
  const pollArticles = articles.filter(isProgrammePoll);
  const otherArticles = articles.filter((a) => !isProgrammePoll(a));
  return (
    <div className="flex flex-col gap-7">
      <HeroCard />

      <div>
        <SectionDivider>Předvolební rozhovory</SectionDivider>
        <div className="grid md:grid-cols-2 gap-7">
          {interviewIds.map((i) => (
            <InterviewCard key={i.videoId} interview={i} />
          ))}
        </div>
      </div>

      <div>
        <SectionDivider>Hoďte to taky nám</SectionDivider>
        <FundraisingBox
          widgetToken="5cfak3j2zmvvsxns"
          imagePreset={{
            url: "https://i.ohlasy.info/i/17fc4b1c.jpg",
            alt: "Momentka z natáčení",
            width: 4032,
            height: 3024,
          }}
        />
      </div>

      <div>
        <SectionDivider>Programy stran</SectionDivider>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {pollArticles.map((article) => (
            <SmallArticlePreview key={article.title} article={article} />
          ))}
        </div>
      </div>

      <div>
        <SectionDivider>Napsali a natočili jsme o volbách</SectionDivider>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {otherArticles.map((article) => (
            <SmallArticlePreview key={article.title} article={article} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 text-center mb-20">
        <SectionDivider>Autorstvo</SectionDivider>
        <p className="max-w-prose m-auto text-balance">
          Volební rozhovory pro vás připravili Tomáš Trumpeš (
          <i>obsah, moderování</i>), Tomáš Znamenáček (
          <i>kamera, zvuk, střih</i>), Oto Matal (<i>kamery</i>), Magda
          Znamenáčková (<i>střih</i>) a Kristina Studená (<i>fundraising</i>).
        </p>
        <p className="max-w-prose m-auto text-balance">
          Na pokrytí boskovických komunálních voleb přispěli{" "}
          <a href="https://www.nfnz.cz" className="typo-link">
            Nadační fond nezávislé žurnalistiky
          </a>{" "}
          a firma{" "}
          <a href="https://ldseating.com" className="typo-link">
            LD Seating
          </a>
          . Díky!
        </p>
      </div>
    </div>
  );
}

const HeroCard = () => (
  <div className="relative w-full aspect-4/3 sm:aspect-2/1 md:aspect-3/1 overflow-hidden rounded-lg -mb-7">
    <Image
      src="https://i.ohlasy.info/i/369e00cb.jpeg"
      alt="Komunální volby 2026"
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/40 to-black/20" />
    <div className="absolute inset-0 flex flex-col justify-end md:justify-center gap-2 p-5 sm:p-6 md:p-10 text-white">
      <h1 className="text-3xl md:text-4xl font-bold">Komunální volby 2026</h1>
      <p className="md:text-xl max-w-prose">
        Všechny důležité informace na jednom místě
      </p>
    </div>
  </div>
);

const InterviewCard = ({ interview }: { interview: Interview }) => {
  const embedUrl = new URL(
    `https://www.youtube-nocookie.com/embed/${interview.videoId}`,
  );
  return (
    <div className="bg-light-gray">
      <iframe
        className="w-full aspect-video"
        src={embedUrl.toString()}
        title={interview.title}
        allow="gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
