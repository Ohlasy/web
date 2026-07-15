import Image from "next/image";
import type { ReactNode } from "react";
import { Button } from "@/components/Button";
import { FundraisingBox } from "@/components/FundraisingBox";
import { SectionDivider } from "@/components/SectionDivider";
import { SmallArticlePreview } from "@/components/SmallArticlePreview";
import { getAllArticles, stripBody } from "@/src/article";

const previousElectionPlaylistUrl =
  "https://www.youtube.com/watch?v=ADXHH4XAHN8&list=PLPvYKKWRSI7nAl7usr46TbUZ1_3lNyxnI";
const previousElectionDebateUrl = "https://www.youtube.com/watch?v=KwIXt-nOF6w";

export default async function ElectionPage() {
  const electionArticles = getAllArticles("content/articles")
    // Only take election articles
    .filter(({ tags }) => tags.includes("komunální volby 2026"))
    // In reverse chronological order
    .reverse()
    // Without article body
    .map(stripBody);
  return (
    <div className="flex flex-col gap-7">
      <div className="text-center flex flex-col gap-2 my-4">
        <h1 className="typo-head1">Komunální volby 2026</h1>
        <h2>9.–10. října 2026</h2>
      </div>

      <ImageCard
        imageUrl="https://i.ohlasy.info/i/c5295800.jpg"
        imageWidth={1734}
        imageHeight={977}
      >
        <h2 className="typo-head1">Chystáme: Volební rozhovory</h2>
        <p className="max-w-prose m-auto text-balance">
          Stavíme pro vás natáčecí studio a přineseme vám videorozhovory s lídry
          a lídryněmi všech kandidátek. Můžete se na ně těšit v první polovině
          září.
        </p>
        <div className="flex flex-row justify-center mt-4">
          <Button
            href={previousElectionPlaylistUrl}
            text="Jak to vypadalo minule?"
            target="_blank"
          />
        </div>
      </ImageCard>

      <ImageCard
        imageUrl="https://i.ohlasy.info/i/7d1284c9.jpg"
        imageWidth={1734}
        imageHeight={977}
      >
        <h2 className="typo-head1">Chystáme: Předvolební debata</h2>
        <p className="max-w-prose m-auto text-balance">
          Stejně jako minule se můžete těšit i na živou debatu kandidátů a
          kandidátek na starost(k)u, kterou uspořádáme v posledních týdnech před
          volbami.
        </p>
        <div className="flex flex-row justify-center mt-4">
          <Button
            href={previousElectionDebateUrl}
            text="Jak to vypadalo minule?"
            target="_blank"
          />
        </div>
      </ImageCard>

      <div>
        <SectionDivider>Hoďte to taky nám</SectionDivider>
        <FundraisingBox />
      </div>

      <div>
        <SectionDivider>Napsali a natočili jsme o volbách</SectionDivider>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {electionArticles.map((article) => (
            <SmallArticlePreview key={article.title} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

type ImageCardProps = {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  children: ReactNode;
};

const ImageCard = ({
  imageUrl,
  imageWidth,
  imageHeight,
  children,
}: ImageCardProps) => (
  <div className="relative overflow-hidden">
    <Image
      alt=""
      className="absolute w-full h-full blur-md object-cover brightness-80"
      sizes="(min-width: 640px) 1096px, 100vw"
      src={imageUrl}
      width={imageWidth}
      height={imageHeight}
    />
    <div className="relative p-10 pb-15 lg:pt-40 lg:pb-50 flex flex-col gap-4 text-white text-center">
      {children}
    </div>
  </div>
);
