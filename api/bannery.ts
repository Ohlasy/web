import { VercelRequest, VercelResponse } from "@vercel/node";
import { Client } from "@notionhq/client";
import {
  CheckboxPropertyValue,
  NumberPropertyValue,
  Page,
  RichTextPropertyValue,
  TitlePropertyValue,
  URLPropertyValue,
} from "@notionhq/client/build/src/api-types";

interface BannerPage extends Page {
  properties: {
    "Název"?: TitlePropertyValue;
    "Odkaz"?: URLPropertyValue;
    "Zveřejnit"?: CheckboxPropertyValue;
    "Obrázek"?: URLPropertyValue;
    "Náhradní text"?: RichTextPropertyValue;
    "Priorita"?: NumberPropertyValue;
  };
}

interface Banner {
  name: string;
  image: string;
  alt: string;
  url: string;
  priority: number;
}

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  const databaseId = "50c3e92b4f7d44ee9cc5a139d81b07b5";

  const dbResponse = await notion.databases.query({ database_id: databaseId });
  const results = dbResponse.results
    .map(bannerFromPage)
    .filter((b) => b != null);

  const out = JSON.stringify(results, null, 2);
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=30, stale-while-revalidate"
  );
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(out);
};

function bannerFromPage(page: Page): Banner | null {
  const props = (page as BannerPage).properties;

  const publish = props["Zveřejnit"]?.checkbox;
  if (publish !== true) {
    return null;
  }

  const name = props["Název"]?.title[0]?.plain_text;
  const image = props["Obrázek"]?.url;
  const alt = props["Náhradní text"]?.rich_text[0]?.plain_text;
  const url = props["Odkaz"]?.url;
  const priority = props["Priorita"]?.number || 0;

  if (!(name && image && alt && url)) {
    return null;
  }

  return { name, image, alt, url, priority };
}
