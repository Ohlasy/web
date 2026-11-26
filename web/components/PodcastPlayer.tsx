"use client";

import Image from "next/image";
import Plausible from "plausible-tracker";
import type { PodcastEpisode, PodcastMetadata } from "@/src/data/podcasts";
import { tilde } from "@/src/utils";
import { FullWidthCard } from "./FullWidthCard";

type PodcastPlayerProps = {
  episode: PodcastEpisode;
  showMetadata: PodcastMetadata;
  t?: number;
};

export const PodcastPlayer = ({
  episode,
  showMetadata,
  t,
}: PodcastPlayerProps) => {
  const { trackEvent } = Plausible({ domain: "ohlasy.info" });
  return (
    <FullWidthCard>
      <div className="flex flex-col gap-7">
        <div className="flex flex-col md:flex-row gap-7">
          <div className="relative aspect-square w-full md:w-54 shrink-0">
            <Image
              className="bg-gray shadow-md rounded-xl object-cover"
              sizes="(min-width: 768px) 216px, 100vw"
              src={episode.image}
              alt=""
              fill
            />
          </div>
          <p className="text-xl lg:text-2xl text-balance text-white hyphens-none!">
            {tilde(episode.title)}
          </p>
        </div>
        <audio
          controls
          className="w-full"
          src={t ? `${episode.url}#t=${t}` : episode.url}
          onPlay={() => {
            trackEvent("Start Playback");
          }}
        />
        <div className="flex flex-row flex-wrap gap-4 text-sm">
          {Object.entries(showMetadata.links).map(([title, url]) => (
            <ServiceButton key={title} href={url} title={title} />
          ))}
          <ServiceButton
            key="download"
            href={episode.url}
            title="stáhnout MP3"
          />
        </div>
      </div>
    </FullWidthCard>
  );
};

const ServiceButton = ({ href, title }: { href: string; title: string }) => (
  <a
    href={href}
    className="rounded-full whitespace-nowrap border text-white! border-white px-2 hover:bg-white hover:text-plum!"
    target="_blank"
    rel="noopener"
  >
    ▷ {title}
  </a>
);
