/** biome-ignore-all lint/complexity/useLiteralKeys: We prefer to keep the keys consistent */
import z from "zod";
import { fetchAllRecords } from "./airtable.ts";

export type Book = z.infer<typeof bookSchema>;
const bookSchema = z
  .object({
    ID: z.number(),
    "Databázové ID": z.string(),
    Název: z.string(),
    "URL slug": z.string(),
    Podtitul: z.string(),
    Anotace: z.string(),
    "Fotka na výšku": z.string(),
    "Fotka na šířku": z.string(),
    "Rok vydání": z.string(),
    Autorstvo: z.string(),
    "Cena za kus": z.number().optional(),
    Stav: z.enum(["v prodeji", "vyprodáno"]),
  })
  .transform((b) => ({
    id: b["ID"],
    databaseId: b["Databázové ID"],
    title: b["Název"],
    slug: b["URL slug"],
    subtitle: b["Podtitul"],
    description: b["Anotace"],
    photoPortrait: b["Fotka na výšku"],
    photoLandscape: b["Fotka na šířku"],
    publishYear: b["Rok vydání"],
    authors: b["Autorstvo"],
    price: b["Cena za kus"],
    state: b["Stav"],
  }));

/** Fetch all available books */
export const fetchAllBooks = async () =>
  fetchAllRecords({
    appId: "apptZroU7Vo0zMDjT",
    tableId: "tblODWl1pWKSEAKmv",
    decoder: bookSchema.parse,
  });

/** Fetch book by database ID */
export const fetchBookById = async (bookId: string) =>
  fetchAllBooks().then((books) => books.find((b) => b.databaseId === bookId));

/** Sort by year published, most recent first */
export const sortByYear = (a: Book, b: Book) =>
  b.publishYear.localeCompare(a.publishYear);
