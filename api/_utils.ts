import { VercelRequest, VercelResponse } from "@vercel/node";

export function renderCSV(stats: Record<string, number>): string {
  return Object.entries(stats)
    .sort(([k1, v1], [k2, v2]) => v2 - v1)
    .map(([key, val]) => `${key}; ${val}`)
    .join("\n");
}

export function send(
  contentType: string,
  producer: () => Promise<string>
): (req: VercelRequest, res: VercelResponse) => Promise<void> {
  return async (_, response) => {
    try {
      const value = await producer();
      response.setHeader(
        "Cache-Control",
        "max-age=0, s-maxage=60, stale-while-revalidate=86400"
      );
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader("Content-Type", contentType);
      response.status(200).send(value);
    } catch {
      response.status(500).send("Error loading source data.");
    }
  };
}
