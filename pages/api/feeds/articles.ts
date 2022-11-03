import { NextApiRequest, NextApiResponse } from "next";
import { absolute, Route, siteUrl } from "src/routing";
import { renderFeed, RSSFeed } from "src/feeds";
import { join } from "path";
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
  const dataRoot = join(process.cwd(), "content/articles");
  const feed: RSSFeed = {
    title: "Ohlasy",
    link: siteUrl,
    selfLink: absolute(Route.toArticleFeed),
    description: "Noviny pro Boskovice a okolí",
    language: "cs",
    copyright: "Ohlasy, z.s.",
    managingEditor: "tomas.trumpes@ohlasy.info (Tomáš Trumpeš)",
    webMaster: "tomas.znamenacek@ohlasy.info (Tomáš Znamenáček)",
    items: getAllArticles(dataRoot)
      .sort(compareByDate)
      .slice(0, 10)
      .map(feedItemFromArticle),
  };

  response.setHeader(
    "Content-Type",
    request.query.plain ? "text/plain" : "application/rss+xml"
  );
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=60, stale-while-revalidate=86400"
  );
  response.status(200).send(renderFeed(feed));
};
