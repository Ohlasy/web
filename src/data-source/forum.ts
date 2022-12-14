import fetch from "node-fetch";
import {
  array,
  decodeType,
  number,
  optional,
  record,
  string,
} from "typescript-json-decoder";

//
// Types and decoding
//

export type User = decodeType<typeof decodeUser>;
export const decodeUser = record({
  id: number,
  username: string,
  name: string,
  avatar_template: optional(string),
});

export type Poster = decodeType<typeof decodePoster>;
export const decodePoster = record({
  user_id: number,
});

export type Topic = decodeType<typeof decodeTopic>;
export const decodeTopic = record({
  id: number,
  title: string,
  posters: array(decodePoster),
});

export type LatestTopicsSummary = decodeType<typeof decodeLatestTopicsSummary>;
export const decodeLatestTopicsSummary = record({
  users: array(decodeUser),
  topic_list: record({
    topics: array(decodeTopic),
  }),
});

//
// API calls
//

export const getLatestTopicsSummary = async () =>
  await fetch("https://forum.ohlasy.info/latest.json")
    .then((response) => response.json())
    .then(decodeLatestTopicsSummary);

//
// Helpers
//

export const getTopicUrl = (topic: Pick<Topic, "id">) =>
  `https://forum.ohlasy.info/t/${topic.id}/last`;

export const getUserAvatar = (
  user: Pick<User, "avatar_template">,
  size: number
) =>
  "https://forum.ohlasy.info/" +
  user.avatar_template?.replace("{size}", size.toString());
