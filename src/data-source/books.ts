import Airtable, { FieldSet, Record, Records } from "airtable";
import { relationToZeroOrOne } from "src/decoding";
import {
  array,
  decodeType,
  field,
  number,
  record,
  string,
  union,
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

//
// Books
//

const bookTableId = "tblODWl1pWKSEAKmv";

export type Book = decodeType<typeof decodeBook>;
export const decodeBook = record({
  id: field("ID", number),
  databaseId: field("Databázové ID", string),
  title: field("Název", string),
  slug: field("URL slug", string),
  subtitle: field("Podtitul", string),
  description: field("Anotace", string),
  coverImageUrl: field("Fotka", string),
  publishYear: field("Rok vydání", string),
  authors: field("Autorstvo", string),
});

export const getAllBooks = async () =>
  getTable(bookTableId)
    .select()
    .all()
    .then(unwrapRecords)
    .then(array(decodeBook));

export const sortByYear = (a: Book, b: Book) =>
  b.publishYear.localeCompare(a.publishYear);

//
// Orders
//

const orderTableId = "tbllODnsl8U1U8X7N";

export type Order = decodeType<typeof decodeOrder>;
export const decodeOrder = record({
  id: field("ID", number),
  orderedItemId: field("Objednaný titul", relationToZeroOrOne),
  deliveryName: field("Jméno", string),
  deliveryAddress: field("Doručovací adresa", string),
  deliveryEmail: field("Kontaktní mail", string),
  deliveryType: field("Způsob doručení", union("osobně", "poštou")),
  status: field("Stav objednávky", union("nová", "vyřízená", "stornovaná")),
});

export const createOrder = async (order: Omit<Order, "id" | "status">) =>
  getTable(orderTableId).create({
    "Objednaný titul": [order.orderedItemId!],
    "Jméno": order.deliveryName,
    "Doručovací adresa": order.deliveryAddress,
    "Kontaktní mail": order.deliveryEmail,
    "Způsob doručení": order.deliveryType,
    "Stav objednávky": "nová",
  });
