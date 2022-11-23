import { Client } from "@notionhq/client";
import { notEmpty } from "../utils";
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

export interface Banner {
  name: string;
  image: string;
  alt: string;
  url: string;
  priority: number;
}

export async function getAllBanners(
  apiKey: string = process.env.NOTION_API_KEY ?? ""
): Promise<Banner[]> {
  const notion = new Client({ auth: apiKey });
  const database = "50c3e92b4f7d44ee9cc5a139d81b07b5";
  const results = await notion.databases
    .query({ database_id: database })
    .then((response) => response.results);
  return results.map(bannerFromPage).filter(notEmpty).sort(compareByPriority);
}

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

function compareByPriority(a: Banner, b: Banner) {
  var ap = a.priority || 0;
  var bp = b.priority || 0;
  if (ap > bp) {
    return -1;
  } else if (bp > ap) {
    return +1;
  } else {
    return Math.random() > 0.5 ? -1 : 1;
  }
}
