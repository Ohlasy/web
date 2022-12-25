import { NextApiRequest, NextApiResponse } from "next";
import { absolute, RouteTo, siteUrl } from "src/routing";
import { renderFeed, RSSFeed, RSSFeedItem } from "src/feeds";
import { join } from "path";
import { compareByDate, getAllArticles, Article } from "src/article";
import { ArticleContent } from "components/ArticleContent";
import * as ReactDOMServer from "react-dom/server";

/** Serve last 10 articles as an RSS feed with full article text */
export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const dataRoot = join(process.cwd(), "content/articles");
  const feed: RSSFeed = {
    title: "Ohlasy",
    link: siteUrl,
    selfLink: absolute(RouteTo.articleFeed),
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

/** Convert article into an RSS feed item with full article text */
function feedItemFromArticle(article: Article): RSSFeedItem {
  const permalink = absolute(RouteTo.article(article));
  const renderContent = (body: string) =>
    ReactDOMServer.renderToStaticMarkup(ArticleContent({ src: body }));
  return {
    title: article.title,
    description: renderContent(article.body),
    pubDate: new Date(article.date),
    author: article.author,
    link: permalink,
    guid: {
      value: permalink,
      isPermaLink: true,
    },
  };
}
