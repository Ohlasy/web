import { shuffled } from "src/utils";
import {
  array,
  type decodeType,
  field,
  record,
  string,
} from "typescript-json-decoder";
import { getTable, unwrapRecords } from "./airtable";

const bannerTable = () => getTable("appcP5M7jTIUMZaRc", "tblxgfyRlovII0SC2");

export type Banner = decodeType<typeof decodeBanner>;
export const decodeBanner = record({
  name: field("Název", string),
  image: field("Obrázek", string),
  url: field("Odkaz", string),
  alt: field("Náhradní text", string),
});

export const getAllBanners = () =>
  bannerTable()
    .select({ view: "Zveřejněné" })
    .all()
    .then(unwrapRecords)
    .then(array(decodeBanner))
    .then(shuffled);
