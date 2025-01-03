import { decodeUrl, decodeDate } from "src/decoding";
import {
  array,
  decodeType,
  number,
  record,
  string,
} from "typescript-json-decoder";

export type PodcastEpisode = decodeType<typeof decodePodcastEpisode>;
export const decodePodcastEpisode = record({
  title: string,
  image: string,
  duration: string,
  date: decodeDate,
  url: decodeUrl,
  bytes: number,
  description: string,
});

export type Podcast = decodeType<typeof decodePodcast>;
export const decodePodcast = array(decodePodcastEpisode);
