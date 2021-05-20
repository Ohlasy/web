import { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";
import {
  CheckboxPropertyValue,
  Page,
  RichTextPropertyValue,
  TitlePropertyValue,
  URLPropertyValue,
} from "@notionhq/client/build/src/api-types";

interface BannerPage extends Page {
  properties: {
    "Název": TitlePropertyValue;
    "Odkaz": URLPropertyValue;
    "Zveřejnit": CheckboxPropertyValue;
    "Obrázek": URLPropertyValue;
    "Náhradní text": RichTextPropertyValue;
  };
}

interface Banner {
  name: string;
  image: string;
  alt: string;
  url: string;
}

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = "50c3e92b4f7d44ee9cc5a139d81b07b5";

  const dbResponse = await notion.databases.query({ database_id: databaseId });
  const results = dbResponse.results.map((p) => {
    const props = (p as BannerPage).properties;
    return {
      name: props["Název"].title[0]?.plain_text,
      image: props["Obrázek"].url,
      alt: props["Náhradní text"].rich_text[0]?.plain_text,
      url: props["Odkaz"].url,
    };
  });

  // https://vercel.com/docs/serverless-functions/edge-caching, does this work as expected?
  const out = JSON.stringify(results, null, 2);
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=30, stale-while-revalidate"
  );
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(out);
};
