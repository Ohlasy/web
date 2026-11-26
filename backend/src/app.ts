import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./env.ts";
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

// Merge routes. This has to be done in the chaining fashion
// in order to build the app route schema correctly into `routes`.
const routes = app
	.get("/", (c) => c.text("Hello!\n"))
	.route("/newsletter", newsletterRoutes)
	.route("/slackbot", slackRoutes)
	.route("/store", storeRoutes);

// This can be imported from the client for type-safe backend calls
export type RoutingSchema = typeof routes;

export default app;
