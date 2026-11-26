import { WebClient } from "@slack/web-api";

const apiToken = process.env.SLACK_BOT_KEY;
const requestAuthToken = process.env.SLACK_VERIFICATION_TOKEN;

const client = new WebClient(apiToken);

export const sendSlackMessage = async (channel: string, text: string) => {
  const response = await client.chat.postMessage({
    channel,
    text,
    unfurl_media: false,
  });
  if (!response.ok) {
    throw new Error(`Failed to send Slack message: ${response.error}`);
  }
};

export const validateSlackToken = async (token: string) =>
  !!token && token === requestAuthToken;

export const downloadSlackAttachment = async (privateUrl: string) => {
  const download = await fetch(privateUrl, {
    headers: { Authorization: `Bearer ${apiToken}` },
  });

  if (!download.ok) {
    throw new Error(
      `Failed to download Slack file: ${download.status} ${download.statusText}`,
    );
  }

  return new Uint8Array(await download.arrayBuffer());
};
