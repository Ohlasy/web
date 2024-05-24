import { decodeType, field, record } from "typescript-json-decoder";
import {
  decodeId,
  decodePlainRichtext,
  decodeTitle,
  decodeUrl,
  getTypedDatabaseRows,
} from "./notion";

export type Book = decodeType<typeof decodeBookProps>;

export const decodeBookProps = record({
  id: field("ID", decodeId),
  title: field("Název", decodeTitle),
  slug: field("URL slug", decodePlainRichtext),
  subtitle: field("Podtitul", decodePlainRichtext),
  description: field("Anotace", decodePlainRichtext),
  coverImageUrl: field("Fotka", decodeUrl),
  publishYear: field("Rok vydání", decodePlainRichtext),
  authors: field("Autorstvo", decodePlainRichtext),
});

export const getAllBooks = async () =>
  getTypedDatabaseRows("c0bf61afc9d7441c9ab67f1b7e917899", decodeBookProps);

export const sortByYear = (a: Book, b: Book) =>
  b.publishYear.localeCompare(a.publishYear);
