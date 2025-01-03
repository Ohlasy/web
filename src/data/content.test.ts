import {
  decodeAuthor,
  decodeAuthors,
  getAllAuthors,
  getPodcastEpisodes,
} from "./content";

test("Decode authors", async () => {
  expect(
    decodeAuthor({
      name: "Tomáš Trumpeš",
      mail: "tomas.trumpes@ohlasy.info",
      telefon: "608 763 954",
      profilovka: "https://i.ohlasy.info/i/0961fcd0.jpg",
    })
  ).toEqual({
    name: "Tomáš Trumpeš",
    mail: "tomas.trumpes@ohlasy.info",
    phoneNumber: "608 763 954",
    profilePhotoUrl: "https://i.ohlasy.info/i/0961fcd0.jpg",
  });
  expect(
    decodeAuthors({
      "Tomáš Trumpeš": {
        mail: "tomas.trumpes@ohlasy.info",
        telefon: "608 763 954",
        profilovka: "https://i.ohlasy.info/i/0961fcd0.jpg",
      },
    })
  ).toEqual([
    {
      name: "Tomáš Trumpeš",
      mail: "tomas.trumpes@ohlasy.info",
      phoneNumber: "608 763 954",
      profilePhotoUrl: "https://i.ohlasy.info/i/0961fcd0.jpg",
    },
  ]);
  expect(await getAllAuthors()).resolves;
});

test("Decode podcasts", async () => {
  expect(await getPodcastEpisodes("content/hrebenovka.yml")).resolves;
  expect(await getPodcastEpisodes("content/podcast.yml")).resolves;
});
