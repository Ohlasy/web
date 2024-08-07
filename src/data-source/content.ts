import { readFile } from "fs/promises";
import { join } from "path";
import yaml from "js-yaml";
import { decodeObject, decodeUrl } from "../decoding";
import { iTunesShowEpisode } from "../feeds";
import {
  array,
  decodeType,
  field,
  number,
  optional,
  Pojo,
  record,
  string,
} from "typescript-json-decoder";

//
// Authors
//

export type Author = decodeType<typeof decodeAuthor>;
export const decodeAuthor = record({
  name: string,
  mail: optional(string),
  phoneNumber: field("telefon", optional(string)),
  profilePhotoUrl: field("profilovka", optional(decodeUrl)),
  bio: optional(string),
  fedi: optional(string),
});

export const decodeAuthors = (value: Pojo) => {
  const decodeWrapper = decodeObject(decodeObject(string));
  const authorMap = decodeWrapper(value);
  return Object.entries(authorMap).map(([name, fields]) =>
    decodeAuthor({ name, ...fields })
  );
};

export const getAllAuthors = async () => {
  const path = join(process.cwd(), "content", "autori.yml");
  return await readFile(path, "utf-8")
    .then((str) => yaml.load(str) as Pojo)
    .then(decodeAuthors);
};

//
// Podcasts
//

export type PodcastEpisode = decodeType<typeof decodePodcastEpisode>;
export const decodePodcastEpisode = record({
  title: string,
  image: decodeUrl,
  duration: string,
  date: string,
  url: decodeUrl,
  bytes: number,
  description: string,
});

export const getPodcastEpisodes = async (path: string) =>
  await readFile(path, "utf-8")
    .then((str) => yaml.load(str) as Pojo)
    .then(array(decodePodcastEpisode));

export function convertEpisodeToPodcastItem(
  episode: PodcastEpisode
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
