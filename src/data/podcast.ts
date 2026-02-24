import { decodeUrl, decodeDate } from "src/decoding";
import { resolve } from "path";
import yaml from "js-yaml";
import fs from "fs";
import {
  array,
  type decodeType,
  number,
  record,
  string,
} from "typescript-json-decoder";

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

export function getAllPodcastEpisodes(): Podcast {
  const path = resolve("content", "podcast.yml");
  const src = fs.readFileSync(path, { encoding: "utf-8" });
  return decodePodcast(yaml.load(src));
}
