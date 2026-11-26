import assert from "node:assert";
import test from "node:test";
import type { Book } from "./books.ts";
import { buildInvoiceLines, type IncomingOrder } from "./orders.ts";

test("Build invoice from order", () => {
  const invoice = buildInvoiceLines(sampleBook, sampleOrder);
  assert.deepStrictEqual(invoice, [
    {
      name: "Kniha Příběhy z ghetta",
      quantity: "2",
      unit_name: "ks",
      unit_price: "350",
    },
    {
      name: "Poštovné a balné",
      quantity: "1",
      unit_name: "ks",
      unit_price: "100",
    },
  ]);
});

test("Skip postage on non-delivery orders", () => {
  const invoice = buildInvoiceLines(sampleBook, {
    ...sampleOrder,
    deliveryType: "osobně",
  });
  assert.deepStrictEqual(invoice, [
    {
      name: "Kniha Příběhy z ghetta",
      quantity: "2",
      unit_name: "ks",
      unit_price: "350",
    },
  ]);
});

const sampleBook: Book = {
  id: 5,
  databaseId: "recIU4aHsdQvPMjnj",
  title: "Příběhy z ghetta",
  slug: "pribehy",
  subtitle: "Vyprávění o osudech obyvatel boskovické židovské čtvrti",
  description:
    "V boskovické židovské čtvrti, nebo také v Židech, jak se u nás říká…",
  photoPortrait: "https://i.ohlasy.info/i/5c5ff534.jpeg",
  photoLandscape: "https://i.ohlasy.info/i/c6761df9.jpeg",
  publishYear: "2024",
  authors: "Helena Janíková",
  price: 350,
  state: "v prodeji",
};

const sampleOrder: IncomingOrder = {
  orderedItemId: sampleBook.databaseId,
  itemCount: 2,
  deliveryType: "poštou",
  deliveryAddress: "Dohnálkova 123, 68001 Boskovice",
  deliveryName: "Jan Novák",
  deliveryEmail: "jan.novak@example.cz",
  deliveryPhone: "+420 124 456 789",
};
