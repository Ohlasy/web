import { readFile } from "fs/promises";
import yaml from "js-yaml";
import { decodeObject, decodeUrl } from "./decoding";
import { iTunesShowEpisode } from "./feeds";
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
});

export const decodeAuthors = (value: Pojo) => {
  const decodeWrapper = decodeObject(decodeObject(string));
  const authorMap = decodeWrapper(value);
  return Object.entries(authorMap).map(([name, fields]) =>
    decodeAuthor({ name, ...fields })
  );
};

export const getAllAuthors = async () =>
  await readFile("content/autori.yml", "utf-8")
    .then((str) => yaml.load(str))
    .then(decodeAuthors);

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
    .then((str) => yaml.load(str))
    .then(array(decodePodcastEpisode));

export function convertEpisodeToPodcastItem(
  episode: PodcastEpisode
): iTunesShowEpisode {
  const { title, description, duration, url, bytes, date } = episode;
  return {
    title,
    description,
    duration,
    pubDate: new Date(date),
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
