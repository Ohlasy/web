import { NextRequest } from "next/server";
import { record, string } from "typescript-json-decoder";
import { WebClient } from "@slack/web-api";

export async function POST(request: NextRequest): Promise<Response> {
  const decodeBody = record({
    email: string,
  });
  const body = await request
    .json()
    .then(decodeBody)
    .catch((e) => null);
  if (!body) {
    return new Response("Error decoding body, see the source please.", {
      status: 400,
    });
  }

  const token = process.env.SLACK_BOT_KEY;
  if (!token) {
    return new Response("Slack token missing", { status: 500 });
  }

  const slackClient = new WebClient(token);
  const response = await slackClient.chat
    .postMessage({
      channel: "CNV9CHDUH",
      text: `Máme nového zájemce nebo zájemkyni o odběr newsletteru 🎉 Adresa je ${body.email}, zadejte ji někdo prosím <https://newsletter.ohlasy.info/publish/subscribers|do Substacku> a označte tohle vlákno za vyřešené. Díky! 👋`,
    })
    .catch((e) => null);
  return response?.ok
    ? new Response("OK", { status: 200 })
    : new Response("Slack error, sorry.", { status: 500 });
}
