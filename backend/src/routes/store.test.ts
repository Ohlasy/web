import assert from "node:assert";
import test from "node:test";
import type { Book } from "../data/books.ts";
import type { IncomingOrder } from "../data/orders.ts";
import { HonoTester } from "../testing.ts";
import { routes } from "./store.ts";

const tester = new HonoTester(routes);
const noop = async () => {};

test("Reject malformed order", async () => {
  const res = await tester.postJson({
    route: "/orders",
    body: {},
  });
  assert.strictEqual(res.status, 400);
});

test("Reject order of a non-existing book", async () => {
  const res = await tester.postJson({
    route: "/orders",
    body: sampleValidOrder,
    env: {
      fetchBookById: async () => undefined,
      sendSlackMessage: noop,
    },
  });
  assert.strictEqual(res.status, 404);
});

test("Reject order if delivery is post and address is missing", async () => {
  const res = await tester.postJson({
    route: "/orders",
    body: { ...sampleValidOrder, deliveryAddress: undefined },
  });
  assert.strictEqual(res.status, 400);
});

test("Reject order of a sold-out book", async () => {
  const res = await tester.postJson({
    route: "/orders",
    body: sampleValidOrder,
    env: {
      fetchBookById: async () => ({ ...sampleBook, state: "vyprodáno" }),
      sendSlackMessage: noop,
    },
  });
  assert.strictEqual(res.status, 400);
});

test("Reject order with invalid item count", async () => {
  const res = await tester.postJson({
    route: "/orders",
    body: { ...sampleValidOrder, itemCount: -5 },
    env: {
      fetchBookById: async () => sampleBook,
      sendSlackMessage: noop,
    },
  });
  assert.strictEqual(res.status, 400);
});

test("Reject order with invalid e-mail", async () => {
  const res = await tester.postJson({
    route: "/orders",
    body: { ...sampleValidOrder, deliveryEmail: "bagr" },
    env: {
      fetchBookById: async () => sampleBook,
      sendSlackMessage: noop,
    },
  });
  assert.strictEqual(res.status, 400);
});

test("Accept valid order", async () => {
  const res = await tester.postJson({
    route: "/orders",
    body: sampleValidOrder,
    env: {
      fetchBookById: async () => sampleBook,
      async createInvoicingSubject(subject) {
        assert.deepStrictEqual(subject, {
          name: sampleValidOrder.deliveryName,
          email: sampleValidOrder.deliveryEmail,
          phone: sampleValidOrder.deliveryPhone,
        });
        return 12;
      },
      async createInvoice(invoice) {
        // Invoice lines are already tested elsewhere, so keep it simple
        assert.strictEqual(invoice.subject_id, 12);
        return "invoice_url";
      },
      async saveNewOrder(order) {
        return { ...order, id: 456 };
      },
    },
  });
  assert.strictEqual(res.status, 201);
  assert.deepStrictEqual(await res.json(), {
    createdOrderId: 456,
    publicInvoiceUrl: "invoice_url",
  });
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

const sampleValidOrder: IncomingOrder = {
  orderedItemId: sampleBook.databaseId,
  itemCount: 2,
  deliveryType: "poštou",
  deliveryAddress: "Dohnálkova 123, 68001 Boskovice",
  deliveryName: "Jan Novák",
  deliveryEmail: "jan.novak@example.cz",
  deliveryPhone: "+420 124 456 789",
};
