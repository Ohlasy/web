import {
  type decodeType,
  field,
  record,
  string,
} from "typescript-json-decoder";
import { shuffled } from "@/src/utils";
import { fetchAllRecords } from "./airtable";

export type Banner = decodeType<typeof decodeBanner>;
const decodeBanner = record({
  name: field("Název", string),
  image: field("Obrázek", string),
  url: field("Odkaz", string),
  alt: field("Náhradní text", string),
});

export const getAllBanners = () =>
  fetchAllRecords({
    appId: "appcP5M7jTIUMZaRc",
    tableId: "tblxgfyRlovII0SC2",
    view: "Zveřejněné",
    decoder: decodeBanner,
  }).then(shuffled);
