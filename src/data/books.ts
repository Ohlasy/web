import {
  array,
  type decodeType,
  field,
  number,
  optional,
  record,
  string,
  union,
} from "typescript-json-decoder";
import { getTable, unwrapRecords } from "./airtable";

//
// Books
//

const booksTable = () => getTable("apptZroU7Vo0zMDjT", "tblODWl1pWKSEAKmv");

export type Book = decodeType<typeof decodeBook>;
const decodeBook = record({
  id: field("ID", number),
  databaseId: field("Databázové ID", string),
  title: field("Název", string),
  slug: field("URL slug", string),
  subtitle: field("Podtitul", string),
  description: field("Anotace", string),
  photoPortrait: field("Fotka na výšku", string),
  photoLandscape: field("Fotka na šířku", string),
  publishYear: field("Rok vydání", string),
  authors: field("Autorstvo", string),
  price: field("Cena za kus", optional(number)),
  state: field("Stav", union("v prodeji", "vyprodáno")),
});

export const getAllBooks = async () =>
  booksTable().select().all().then(unwrapRecords).then(array(decodeBook));

export const sortByYear = (a: Book, b: Book) =>
  b.publishYear.localeCompare(a.publishYear);
