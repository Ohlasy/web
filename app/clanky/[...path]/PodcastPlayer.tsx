"use client";

import Image from "next/image";
import Plausible from "plausible-tracker";
import type { PodcastEpisode } from "src/data/podcast";
import { RouteTo } from "src/routing";
import { tilde } from "src/utils";

type PodcastPlayerProps = {
  episode: PodcastEpisode;
  t?: number;
};

export const PodcastPlayer = ({ episode, t }: PodcastPlayerProps) => {
  const { trackEvent } = Plausible({ domain: "ohlasy.info" });
  return (
    <div className="bg-plum rounded-xl p-7 md:p-9 my-6 flex flex-col gap-7">
      <div className="flex flex-col md:flex-row gap-7">
        <div className="relative aspect-square w-full md:w-54 shrink-0">
          <Image
            className="bg-gray shadow-lg rounded-xl object-cover"
            sizes="(min-width: 768px) 216px, 100vw"
            src={episode.image}
            alt=""
            fill
          />
        </div>
        <div className="flex flex-col gap-4 text-white">
          <p className="text-2xl text-balance hyphens-none">
            {tilde(episode.title)}
          </p>
          <audio
            className="w-full"
            src={t ? `${episode.url}#t=${t}` : episode.url}
            onPlay={() => {
              trackEvent("Start Playback");
            }}
            controls
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap gap-4 text-sm -mb-2">
        <ServiceButton href={RouteTo.Spotify} title="Spotify" />
        <ServiceButton href={RouteTo.ApplePodcasts} title="Apple Podcasts" />
        <ServiceButton href={RouteTo.YouTubePodcast} title="YouTube" />
        <ServiceButton href={RouteTo.mainPodcastFeed} title="RSS" />
        <ServiceButton href={episode.url} title="stáhnout MP3" />
      </div>
    </div>
  );
};

const ServiceButton = ({ href, title }: { href: string; title: string }) => (
  <a
    href={href}
    className="rounded-full whitespace-nowrap border text-white! border-white px-2 hover:bg-white hover:text-plum!"
    target="_blank"
  >
    ▷ {title}
  </a>
);
