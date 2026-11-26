import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { sortByYear } from "../data/books.ts";
import { buildInvoiceLines, incomingOrderSchema } from "../data/orders.ts";
import type { Env } from "../env.ts";

export const routes = new Hono<Env>()
  //
  // Store index
  //
  .get("/", async (c) => {
    const allBooks = await c.env.fetchAllBooks();
    const formatted = JSON.stringify(allBooks.sort(sortByYear), null, 2);
    c.header(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=86400",
    );
    return c.text(formatted, 200, { "Content-type": "application/json" });
  })

  //
  // Placing orders
  //
  .post("/orders", zValidator("json", incomingOrderSchema), async (c) => {
    const order = c.req.valid("json");
    const reportError = async (msg: string) =>
      c.env.sendSlackMessage("C07T03A0XEV", msg);

    // Delivery type "post" needs an address
    if (order.deliveryType === "poštou" && !order.deliveryAddress) {
      return c.text("Missing address on an order delivered by post", 400);
    }

    // Fetch book to get price
    const book = await c.env
      .fetchBookById(order.orderedItemId)
      .catch(() => null);
    if (!book?.price) {
      await reportError(
        `Někdo se právě pokusil objednat knihu '${order.orderedItemId}', která neexistuje nebo nemá cenu.`,
      );
      return c.text("Ordered book not found or missing required info", 404);
    }

    // Reject order if book is not in sale
    if (book.state !== "v prodeji") {
      await reportError(
        `Někdo se právě pokusil objednat knihu '${order.orderedItemId}', která není v prodeji.`,
      );
      return c.text("Ordered book is not in sale", 400);
    }

    // Create invoicing subject
    const invoicingSubjectId = await c.env
      .createInvoicingSubject({
        name: order.deliveryName,
        email: order.deliveryEmail,
        phone: order.deliveryPhone,
      })
      .catch(() => null);

    if (!invoicingSubjectId) {
      await reportError(
        `Někdo si právě objednával v našem e-shopu (${order.deliveryEmail}), ale nepodařilo se nám založit kontakt ve Fakturoidu.`,
      );
      return c.text("Failed to create new invoicing subject", 500);
    }

    // Create invoice
    const invoiceUrl = await c.env
      .createInvoice({
        lines: buildInvoiceLines(book, order),
        subject_id: invoicingSubjectId,
        tags: ["knihy"],
      })
      .catch(() => null);

    if (!invoiceUrl) {
      await reportError(
        `Někdo si právě objednával v našem e-shopu (${order.deliveryEmail}), ale nepodařilo se nám založit fakturu ve Fakturoidu.`,
      );
      return c.text("Failed to create new invoice", 500);
    }

    // Save new order to the database
    const savedOrder = await c.env
      .saveNewOrder({ ...order, status: "nová", invoiceUrl })
      .catch(() => null);

    if (!savedOrder) {
      await reportError(
        `Někdo si právě objednával v našem e-shopu (${order.deliveryEmail}), ale nepodařilo se nám uložit objednávku do Airtable.`,
      );
      return c.text("Failed to save new order to the database", 500);
    }

    return c.json(
      { createdOrderId: savedOrder.id, publicInvoiceUrl: invoiceUrl },
      201,
    );
  });
