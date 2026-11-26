import type { Hono } from "hono";
import type { Env, SideEffects } from "./env.ts";

// biome-ignore lint/suspicious/noExplicitAny: Type magic, walk away
type RoutePaths<T> = T extends Hono<any, infer S, any> ? keyof S : never;

export class HonoTester<Router extends Hono<Env>> {
  constructor(private routes: Router) {}

  postJson({
    route,
    body,
    env = {},
  }: {
    route: RoutePaths<Router>;
    body: unknown;
    env?: Partial<SideEffects>;
  }) {
    return this.routes.request(
      route as string,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      env,
    );
  }
}
