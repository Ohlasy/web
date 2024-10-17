import Airtable, { FieldSet, Record, Records } from "airtable";
import {
  array,
  decodeType,
  field,
  number,
  record,
  string,
} from "typescript-json-decoder";

//
// Airtable Support
//

/** Unwrap the raw fields object from an Airtable `Record` type */
export const unwrapRecord = <Schema extends FieldSet>(record: Record<Schema>) =>
  record.fields as unknown;

/** Unwrap the raw fields objects from an Airtable `Records` type */
export const unwrapRecords = <Schema extends FieldSet>(
  records: Records<Schema>
) => records.map(unwrapRecord);

const getTable = (tableNameOrId: string) =>
  new Airtable().base("apptZroU7Vo0zMDjT")(tableNameOrId);

const titleTableId = "tblODWl1pWKSEAKmv";

//
// API Types
//

export type Book = decodeType<typeof decodeBook>;
export const decodeBook = record({
  id: field("ID", number),
  title: field("Název", string),
  slug: field("URL slug", string),
  subtitle: field("Podtitul", string),
  description: field("Anotace", string),
  coverImageUrl: field("Fotka", string),
  publishYear: field("Rok vydání", string),
  authors: field("Autorstvo", string),
});

//
// API Calls
//

export const getAllBooks = async () =>
  getTable(titleTableId)
    .select()
    .all()
    .then(unwrapRecords)
    .then(array(decodeBook));

//
// Helpers
//

export const sortByYear = (a: Book, b: Book) =>
  b.publishYear.localeCompare(a.publishYear);
