import assert from "node:assert";
import test from "node:test";
import { decodeWebhook } from "./fakturoid";

test("Decode webhook", () => {
  const payload = {
    webhook_id: 5,
    event_name: "invoice_paid",
    created_at: "2024-06-13T14:06:20.924+02:00",
    body: {
      invoice: {
        id: 93,
        custom_id: null,
        document_type: "invoice",
        lines: [
          {
            id: 209,
            name: "Magic mouse",
            quantity: "5.0",
            unit_name: "myš",
            unit_price: "2000.0",
            vat_rate: 21,
            unit_price_without_vat: "2000.0",
            unit_price_with_vat: "2420.0",
            total_price_without_vat: "10000.0",
            total_vat: "2100.0",
            native_total_price_without_vat: "10000.0",
            native_total_vat: "2100.0",
            inventory: null,
          },
        ],
        vat_rates_summary: [
          {
            vat_rate: 21,
            base: "10000.0",
            vat: "2100.0",
            currency: "CZK",
            native_base: "10000.0",
            native_vat: "2100.0",
            native_currency: "CZK",
          },
        ],
        paid_advances: [],
        payments: [
          {
            id: 785,
            paid_on: "2024-06-13",
            currency: "CZK",
            amount: "12100.0",
            native_amount: "12100.0",
            variable_symbol: "20240056",
            bank_account_id: 21,
            tax_document_id: null,
            created_at: "2024-06-13T14:06:20.743+02:00",
            updated_at: "2024-06-13T14:06:20.769+02:00",
          },
        ],
        attachments: [],
        html_url: "https://app.fakturoid.cz/applecorp/invoices/93",
        public_html_url:
          "https://app.fakturoid.cz/applecorp/p/nENr3UCI6g/2024-0056",
        url: "https://app.fakturoid.cz/api/v3/accounts/applecorp/invoices/93.json",
        pdf_url:
          "https://app.fakturoid.cz/api/v3/accounts/applecorp/invoices/93/download.pdf",
        subject_url:
          "https://app.fakturoid.cz/api/v3/accounts/applecorp/subjects/37.json",
        created_at: "2024-06-13T10:33:33.031+02:00",
        updated_at: "2024-06-13T14:06:20.800+02:00",
      },
      payment: {
        id: 785,
        paid_on: "2024-06-13",
        currency: "CZK",
        amount: "12100.0",
        native_amount: "12100.0",
        variable_symbol: "20240056",
        bank_account_id: 21,
        tax_document_id: null,
        created_at: "2024-06-13T14:06:20.743+02:00",
        updated_at: "2024-06-13T14:06:20.743+02:00",
      },
    },
  };
  const hook = decodeWebhook(payload);
  assert.deepEqual(hook, {
    webhook_id: 5,
    event_name: "invoice_paid",
    body: {
      invoice: {
        id: 93,
        pdf_url:
          "https://app.fakturoid.cz/api/v3/accounts/applecorp/invoices/93/download.pdf",
        lines: [{ name: "Magic mouse" }],
      },
      payment: {
        amount: "12100.0",
      },
    },
  });
});
