import { shuffled } from "src/utils";
import { decodeType, field, record } from "typescript-json-decoder";
import {
  decodeCheckbox,
  decodePlainRichtext,
  decodeTitle,
  decodeUrl,
  getTypedDatabaseRows,
} from "./notion";

export type Banner = decodeType<typeof decodeBannerProps>;

export const decodeBannerProps = record({
  name: field("Název", decodeTitle),
  published: field("Zveřejnit", decodeCheckbox),
  image: field("Obrázek", decodeUrl),
  alt: field("Náhradní text", decodePlainRichtext),
  url: field("Odkaz", decodeUrl),
});

export async function getAllBanners(): Promise<Banner[]> {
  const databaseId = "50c3e92b4f7d44ee9cc5a139d81b07b5";
  const banners = await getTypedDatabaseRows(databaseId, decodeBannerProps);
  return shuffled(banners.filter((b) => b.published));
}
