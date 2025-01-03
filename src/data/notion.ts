import { Client } from "@notionhq/client";
import {
  DecoderFunction,
  array,
  boolean,
  field,
  literal,
  nullable,
  number,
  record,
  string,
} from "typescript-json-decoder";

//
// Primitive decoders
//

const notionUrl = record({
  type: literal("url"),
  value: field("url", string),
});

const notionCheckbox = record({
  type: literal("checkbox"),
  value: field("checkbox", boolean),
});

const notionRichText = record({
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

const notionTitle = record({
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

const notionId = record({
  type: literal("unique_id"),
  value: field(
    "unique_id",
    record({
      prefix: nullable(string),
      number: number,
    })
  ),
});

//
// Value Decoders
//

const decodeValue = <T>(decoder: DecoderFunction<{ value: T }>) =>
  map(decoder, (v) => v.value);

export const decodeUrl = decodeValue(notionUrl);
export const decodeCheckbox = decodeValue(notionCheckbox);

export const decodeTitle = map(notionTitle, (v) =>
  string(v.value.at(0)?.plainText)
);

export const decodePlainRichtext = map(notionRichText, (v) =>
  string(v.value.at(0)?.plainText)
);

export const decodeId = map(notionId, (v) => v.value.number);

//
// Support
//

function map<T, U>(
  decoder: DecoderFunction<T>,
  f: (_: T) => U
): DecoderFunction<U> {
  return (input: unknown) => f(decoder(input));
}

export const decodePage = <Props>(decodeProps: DecoderFunction<Props>) =>
  record({
    id: string,
    object: literal("page"),
    props: field("properties", decodeProps),
  });

//
// DB Interface
//

export async function getTypedDatabaseRows<T>(
  database_id: string,
  decodeRow: DecoderFunction<T>,
  apiKey = process.env.NOTION_API_KEY
): Promise<T[]> {
  const decodeResponse = record({
    object: literal("list"),
    results: array(decodePage(decodeRow)),
  });
  const notion = new Client({ auth: apiKey });
  const response = await notion.databases.query({ database_id });
  const results = decodeResponse(response) as any as {
    results: { props: T }[];
  };
  return results.results.map((r) => r.props);
}
