import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { type Env, liveSideEffects } from "./env.ts";
import { routes as newsletterRoutes } from "./routes/newsletter.ts";
import { routes as slackRoutes } from "./routes/slackbot.ts";
import { routes as storeRoutes } from "./routes/store.ts";

export const app = new Hono<Env>();

// Allow browser calls from the production website
app.use(
  "*",
  cors({
    origin: ["https://ohlasy.info", "https://www.ohlasy.info"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

// Sample route to show things are working
app.get("/", (c) => c.text("Hello!\n"));

// Subroutes
app.route("/newsletter", newsletterRoutes);
app.route("/slackbot", slackRoutes);
app.route("/store", storeRoutes);

// Run
const port = Number(process.env.PORT) || 80;
console.log(`Server starting on port ${port}`);
serve({
  fetch: (req) => app.fetch(req, liveSideEffects),
  port,
});
