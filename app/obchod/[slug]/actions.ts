"use server";

import { createOrder, getBookById } from "src/data-source/books";
import {
  createInvoice,
  createSubject,
  getBearerTokenFromEnv,
} from "src/fakturoid";
import { record, string, union } from "typescript-json-decoder";

const decodeOrder = record({
  orderedItemId: string,
  deliveryType: union("osobně", "poštou"),
  deliveryName: string,
  deliveryAddress: string,
  deliveryEmail: string,
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
    });
    if (!subjectId) {
      throw new Error("Nepodařilo se nám založit kontakt ve Fakturoidu.");
    }

    //
    // Create invoice
    //
    const invoiceUrl = await createInvoice(token, {
      subject_id: subjectId,
      tags: ["knihy"],
      lines: [
        {
          name: `Kniha ${book.title}`,
          quantity: "1",
          unit_name: "ks",
          unit_price: String(book.price),
        },
      ],
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
