import { buildUrlForDay, decodeIncidentFeed } from "./upstream";

test("Decode sample feed", () => {
  const feed = decodeIncidentFeed(sampleFeed);
  expect(feed.length).toBe(13);
});

test("Build URL for given date", () => {
  const url = buildUrlForDay(new Date("2024-09-13T00:00:00.000Z"));
  expect(url).toBe(
    "https://udalosti.firebrno.cz/api/?casOd=2024-09-12T00:00:00.000Z&casDo=2024-09-13T00:00:00.000Z&krajId=116&okresId=3701&background=true&stavIds=210&stavIds=400&stavIds=410&stavIds=420&stavIds=430&stavIds=440&stavIds=500&stavIds=510&stavIds=520&stavIds=600&stavIds=610&stavIds=620&stavIds=700&stavIds=710&stavIds=750&stavIds=760&stavIds=780&stavIds=800"
  );
});

const sampleFeed = [
  {
    id: 448462062,
    casOhlaseni: "2024-09-13T08:47:37.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3200,
    podtypId: 3212,
    poznamkaProMedia: "DN 2 OA do spadeného stromu.",
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Letovice",
    castObce: "Letovice",
    ORP: "Boskovice",
    ulice: "Pražská",
    gis1: "596623",
    gis2: "1119463",
    zoc: false,
    silnice: null,
  },
  {
    id: 448460062,
    casOhlaseni: "2024-09-13T08:35:16.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3505,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Hodonín",
    castObce: "Hodonín",
    ORP: "Boskovice",
    ulice: null,
    gis1: "608361",
    gis2: "1123797",
    zoc: false,
    silnice: null,
  },
  {
    id: 448448062,
    casOhlaseni: "2024-09-13T08:09:06.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3527,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Svitávka",
    castObce: "Svitávka",
    ORP: "Boskovice",
    ulice: "Palackého",
    gis1: "595176",
    gis2: "1127000",
    zoc: false,
    silnice: null,
  },
  {
    id: 448429062,
    casOhlaseni: "2024-09-13T07:08:05.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3501,
    poznamkaProMedia: "Uvolnění vodního toku.",
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Svitávka",
    castObce: null,
    ORP: "Boskovice",
    ulice: null,
    gis1: "595221",
    gis2: "1126769",
    zoc: false,
    silnice: null,
  },
  {
    id: 448425062,
    casOhlaseni: "2024-09-13T06:58:37.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3505,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Blansko",
    castObce: "Blansko",
    ORP: "Blansko",
    ulice: "Gellhornova",
    gis1: "591827",
    gis2: "1143752",
    zoc: false,
    silnice: null,
  },
  {
    id: 448417062,
    casOhlaseni: "2024-09-13T06:17:38.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3501,
    poznamkaProMedia: "Odstranění naplavenin z koryta řeky.",
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Doubravice nad Svitavou",
    castObce: null,
    ORP: "Blansko",
    ulice: null,
    gis1: "593734",
    gis2: "1134216",
    zoc: false,
    silnice: null,
  },
  {
    id: 448409062,
    casOhlaseni: "2024-09-13T06:00:52.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3505,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Sloup",
    castObce: null,
    ORP: "Blansko",
    ulice: null,
    gis1: "586286",
    gis2: "1138002",
    zoc: false,
    silnice: null,
  },
  {
    id: 448395062,
    casOhlaseni: "2024-09-13T05:25:35.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3505,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Hodonín",
    castObce: "Hodonín",
    ORP: "Boskovice",
    ulice: null,
    gis1: "608491",
    gis2: "1125066",
    zoc: false,
    silnice: null,
  },
  {
    id: 448394062,
    casOhlaseni: "2024-09-13T05:25:29.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3505,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Černovice",
    castObce: "Černovice",
    ORP: "Boskovice",
    ulice: null,
    gis1: "606504",
    gis2: "1128631",
    zoc: false,
    silnice: null,
  },
  {
    id: 448388062,
    casOhlaseni: "2024-09-13T04:47:34.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3505,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Rudice",
    castObce: "Rudice",
    ORP: "Blansko",
    ulice: null,
    gis1: "589421",
    gis2: "1146322",
    zoc: false,
    silnice: null,
  },
  {
    id: 448380062,
    casOhlaseni: "2024-09-13T03:35:21.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3505,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Boskovice",
    castObce: "Boskovice",
    ORP: "Boskovice",
    ulice: null,
    gis1: "592305",
    gis2: "1129764",
    zoc: false,
    silnice: null,
  },
  {
    id: 448371062,
    casOhlaseni: "2024-09-13T02:09:42.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3505,
    poznamkaProMedia: "DN 1 OA.",
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Malá Roudka",
    castObce: "Malá Roudka",
    ORP: "Boskovice",
    ulice: null,
    gis1: "590680",
    gis2: "1116083",
    zoc: false,
    silnice: null,
  },
  {
    id: 448365062,
    casOhlaseni: "2024-09-12T23:47:06.000Z",
    casVzniku: null,
    stavId: 510,
    typId: 3500,
    podtypId: 3526,
    poznamkaProMedia: null,
    kraj: { id: 116, nazev: "Jihomoravský" },
    okres: { id: 3701, nazev: "Blansko" },
    obec: "Blansko",
    castObce: null,
    ORP: "Blansko",
    ulice: null,
    gis1: "593372",
    gis2: "1144926",
    zoc: false,
    silnice: null,
  },
];