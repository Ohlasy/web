import type { NextRequest } from "next/server";
import { decodeWebhook } from "src/fakturoid";

export async function POST(request: NextRequest): Promise<Response> {
  const auth = request.headers.get("Authorization");
  if (!auth || auth !== process.env.FAKTUROID_WEBHOOK_SECRET) {
    return new Response("Authorization invalid", { status: 403 });
  }
  try {
    const payload = decodeWebhook(await request.json());
    console.log(JSON.stringify(payload, null, 2));
    return new Response("Nice!", { status: 200 });
  } catch (e) {
    console.error("Failed to decode webhook payload: ", e);
    return new Response("Failed to decode webhook payload, sorry!", {
      status: 500,
    });
  }
}
