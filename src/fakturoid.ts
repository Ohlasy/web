import { literal, number, record, string } from "typescript-json-decoder";

//
// Authentication
//

export async function getBearerToken(clientId: string, clientSecret: string) {
  const base64 = (s: string) => Buffer.from(s).toString("base64");
  const clientData = base64([clientId, clientSecret].join(":"));
  const payload = { grant_type: "client_credentials" };

  const response = await fetch("https://app.fakturoid.cz/api/v3/oauth/token", {
    method: "POST",
    body: JSON.stringify(payload, null, 2),
    headers: {
      "Authorization": `Basic ${clientData}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    console.error(response.statusText);
    return null;
  }

  const decodeResponse = record({
    access_token: string,
    token_type: literal("Bearer"),
  });

  try {
    const wrapper = decodeResponse(await response.json());
    return wrapper.access_token;
  } catch (e) {
    console.error(e);
    return null;
  }
}

export async function getBearerTokenFromEnv() {
  const clientId = process.env.FAKTUROID_CLIENT_ID;
  const clientSecret = process.env.FAKTUROID_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error("Fakturoid client secrets not found in env.");
    return null;
  }
  return await getBearerToken(clientId, clientSecret);
}

//
// Subjects
//

/** https://www.fakturoid.cz/api/v3/subjects */
type Subject = {
  name: string;
  email?: string;
  phone?: string;
};

export async function createSubject(
  token: string,
  subject: Subject
): Promise<number | null> {
  const response = await fetch(
    "https://app.fakturoid.cz/api/v3/accounts/ohlasyzs/subjects.json",
    {
      method: "POST",
      body: JSON.stringify(subject, null, 2),
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  const decodeResponse = record({ id: number });
  try {
    const wrapper = decodeResponse(await response.json());
    return wrapper.id;
  } catch (e) {
    console.error(e);
    return null;
  }
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

export type Invoice = {
  subject_id: number;
  lines: ReadonlyArray<InvoiceLine>;
  tags?: ReadonlyArray<string>;
};

export async function createInvoice(token: string, invoiceData: Invoice) {
  const response = await fetch(
    "https://app.fakturoid.cz/api/v3/accounts/ohlasyzs/invoices.json",
    {
      method: "POST",
      body: JSON.stringify(invoiceData),
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    }
  );
  if (!response.ok) {
    console.error("Failed to create Fakturoid invoice.");
    return null;
  }

  const invoiceUrl = response.headers.get("Location");
  if (!invoiceUrl) {
    console.error("Created invoice is missing the Location field.");
    return null;
  }

  const decodeInvoice = record({
    public_html_url: string,
  });

  const publicUrl = await fetch(invoiceUrl, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then(decodeInvoice)
    .then((invoice) => invoice.public_html_url);

  return publicUrl;
}
