import { readFile } from "node:fs/promises";
import { join } from "node:path";
import yaml from "js-yaml";
import {
  type decodeType,
  field,
  optional,
  type Pojo,
  record,
  string,
} from "typescript-json-decoder";
import { decodeObject, decodeUrl } from "../decoding";

export type Author = decodeType<typeof decodeAuthor>;
export const decodeAuthor = record({
  name: string,
  mail: optional(string),
  phoneNumber: field("telefon", optional(string)),
  profilePhotoUrl: field("profilovka", optional(decodeUrl)),
  bio: optional(string),
  fedi: optional(string),
});

export const decodeAuthors = (value: Pojo) => {
  const decodeWrapper = decodeObject(decodeObject(string));
  const authorMap = decodeWrapper(value);
  return Object.entries(authorMap).map(([name, fields]) =>
    decodeAuthor({ name, ...fields }),
  );
};

export const getAllAuthors = async () => {
  const path = join(process.cwd(), "content", "autori.yml");
  return await readFile(path, "utf-8")
    .then((str) => yaml.load(str) as Pojo)
    .then(decodeAuthors);
};
