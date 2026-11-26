import { createHash } from "node:crypto";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { imageSize } from "image-size";
import { z } from "zod";
import type { Env, SideEffects } from "../env.ts";

//
// Decoding
//

/** Decoder for the initial URL verification handshake. */
export const slackHandshake = z.object({
  type: z.literal("url_verification"),
  token: z.string(),
  challenge: z.string(),
});

/** Generic decoder for a Slack event callback, parameterized by the event decoder. */
export const slackEvent = <T extends z.ZodType>(event: T) =>
  z.object({
    type: z.literal("event_callback"),
    token: z.string(),
    team_id: z.string(),
    api_app_id: z.string(),
    event,
    event_id: z.string(),
    event_time: z.number(),
  });

/** A file attached to a Slack message. */
export const slackFile = z.object({
  id: z.string(),
  name: z.string().optional(),
  mimetype: z.string().optional(),
  url_private: z.string().optional(),
  url_private_download: z.string().optional(),
});

/** A `message` event, as delivered for DMs (`channel_type: "im"`). */
export const slackMessage = z.object({
  type: z.literal("message"),
  // Present on subtypes like `message_changed`; we ignore those.
  subtype: z.string().optional(),
  channel_type: z.string(),
  channel: z.string(),
  user: z.string().optional(),
  bot_id: z.string().optional(),
  ts: z.string(),
  text: z.string().optional(),
  files: z.array(slackFile).optional(),
});

//
// Endpoints
//

export type SlackMessage = z.infer<typeof slackMessage>;

/** Either the initial handshake or an event callback carrying a message. */
export const slackRequest = z.discriminatedUnion("type", [
  slackHandshake,
  slackEvent(slackMessage),
]);

/** Is this a genuine image DM from a real user (not the bot, not an edit)? */
const isImageMessage = (event: SlackMessage) =>
  event.channel_type === "im" &&
  event.subtype === "file_share" &&
  !event.bot_id &&
  !!event.user &&
  !!event.files?.some((f) => f.mimetype?.startsWith("image/"));

// TBD: Ignore multiple deliveries
export const routes = new Hono<Env>().post(
  "/events",
  zValidator("json", slackRequest),
  async (c) => {
    const payload = c.req.valid("json");

    // Check verification token
    if (!(await c.env.validateSlackToken(payload.token))) {
      console.warn("Received Slack request with invalid verification token.");
      return c.text("Slack verification token does not match.", 401);
    }

    // Initial URL verification handshake
    if (payload.type === "url_verification") {
      console.log("Received correct Slack handshake request.");
      return c.text(payload.challenge, 200);
    }

    // Event callback. Only react to image DMs from real users.
    const { event } = payload;
    const replyToUser = (msg: string) =>
      c.env.sendSlackMessage(event.channel, msg);

    if (isImageMessage(event)) {
      console.log(`Received image DM from ${event.user}, will upload.`);
      const images =
        event.files?.filter((f) => f.mimetype?.startsWith("image/")) ?? [];

      for (const image of images) {
        const privateUrl = image.url_private_download ?? image.url_private;

        if (!privateUrl || !image.mimetype) {
          console.warn(
            `Image ${image.id} is missing source URL or content type, skipping.`,
          );
          continue;
        }

        const result = await uploadSlackImage(
          privateUrl,
          image.mimetype,
          c.env,
        ).catch((e) => {
          console.error("Error uploading Slack image: ", e);
          return null;
        });

        if (result) {
          const { publicUrl, width, height } = result;
          await replyToUser(`Hotovo! Veřejná adresa obrázku: ${publicUrl}`);
          await replyToUser(
            `Kód pro redakční systém:\n\`\`\`\n{% photo src="${publicUrl}" caption="XXX" author="XXX" width=${width} height=${height} /%}\n\`\`\``,
          );
        } else {
          await replyToUser("Obrázek se nepodařilo nahrát :(");
        }
      }
    } else {
      console.log("Received non-image DM, ignoring:");
      console.log(await c.req.text());
    }

    return c.text("Thank you!", 200);
  },
);

async function uploadSlackImage(
  privateUrl: string,
  contentType: string,
  env: SideEffects,
) {
  // Download file and compute its digest
  const fileBody = await env.downloadSlackAttachment(privateUrl);
  const digest = createHash("sha256")
    .update(fileBody)
    .digest("hex")
    .slice(0, 8);

  // Name file after contents
  const extension = contentType.split("/")[1] ?? "bin";
  const fileName = `${digest}.${extension}`;
  const publicUrl = `https://i.ohlasy.info/i/${fileName}`;

  // Upload to S3
  await env.uploadFileToS3({
    bucket: "ohlasy-images",
    body: fileBody,
    key: `i/${fileName}`,
    contentType: contentType,
    acl: "public-read",
  });

  // Get image size
  const { width, height } = imageSize(fileBody);

  return { publicUrl, width, height };
}
