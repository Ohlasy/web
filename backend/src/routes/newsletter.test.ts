import assert from "node:assert";
import test from "node:test";
import { HonoTester } from "../testing.ts";
import { looksLikeBotEmail, routes } from "./newsletter.ts";

test("Detect bot-like e-mails", () => {
  assert.equal(looksLikeBotEmail("user1234@gmail.com"), true);
  assert.equal(looksLikeBotEmail("iwan.u.jac.iy.a.8.2.8@gmail.com"), true);
  assert.equal(looksLikeBotEmail("uce.l.ih.efak.e367@gmail.com"), true);
  assert.equal(looksLikeBotEmail("other@gmail.com"), false);
  assert.equal(looksLikeBotEmail("joe1@gmail.com"), false);
  assert.equal(looksLikeBotEmail("joe.1@gmail.com"), false);
  assert.equal(looksLikeBotEmail("nice.joe.1@gmail.com"), false);
});

const tester = new HonoTester(routes);

test("Reject non-email payload", async () => {
  const res = await tester.postJson({
    route: "/subscribe",
    body: { email: "foo" },
  });
  assert.strictEqual(res.status, 400);
});

test("Reject bot-like newsletter subscription", async () => {
  const res = await tester.postJson({
    route: "/subscribe",
    body: {
      email: "iwan.u.jac.iy.a.8.2.8@gmail.com",
    },
  });
  assert.strictEqual(res.status, 400);
});

test("Accept valid subscriber", async () => {
  const res = await tester.postJson({
    route: "/subscribe",
    body: { email: "nice_guy@gmail.com" },
    env: {
      async sendSlackMessage(channel, msg) {
        assert.strictEqual(channel, "CNV9CHDUH");
        assert.ok(msg.startsWith("Máme nového"));
      },
    },
  });
  assert.strictEqual(res.status, 200);
});
