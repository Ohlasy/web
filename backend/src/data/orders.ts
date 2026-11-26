/** biome-ignore-all lint/complexity/useLiteralKeys: We prefer the keys to be consistent */
import z from "zod";
import { createRecord } from "./airtable.ts";
import type { Book } from "./books.ts";
import type { InvoiceLine } from "./fakturoid.ts";

/** Incoming order as sent by client */
export type IncomingOrder = z.infer<typeof incomingOrderSchema>;
export const incomingOrderSchema = z.object({
  orderedItemId: z.string(),
  itemCount: z.number().int().positive().max(10),
  deliveryType: z.enum(["osobně", "poštou", "knihkupectví"]),
  deliveryName: z.string(),
  deliveryAddress: z.string().optional(),
  deliveryEmail: z.email(),
  deliveryPhone: z.string(),
});

/** Order being saved to the DB or read from it */
export type SavedOrder = z.infer<typeof savedOrderSchema>;
export const savedOrderSchema = incomingOrderSchema.extend({
  id: z.number(),
  invoiceUrl: z.string(),
  status: z.enum(["nová", "vyřízená", "stornovaná"]),
});

/** Order fields as stored in the DB */
type SavedOrderDBFields = z.infer<typeof savedOrderDBFields>;
const savedOrderDBFields = z.object({
  ID: z.number(),
  Faktura: z.string(),
  "Stav objednávky": z.enum(["nová", "vyřízená", "stornovaná"]),
  "Objednaný titul": z.array(z.string()).nonempty(),
  "Počet kusů": z.number(),
  "Způsob doručení": z.enum(["osobně", "poštou", "knihkupectví"]),
  Jméno: z.string(),
  "Doručovací adresa": z.string().optional(),
  "Kontaktní mail": z.string(),
  "Kontaktní telefon": z.string(),
});

/** Encode order to DB fields */
const encodeOrder = (
  order: Omit<SavedOrder, "id">,
): Omit<SavedOrderDBFields, "ID"> => ({
  Faktura: order.invoiceUrl,
  "Stav objednávky": order.status,
  "Objednaný titul": [order.orderedItemId],
  "Počet kusů": order.itemCount,
  "Způsob doručení": order.deliveryType,
  Jméno: order.deliveryName,
  "Doručovací adresa": order.deliveryAddress,
  "Kontaktní mail": order.deliveryEmail,
  "Kontaktní telefon": order.deliveryPhone,
});

/** Decode order from DB fields */
const decodeOrder = (fields: SavedOrderDBFields): SavedOrder => ({
  id: fields["ID"],
  invoiceUrl: fields["Faktura"],
  status: fields["Stav objednávky"],
  orderedItemId: fields["Objednaný titul"][0],
  itemCount: fields["Počet kusů"],
  deliveryType: fields["Způsob doručení"],
  deliveryName: fields["Jméno"],
  deliveryAddress: fields["Doručovací adresa"],
  deliveryEmail: fields["Kontaktní mail"],
  deliveryPhone: fields["Kontaktní telefon"],
});

export const saveNewOrder = (order: Omit<SavedOrder, "id">) =>
  createRecord({
    appId: "apptZroU7Vo0zMDjT",
    tableId: "tbllODnsl8U1U8X7N",
    decoder: (fields) => decodeOrder(savedOrderDBFields.parse(fields)),
    fields: encodeOrder(order),
  });

export const buildInvoiceLines = (
  book: Pick<Book, "title" | "price">,
  order: Pick<IncomingOrder, "deliveryType" | "itemCount">,
): InvoiceLine[] => {
  const bookLine: InvoiceLine = {
    name: `Kniha ${book.title}`,
    quantity: order.itemCount.toString(),
    unit_name: "ks",
    unit_price: String(book.price),
  };
  const postLine: InvoiceLine = {
    name: "Poštovné a balné",
    quantity: "1",
    unit_name: "ks",
    unit_price: "100",
  };
  return order.deliveryType === "poštou" ? [bookLine, postLine] : [bookLine];
};
