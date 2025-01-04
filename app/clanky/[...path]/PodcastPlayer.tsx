"use client";

import Image from "next/image";
import Plausible from "plausible-tracker";
import { Fragment, useRef, useState } from "react";
import { PodcastEpisode } from "src/data/podcast";
import { RouteTo } from "src/routing";
import { tilde } from "src/utils";

type PodcastPlayerProps = {
  episode: PodcastEpisode;
};

export const PodcastPlayer = ({ episode }: PodcastPlayerProps) => {
  const playerRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { trackEvent } = Plausible({ domain: "ohlasy.info" });

  return (
    <div className="bg-plum rounded-xl p-7 md:p-9 my-6 flex flex-col gap-7">
      <audio
        src={episode.url}
        ref={playerRef}
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={() => setCurrentTime(playerRef.current?.currentTime ?? 0)}
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
            <div className="flex flex-row gap-3">
              {!playing && <div>{episode.duration.replace("00:", "")}</div>}
              {playing && (
                <Fragment>
                  <div className="tabular-nums">{formatTime(currentTime)}</div>
                  <SeekButton
                    onClick={() => (playerRef.current!.currentTime -= 15)}
                    icon={Reverse15Icon}
                  />
                  <SeekButton
                    onClick={() => (playerRef.current!.currentTime += 15)}
                    icon={Forward15Icon}
                  />
                </Fragment>
              )}
            </div>
          </div>
          <div>
            {!playing && (
              <PlaybackButton
                icon={PlayIcon}
                onClick={() => {
                  trackEvent("Start Playback");
                  playerRef.current?.play();
                }}
              />
            )}
            {playing && (
              <PlaybackButton
                onClick={() => playerRef.current?.pause()}
                icon={PauseIcon}
              />
            )}
          </div>
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
    className="rounded-full whitespace-nowrap border-[1px] text-white border-white px-2 hover:bg-white hover:text-plum"
    target="_blank"
  >
    ▷ {title}
  </a>
);

const PlaybackButton = ({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: JSX.Element;
}) => (
  <button
    className="block mt-1 aspect-square w-[50px] text-white hover:scale-110 transition-transform"
    onClick={onClick}
  >
    {icon}
  </button>
);

const SeekButton = ({
  onClick,
  icon,
}: {
  onClick: () => void;
  icon: JSX.Element;
}) => (
  <button
    className="block aspect-square w-[16px] hover:scale-110 transition-transform"
    onClick={onClick}
  >
    {icon}
  </button>
);

const formatTime = (time: number) => {
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = Math.floor(time % 60);
  const str = (n: number) => (n > 9 ? n.toString() : "0" + n.toString());
  return [h, m, s].map(str).join(":");
};

const PlayIcon = (
  <svg
    role="img"
    aria-hidden="false"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
  >
    <title>Spustit</title>
    <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm8.75-4.567a.5.5 0 0 0-.75.433v8.268a.5.5 0 0 0 .75.433l7.161-4.134a.5.5 0 0 0 0-.866L9.75 7.433z"></path>
  </svg>
);

const PauseIcon = (
  <svg
    role="img"
    aria-hidden="false"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
  >
    <title>Pozastavit</title>
    <path d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm7.5-5a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2zm5 0a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-2z"></path>
  </svg>
);

const Forward15Icon = (
  <svg role="img" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <path d="M13.536 4.488h-1.473a.75.75 0 1 0 0 1.5H16V2.051a.75.75 0 0 0-1.5 0v1.27A8.25 8.25 0 1 0 3.962 15.876a.75.75 0 0 0 .826-1.252 6.75 6.75 0 1 1 8.747-10.136Z"></path>
    <path d="M11.81 15.681c.433.198.921.297 1.464.297.55 0 1.03-.124 1.44-.374.419-.25.738-.586.958-1.012.22-.432.33-.913.33-1.44 0-.507-.103-.95-.308-1.332a2.156 2.156 0 0 0-.858-.88 2.416 2.416 0 0 0-1.221-.308c-.294 0-.565.052-.814.154a1.77 1.77 0 0 0-.616.407c-.1.105-.18.211-.237.319l.211-2.134h3.436V7.981h-4.642l-.44 4.61h1.474a1.24 1.24 0 0 1 .462-.518c.212-.14.462-.209.748-.209.256 0 .48.059.67.176.199.118.349.283.452.495.11.206.165.444.165.715 0 .272-.055.514-.165.726a1.135 1.135 0 0 1-.451.495 1.25 1.25 0 0 1-.671.176c-.25 0-.47-.051-.66-.154a1.155 1.155 0 0 1-.451-.429 1.295 1.295 0 0 1-.176-.638h-1.518c.014.536.146.998.396 1.386a2.46 2.46 0 0 0 1.023.87Zm-5.858-5.346V9.28c.697-.051 1.199-.18 1.507-.385.315-.205.51-.51.583-.913h1.32v7.81H7.855v-5.456H5.952Z"></path>
  </svg>
);

const Reverse15Icon = (
  <svg role="img" aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.464 4.5h1.473a.75.75 0 0 1 0 1.5H0V2.063a.75.75 0 0 1 1.5 0v1.27a8.25 8.25 0 1 1 10.539 12.554.75.75 0 0 1-.828-1.25A6.75 6.75 0 1 0 2.464 4.5Z"></path>
    <path d="M0 10.347V9.291c.697-.051 1.199-.18 1.507-.385.315-.205.51-.51.583-.913h1.32v7.81H1.903v-5.456H0Zm7.322 5.643c-.543 0-1.03-.099-1.463-.297a2.46 2.46 0 0 1-1.023-.869c-.25-.389-.382-.85-.396-1.386h1.518c.007.242.066.455.176.638.11.183.26.326.45.43.191.102.411.153.66.153.257 0 .48-.059.672-.176.198-.117.348-.282.45-.495.11-.213.166-.454.166-.726 0-.271-.055-.51-.165-.715a1.135 1.135 0 0 0-.451-.495 1.254 1.254 0 0 0-.671-.176c-.286 0-.536.07-.748.21a1.23 1.23 0 0 0-.462.516H4.56L5 7.993h4.642V9.39H6.207l-.211 2.134c.057-.108.136-.214.237-.319a1.77 1.77 0 0 1 .616-.407c.249-.103.52-.154.814-.154.454 0 .861.103 1.22.308.367.206.653.499.859.88.205.381.308.825.308 1.331 0 .528-.11 1.008-.33 1.441-.22.426-.54.763-.957 1.012-.411.25-.891.374-1.441.374Z"></path>
  </svg>
);
