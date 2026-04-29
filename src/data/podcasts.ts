import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import yaml from "js-yaml";
import {
  array,
  type decodeType,
  number,
  record,
  string,
} from "typescript-json-decoder";
import { decodeUrl } from "@/src/decoding";
import type { iTunesShowEpisode } from "@/src/feeds";

export type PodcastEpisode = decodeType<typeof decodePodcastEpisode>;
export const decodePodcastEpisode = record({
  title: string,
  image: string,
  duration: string,
  date: string,
  url: decodeUrl,
  bytes: number,
  description: string,
});

export type Podcast = decodeType<typeof decodePodcast>;
export const decodePodcast = array(decodePodcastEpisode);

export type PodcastMetadata = decodeType<typeof decodePodcastMetadata>;
export const decodePodcastMetadata = record({
  title: string,
  feed: string,
  image: string,
  description: string,
});

export async function getPodcastMetadata(
  podcastId: string,
): Promise<PodcastMetadata> {
  const path = resolve("content", "podcasts", podcastId, "metadata.yml");
  const src = await readFile(path, { encoding: "utf-8" });
  return decodePodcastMetadata(yaml.load(src));
}

/** This is intentionally sync, otherwise our custom tag Markdoc code breaks down somehow */
export function getAllPodcastEpisodesSync(podcastId: string): Podcast {
  const path = resolve("content", "podcasts", podcastId, "episodes.yml");
  const src = readFileSync(path, { encoding: "utf-8" });
  return decodePodcast(yaml.load(src));
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
