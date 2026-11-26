// TBD: The auth code here is very crude, can we cache the bearer token?

//
// Subjects
//

import z from "zod";

export type NewInvoicingSubject = {
  name: string;
  email: string;
  phone: string;
};

export async function createInvoicingSubject(
  subject: NewInvoicingSubject,
): Promise<number> {
  const bearerToken = await getBearerTokenFromEnv();
  const response = await fetch(
    "https://app.fakturoid.cz/api/v3/accounts/ohlasyzs/subjects.json",
    {
      method: "POST",
      body: JSON.stringify(subject, null, 2),
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to create new invoicing subject in Fakturoid: ${response.status} ${response.statusText}`,
    );
  }

  const responseSchema = z.object({ id: z.number() });
  return await response
    .json()
    .then(responseSchema.parse)
    .then((r) => r.id);
}

//
// Invoices
//

export type InvoiceLine = {
  name: string;
  quantity: string;
  unit_name: string;
  unit_price: string;
};

export type NewInvoice = {
  subject_id: number;
  lines: InvoiceLine[];
  tags?: string[];
};

export async function createInvoice(invoiceData: NewInvoice): Promise<string> {
  const bearerToken = await getBearerTokenFromEnv();

  const response = await fetch(
    "https://app.fakturoid.cz/api/v3/accounts/ohlasyzs/invoices.json",
    {
      method: "POST",
      body: JSON.stringify(invoiceData),
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to create Fakturoid invoice.");
  }

  const invoiceUrl = response.headers.get("Location");
  if (!invoiceUrl) {
    throw new Error("Created invoice is missing the Location header.");
  }

  const invoiceSchema = z.object({
    public_html_url: z.string(),
  });

  const publicUrl = await fetch(invoiceUrl, {
    headers: { Authorization: `Bearer ${bearerToken}` },
  })
    .then((response) => response.json())
    .then(invoiceSchema.parse)
    .then((invoice) => invoice.public_html_url);

  return publicUrl;
}

//
// Support
//

async function getBearerToken(clientId: string, clientSecret: string) {
  const base64 = (s: string) => Buffer.from(s).toString("base64");
  const clientData = base64([clientId, clientSecret].join(":"));
  const payload = { grant_type: "client_credentials" };

  const response = await fetch("https://app.fakturoid.cz/api/v3/oauth/token", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Basic ${clientData}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get Fakturoid bearer token: ${response.status} ${response.statusText}`,
    );
  }

  const responseSchema = z.object({
    token_type: z.literal("Bearer"),
    access_token: z.string(),
  });

  return await response
    .json()
    .then(responseSchema.parse)
    .then((response) => response.access_token);
}

async function getBearerTokenFromEnv() {
  const clientId = process.env.FAKTUROID_CLIENT_ID ?? "";
  const clientSecret = process.env.FAKTUROID_CLIENT_SECRET ?? "";
  return await getBearerToken(clientId, clientSecret);
}
