import { decodeBannerProps } from "./banners";
import { decodePage } from "./notion";

test("Decode banner", () => {
  const decoder = decodePage(decodeBannerProps);
  const value = decoder(sample);
  expect(value).toEqual({
    id: "84191e47-fba3-4354-9131-f44787f33aa5",
    object: "page",
    props: {
      alt: "Zajděte si za kulturou!",
      image: "https://www.kulturaboskovice.cz/img/ohlasy.jpg?54",
      name: "KZMB",
      published: true,
      url: "https://www.kulturaboskovice.cz/kultura/akce-23-05-2024-symfonicky-orchestr-mesta-boskovice-rapsodie-pres-ocean",
    },
  });
});

const sample = {
  object: "page",
  id: "84191e47-fba3-4354-9131-f44787f33aa5",
  created_time: "2021-05-20T09:45:00.000Z",
  last_edited_time: "2024-04-30T12:27:00.000Z",
  created_by: {
    object: "user",
    id: "296e0e45-2075-4739-a0f8-d609e4531f5a",
  },
  last_edited_by: {
    object: "user",
    id: "296e0e45-2075-4739-a0f8-d609e4531f5a",
  },
  cover: null,
  icon: null,
  parent: {
    type: "database_id",
    database_id: "50c3e92b-4f7d-44ee-9cc5-a139d81b07b5",
  },
  archived: false,
  in_trash: false,
  properties: {
    "Odkaz": {
      id: "BAoi",
      type: "url",
      url: "https://www.kulturaboskovice.cz/kultura/akce-23-05-2024-symfonicky-orchestr-mesta-boskovice-rapsodie-pres-ocean",
    },
    "Zveřejnit": {
      id: "EFI%3B",
      type: "checkbox",
      checkbox: true,
    },
    "Obrázek": {
      id: "YO%3B%5E",
      type: "url",
      url: "https://www.kulturaboskovice.cz/img/ohlasy.jpg?54",
    },
    "Náhradní text": {
      id: "i%3FnP",
      type: "rich_text",
      rich_text: [
        {
          type: "text",
          text: {
            content: "Zajděte si za kulturou!",
            link: null,
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
          plain_text: "Zajděte si za kulturou!",
          href: null,
        },
      ],
    },
    "Název": {
      id: "title",
      type: "title",
      title: [
        {
          type: "text",
          text: {
            content: "KZMB",
            link: null,
          },
          annotations: {
            bold: false,
            italic: false,
            strikethrough: false,
            underline: false,
            code: false,
            color: "default",
          },
          plain_text: "KZMB",
          href: null,
        },
      ],
    },
  },
  url: "https://www.notion.so/KZMB-84191e47fba343549131f44787f33aa5",
  public_url: null,
};
