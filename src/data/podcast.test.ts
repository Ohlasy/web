import yaml from "js-yaml";
import assert from "node:assert";
import test from "node:test";
import { decodePodcast } from "./podcast";

test("Decode podcast", () => {
  const podcast = decodePodcast(yaml.load(sample));
  assert.deepEqual(podcast, [
    {
      bytes: 14000000,
      date: "Tue, 17 Dec 2024 9:16:00 +0200",
      description: "Další rozhovor s evangelickým farářem…",
      duration: "00:26:41",
      image: "https://i.ohlasy.info/i/9483608e.jpg",
      title: "S evangelickým farářem Jiřím Burešem o křesťanství a nenásilí",
      url: "https://data.ohlasy.info/2024/podcast/bures.mp3",
    },
    {
      bytes: 17000000,
      date: "Thu, 12 Dec 2024 9:16:00 +0200",
      description: "Ohlasy vydaly knihu textů Heleny Janíkové…",
      duration: "00:34:17",
      image: "https://i.ohlasy.info/i/7ff92dc9.jpg",
      title: "O nové knize Příběhy z ghetta",
      url: "https://data.ohlasy.info/2024/podcast/pribehy.mp3",
    },
  ]);
});

const sample = `- title: "S evangelickým farářem Jiřím Burešem o křesťanství a nenásilí"
  image: https://i.ohlasy.info/i/9483608e.jpg
  duration: 00:26:41
  date: Tue, 17 Dec 2024 9:16:00 +0200
  url: https://data.ohlasy.info/2024/podcast/bures.mp3
  bytes: 14000000
  description: >-
    Další rozhovor s evangelickým farářem…
- title: "O nové knize Příběhy z ghetta"
  image: https://i.ohlasy.info/i/7ff92dc9.jpg
  duration: 00:34:17
  date: Thu, 12 Dec 2024 9:16:00 +0200
  url: https://data.ohlasy.info/2024/podcast/pribehy.mp3
  bytes: 17000000
  description: >-
    Ohlasy vydaly knihu textů Heleny Janíkové…
`;
