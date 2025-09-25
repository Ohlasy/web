import assert from "node:assert";
import test from "node:test";
import {
  decodeAuthor,
  decodeAuthors,
  getAllAuthors,
  getPodcastEpisodes,
} from "./content";

test("Decode authors", async () => {
  assert.deepEqual(
    decodeAuthor({
      name: "Tomáš Trumpeš",
      mail: "tomas.trumpes@ohlasy.info",
      telefon: "608 763 954",
      profilovka: "https://i.ohlasy.info/i/0961fcd0.jpg",
    }),
    {
      name: "Tomáš Trumpeš",
      mail: "tomas.trumpes@ohlasy.info",
      phoneNumber: "608 763 954",
      profilePhotoUrl: "https://i.ohlasy.info/i/0961fcd0.jpg",
      bio: undefined,
      fedi: undefined,
    }
  );
  assert.deepEqual(
    decodeAuthors({
      "Tomáš Trumpeš": {
        mail: "tomas.trumpes@ohlasy.info",
        telefon: "608 763 954",
        profilovka: "https://i.ohlasy.info/i/0961fcd0.jpg",
      },
    }),
    [
      {
        name: "Tomáš Trumpeš",
        mail: "tomas.trumpes@ohlasy.info",
        phoneNumber: "608 763 954",
        profilePhotoUrl: "https://i.ohlasy.info/i/0961fcd0.jpg",
        bio: undefined,
        fedi: undefined,
      },
    ]
  );
  assert.doesNotReject(getAllAuthors());
});

test("Decode podcasts", async () => {
  assert.doesNotReject(getPodcastEpisodes("content/hrebenovka.yml"));
  assert.doesNotReject(getPodcastEpisodes("content/podcast.yml"));
});
