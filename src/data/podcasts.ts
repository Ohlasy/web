import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { load } from "js-yaml";
import {
  array,
  type decodeType,
  number,
  record,
  string,
} from "typescript-json-decoder";
import { decodeObject, decodeUrl } from "@/src/decoding";
import type { iTunesShowEpisode } from "@/src/feeds";

const allValidPodcastIds = ["ohlasy", "hrebenovka"];

export type PodcastEpisode = decodeType<typeof decodePodcastEpisode>;
const decodePodcastEpisode = record({
  title: string,
  image: string,
  duration: string,
  date: string,
  url: decodeUrl,
  bytes: number,
  description: string,
});

export type Podcast = decodeType<typeof decodePodcast>;

/** @internal */
export const decodePodcast = array(decodePodcastEpisode);

export type PodcastMetadata = decodeType<typeof decodePodcastMetadata>;
const decodePodcastMetadata = record({
  title: string,
  feed: string,
  image: string,
  description: string,
  links: decodeObject(string),
});

/** This is intentionally sync, otherwise our custom tag Markdoc code breaks down somehow */
export function getPodcastMetadataSync(podcastId: string): PodcastMetadata {
  const path = resolve("content", "podcasts", podcastId, "metadata.yml");
  const src = readFileSync(path, { encoding: "utf-8" });
  return decodePodcastMetadata(load(src));
}

/** This is intentionally sync, otherwise our custom tag Markdoc code breaks down somehow */
export function getAllPodcastEpisodesSync(podcastId: string): Podcast {
  const path = resolve("content", "podcasts", podcastId, "episodes.yml");
  const src = readFileSync(path, { encoding: "utf-8" });
  return decodePodcast(load(src));
}

export function getOverallPodcastEpisodeCountSync(): number {
  return allValidPodcastIds.flatMap(getAllPodcastEpisodesSync).length;
}

export function convertEpisodeToFeedItem(
  episode: PodcastEpisode,
): iTunesShowEpisode {
  const { title, description, duration, url, bytes, date, image } = episode;
  return {
    title,
    description,
    duration,
    pubDate: new Date(date),
    image,
    guid: {
      value: url,
      isPermaLink: true,
    },
    enclosure: {
      url,
      type: "audio/mpeg",
      length: bytes,
    },
  };
}
