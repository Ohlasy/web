import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";
import type { Env } from "../env.ts";

export function looksLikeBotEmail(email: string) {
  return (
    // user7237465@gmail.com
    !!email.match(/user\d+@gmail\.com/) ||
    // iwan.u.jac.iy.a.8.2.8@gmail.com
    !!email.match(/(\w+\.){4,}\w+@gmail\.com/)
  );
}

export const routes = new Hono<Env>().post(
  "/subscribe",
  zValidator("json", z.object({ email: z.email() })),
  async (c) => {
    const { email } = c.req.valid("json");

    // Reject bot-like emails
    if (looksLikeBotEmail(email)) {
      console.log(
        `Received subscription request for bot-like email '${email}', rejecting.`,
      );
      return c.text("Bots not welcome here", 400);
    }

    try {
      await c.env.sendSlackMessage(
        "CNV9CHDUH",
        `Máme nového zájemce nebo zájemkyni o odběr newsletteru 🎉 Adresa je ${email}, zadejte ji někdo prosím <https://newsletter.ohlasy.info/publish/subscribers|do Substacku> a označte tohle vlákno za vyřešené. Díky! 👋`,
      );
      console.log("Successfully posted to Slack about new subscriber.");
      return c.text("Vitaj!", 200);
    } catch (e) {
      console.error("Failed to post to Slack about new subscriber: ", e);
      return c.text("Slack error, sorry!", 500);
    }
  },
);
