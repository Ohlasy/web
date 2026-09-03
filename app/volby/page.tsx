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
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Komunální volby 2026",
  description: "Všechny důležité informace na jednom místě",
  openGraph: {
    images: getResizedImageUrl("https://i.ohlasy.info/i/369e00cb.jpeg", 1920),
  },
};

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
      <InterviewsCard />

      <div>
        <SectionDivider>Hoďte to taky nám</SectionDivider>
        <FundraisingBox
          widgetToken="5cfak3j2zmvvsxns"
          imagePreset={{
            url: "https://i.ohlasy.info/i/fbe74bd1.jpeg",
            alt: "Momentka z natáčení minulých voleb",
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
    </div>
  );
}

const HeroCard = () => (
  <div className="relative w-full aspect-4/3 sm:aspect-2/1 md:aspect-3/1 overflow-hidden rounded-lg">
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

const InterviewsCard = () => (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
    <SignUpForm />
    <div className="lg:col-span-2">
      <Image
        className="lg:col-span-2 h-full object-cover"
        src="https://i.ohlasy.info/i/c21066c0.jpg"
        sizes="(min-width: 640px) 50vw, 100vw"
        width={1734}
        height={977}
        alt="Natáčecí studio z minulých voleb"
      />
    </div>
  </div>
);
