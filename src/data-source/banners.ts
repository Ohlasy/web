import { Client } from "@notionhq/client";
import {
  array,
  boolean,
  field,
  literal,
  number,
  record,
  string,
} from "typescript-json-decoder";

export interface Banner {
  name: string;
  image: string;
  alt: string;
  url: string;
  priority: number;
}

const decodeUrlProperty = record({
  type: literal("url"),
  value: field("url", string),
});

const decodeCheckboxProperty = record({
  type: literal("checkbox"),
  value: field("checkbox", boolean),
});

const decodeNumberProperty = record({
  type: literal("number"),
  value: field("number", number),
});

const decodeRichTextProperty = record({
  type: literal("rich_text"),
  value: field(
    "rich_text",
    array(
      record({
        type: literal("text"),
        plainText: field("plain_text", string),
      })
    )
  ),
});

const decodeTitleProperty = record({
  type: literal("title"),
  value: field(
    "title",
    array(
      record({
        type: literal("text"),
        plainText: field("plain_text", string),
      })
    )
  ),
});

const decodeQueryResponse = record({
  object: literal("list"),
  results: array(
    record({
      object: literal("page"),
      props: field(
        "properties",
        record({
          url: field("Odkaz", decodeUrlProperty),
          published: field("Zveřejnit", decodeCheckboxProperty),
          imageUrl: field("Obrázek", decodeUrlProperty),
          priority: field("Priorita", decodeNumberProperty),
          alt: field("Náhradní text", decodeRichTextProperty),
          name: field("Název", decodeTitleProperty),
        })
      ),
    })
  ),
});

// TBD: Skip invalid, sort by priority
export async function getAllBanners(
  apiKey: string = process.env.NOTION_API_KEY ?? ""
): Promise<Banner[]> {
  const notion = new Client({ auth: apiKey });
  const database_id = "50c3e92b4f7d44ee9cc5a139d81b07b5";
  return await notion.databases
    .query({ database_id })
    .then(decodeQueryResponse)
    .then((response) =>
      response.results.filter((ad) => ad.props.published.value)
    )
    .then((results) =>
      results.map(({ props }) => ({
        name: props.name.value[0].plainText,
        image: props.imageUrl.value,
        alt: props.alt.value[0].plainText,
        url: props.url.value,
        priority: props.priority.value,
      }))
    );
}
