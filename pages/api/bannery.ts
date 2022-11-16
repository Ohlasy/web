import { NextApiRequest, NextApiResponse } from "next";
import { getAllBanners } from "src/banners";

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const apiKey = process.env.NOTION_API_KEY ?? "<not set>";
  const banners = await getAllBanners(apiKey);
  const out = JSON.stringify(banners, null, 2);
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=60, stale-while-revalidate=86400"
  );
  response.setHeader("Content-Type", "application/json");
  response.status(200).send(out);
};
