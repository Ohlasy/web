"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { PodcastEpisode } from "src/data/podcast";
import { tilde } from "src/utils";

type PodcastPlayerProps = {
  episode: PodcastEpisode;
};

export const PodcastPlayer = ({ episode }: PodcastPlayerProps) => {
  const playerRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  return (
    <div className="bg-plum rounded-xl p-7 md:p-9 my-6">
      <audio
        src={episode.url}
        ref={playerRef}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />
      <div className="flex flex-col md:flex-row gap-7">
        <div className="relative aspect-square w-full md:w-[216px] shrink-0">
          <Image
            className="bg-gray shadow-lg rounded-xl"
            sizes="(min-width: 768px) 216px, 100vw"
            src={episode.image}
            alt=""
            fill
          />
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-white">
            <p className="text-2xl text-balance">{tilde(episode.title)}</p>
            <p className="text-sm">
              {Intl.DateTimeFormat("cs-CZ").format(new Date(episode.date))} 
            </p>
          </div>
          <div>
            {!playing && (
              <button
                className="btn-inverted border-none max-sm:w-full"
                onClick={() => {
                  playerRef.current?.play();
                }}
              >
                Spustit
              </button>
            )}
            {playing && (
              <button
                className="btn-inverted border-none max-sm:w-full"
                onClick={() => {
                  playerRef.current?.pause();
                }}
              >
                Pozastavit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
