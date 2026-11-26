import assert from "node:assert";
import test from "node:test";
import { z } from "zod";
import { HonoTester } from "../testing.ts";
import { routes, slackEvent, slackHandshake } from "./slackbot.ts";

// A 2X3 PNG image
const sampleImageData = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAIAAAADCAIAAAA2iEnWAAAAG0lEQVR4nAXBAQEAAACCICc6ySlNDYAkMA2W6zDlBdHNtPk/AAAAAElFTkSuQmCC",
  "base64",
);

test("URL verification handshake", () => {
  const payload = {
    token: "Jhj5dZrVaK7ZwHHjRyZWjbDl",
    challenge: "3eZbrw1aBm2rZgRNFdxV2595E9CY3gmdALWMmHkvFXO7tYXAYM8P",
    type: "url_verification",
  };

  const result = slackHandshake.parse(payload);
  assert.deepStrictEqual(result, payload);
});

test("Event callback", () => {
  const payload = {
    token: "ZZZZZZWSxiZZZ2yIvs3peJ",
    team_id: "T123ABC456",
    api_app_id: "A123ABC456",
    event: {},
    type: "event_callback",
    event_id: "Ev123ABC456",
    event_time: 1515449522000016,
    authed_users: ["U0LAN0Z89"],
  };

  const result = slackEvent(z.object({})).parse(payload);

  assert.strictEqual(result.type, "event_callback");
  assert.strictEqual(result.token, "ZZZZZZWSxiZZZ2yIvs3peJ");
  assert.strictEqual(result.team_id, "T123ABC456");
  assert.strictEqual(result.api_app_id, "A123ABC456");
  assert.strictEqual(result.event_id, "Ev123ABC456");
  assert.strictEqual(result.event_time, 1515449522000016);
});

const tester = new HonoTester(routes);

test("Reject malformed handshake", async () => {
  const res = await tester.postJson({
    route: "/events",
    body: { type: "url_verification" },
  });
  assert.strictEqual(res.status, 400);
});

test("Reject handshake unless verification token matches", async () => {
  const res = await tester.postJson({
    route: "/events",
    body: {
      token: "foo",
      challenge: "bar",
      type: "url_verification",
    },
    env: {
      async validateSlackToken(token) {
        assert.strictEqual(token, "foo");
        return false;
      },
    },
  });
  assert.strictEqual(res.status, 401);
});

test("Accept correct handshake", async () => {
  const res = await tester.postJson({
    route: "/events",
    body: {
      token: "foo",
      challenge: "bar",
      type: "url_verification",
    },
    env: {
      validateSlackToken: async () => true,
    },
  });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(await res.text(), "bar");
});

test("Acknowledge an image DM", async () => {
  const mockFileUrl = "https://i.ohlasy.info/i/a5c62deb.png";
  const validReplies = [
    `Hotovo! Veřejná adresa obrázku: https://i.ohlasy.info/i/52f01e4a.png`,
    'Kód pro redakční systém:\n```\n{% photo src="https://i.ohlasy.info/i/52f01e4a.png" caption="XXX" author="XXX" width=2 height=3 /%}\n```',
  ];
  const res = await tester.postJson({
    route: "/events",
    body: {
      token: "foo",
      type: "event_callback",
      team_id: "T1",
      api_app_id: "A1",
      event_id: "Ev1",
      event_time: 1,
      event: {
        type: "message",
        subtype: "file_share",
        channel_type: "im",
        channel: "D123",
        user: "U123",
        ts: "1.0",
        files: [
          {
            url_private: mockFileUrl,
            mimetype: "image/png",
            id: "F1",
          },
        ],
      },
    },
    env: {
      validateSlackToken: async () => true,
      async downloadSlackAttachment(privateUrl) {
        assert.strictEqual(privateUrl, mockFileUrl);
        return sampleImageData;
      },
      async uploadFileToS3(props) {
        assert.deepStrictEqual(props, {
          bucket: "ohlasy-images",
          body: sampleImageData,
          key: `i/52f01e4a.png`,
          contentType: "image/png",
          acl: "public-read",
        });
      },
      async sendSlackMessage(channel, msg) {
        assert.strictEqual(channel, "D123");
        assert.strictEqual(msg, validReplies.shift());
      },
    },
  });

  assert.strictEqual(res.status, 200);
});

test("Correctly report failing upload", async () => {
  const mockFileUrl = "https://i.ohlasy.info/i/a5c62deb.png";
  const res = await tester.postJson({
    route: "/events",
    body: {
      token: "foo",
      type: "event_callback",
      team_id: "T1",
      api_app_id: "A1",
      event_id: "Ev1",
      event_time: 1,
      event: {
        type: "message",
        subtype: "file_share",
        channel_type: "im",
        channel: "D123",
        user: "U123",
        ts: "1.0",
        files: [
          {
            url_private: mockFileUrl,
            mimetype: "image/png",
            id: "F1",
          },
        ],
      },
    },
    env: {
      validateSlackToken: async () => true,
      async downloadSlackAttachment(privateUrl) {
        assert.strictEqual(privateUrl, mockFileUrl);
        return sampleImageData;
      },
      async uploadFileToS3() {
        throw new Error("Sample error");
      },
      async sendSlackMessage(channel, msg) {
        assert.strictEqual(channel, "D123");
        assert.strictEqual(msg, "Obrázek se nepodařilo nahrát :(");
      },
    },
  });

  assert.strictEqual(res.status, 200);
});
