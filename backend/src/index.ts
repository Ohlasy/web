import { serve } from "@hono/node-server";
import app from "./app.ts";
import { liveSideEffects } from "./env.ts";

const port = Number(process.env.PORT) || 80;
console.log(`Server starting on port ${port}`);
serve({
  fetch: (req) => app.fetch(req, liveSideEffects),
  port,
});
