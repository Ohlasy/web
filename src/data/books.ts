import { relationToZeroOrOne } from "src/decoding";
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
import { getTable, unwrapRecord, unwrapRecords } from "./airtable";

//
// Books
//

const booksTable = () => getTable("apptZroU7Vo0zMDjT", "tblODWl1pWKSEAKmv");

export type Book = decodeType<typeof decodeBook>;
export const decodeBook = record({
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

export const getBookById = async (databaseId: string) =>
  booksTable()
    .find(databaseId)
    .then(unwrapRecord)
    .then(decodeBook)
    .catch((_) => null);

export const sortByYear = (a: Book, b: Book) =>
  b.publishYear.localeCompare(a.publishYear);

//
// Orders
//

const ordersTable = () => getTable("apptZroU7Vo0zMDjT", "tbllODnsl8U1U8X7N");

export type Order = decodeType<typeof decodeOrder>;
export const decodeOrder = record({
  id: field("ID", number),
  orderedItemId: field("Objednaný titul", relationToZeroOrOne),
  itemCount: field("Počet kusů", number),
  deliveryName: field("Jméno", string),
  deliveryAddress: field("Doručovací adresa", optional(string)),
  deliveryEmail: field("Kontaktní mail", string),
  deliveryPhone: field("Kontaktní telefon", string),
  deliveryType: field(
    "Způsob doručení",
    union("osobně", "poštou", "knihkupectví"),
  ),
  status: field("Stav objednávky", union("nová", "vyřízená", "stornovaná")),
  invoiceUrl: field("Faktura", string),
});

export const createOrder = async (order: Omit<Order, "id" | "status">) =>
  ordersTable()
    .create({
      "Objednaný titul": [order.orderedItemId!],
      "Počet kusů": order.itemCount,
      Jméno: order.deliveryName,
      "Doručovací adresa": order.deliveryAddress,
      "Kontaktní mail": order.deliveryEmail,
      "Kontaktní telefon": order.deliveryPhone,
      "Způsob doručení": order.deliveryType,
      Faktura: order.invoiceUrl,
      "Stav objednávky": "nová",
    })
    .then(unwrapRecord)
    .then(decodeOrder);
