import { NextApiRequest, NextApiResponse } from "next";
import { Feed } from "feed";
import {
  compareByDate,
  feedItemFromArticle,
  getAllArticles,
} from "src/article";

/** Serve last 10 articles as an RSS feed with full article text */
export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const feed = new Feed({
    title: "Ohlasy",
    description: "Noviny pro Boskovice a okolí",
    id: "https://ohlasy.info",
    link: "https://ohlasy.info",
    language: "cs",
    copyright: "Ohlasy, z.s.",
  });

  getAllArticles("content/articles")
    .sort(compareByDate)
    .slice(0, 10)
    .map(feedItemFromArticle)
    .forEach(feed.addItem);

  response.setHeader(
    "Content-Type",
    request.query.plain ? "text/plain" : "application/rss+xml"
  );
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=60, stale-while-revalidate=86400"
  );
  response.status(200).send(feed.rss2());
};
