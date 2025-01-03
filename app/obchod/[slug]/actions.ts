"use server";

import { Book, createOrder, getBookById } from "src/data/books";
import {
  createInvoice,
  createSubject,
  getBearerTokenFromEnv,
  InvoiceLine,
} from "src/fakturoid";
import {
  decodeType,
  optional,
  record,
  string,
  union,
} from "typescript-json-decoder";

const numberFromString = (val: unknown) => parseInt(string(val));

type Order = decodeType<typeof decodeOrder>;
const decodeOrder = record({
  orderedItemId: string,
  itemCount: numberFromString,
  deliveryType: union("osobně", "poštou", "knihkupectví"),
  deliveryName: string,
  deliveryAddress: optional(string),
  deliveryEmail: string,
  deliveryPhone: string,
});

export type State =
  | { tag: "idle" }
  | { tag: "error"; message: string }
  | { tag: "sent"; orderId: string; invoiceUrl: string };

export async function placeOrder(
  currentState: State,
  formData: FormData
): Promise<State> {
  try {
    //
    // Decode order & load item details
    //
    const orderData = decodeOrder(Object.fromEntries(formData.entries()));
    const book = await getBookById(orderData.orderedItemId);
    if (!book || !book.price) {
      throw new Error(
        "Objednávaný titul jsme nenašli nebo k němu chybí informace."
      );
    }

    //
    // Create new invoice subject
    //
    const token = await getBearerTokenFromEnv();
    if (!token) {
      throw new Error("Chyba v napojení na Fakturoid.");
    }
    const subjectId = await createSubject(token, {
      name: orderData.deliveryName,
      email: orderData.deliveryEmail,
      phone: orderData.deliveryPhone,
    });
    if (!subjectId) {
      throw new Error("Nepodařilo se nám založit kontakt ve Fakturoidu.");
    }

    //
    // Create invoice
    //
    const invoiceUrl = await createInvoice(token, {
      lines: buildInvoiceLines(book, orderData),
      subject_id: subjectId,
      tags: ["knihy"],
    });
    if (!invoiceUrl) {
      throw "Nepodařilo se nám vytvořit fakturu.";
    }

    //
    // Save order to the DB
    //
    const createdOrder = await createOrder({ ...orderData, invoiceUrl });
    return {
      tag: "sent",
      orderId: String(createdOrder.id),
      invoiceUrl,
    };
  } catch (e) {
    console.error(e);
    return { tag: "error", message: `${e}` };
  }
}

const buildInvoiceLines = (book: Book, order: Order): InvoiceLine[] => {
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
