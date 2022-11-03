import { NextApiRequest, NextApiResponse } from "next";
import { convertEpisodeToPodcastItem, getPodcastEpisodes } from "src/content";
import { absolute, Route } from "src/routing";
import { iTunesPodcastShow, renderPodcastFeed } from "src/feeds";
import { join } from "path";

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const dataFile = join(process.cwd(), "content/podcast.yml");
  const episodes = await getPodcastEpisodes(dataFile);
  const feed: iTunesPodcastShow = {
    title: "Ohlasy Podcast",
    author: "Ohlasy",
    link: absolute(Route.toPodcast),
    selfLink: absolute(Route.toPodcastFeed),
    description: "Dění na Boskovicku, záznamy debat a rozhovorů",
    image: "https://i.ohlasy.info/i/waibo6c.png",
    category: "News & Politics",
    explicit: false,
    language: "cs",
    ttl: 10080,
    copyright: "Ohlasy, z.s.",
    managingEditor: "tomas.trumpes@ohlasy.info (Tomáš Trumpeš)",
    webMaster: "tomas.znamenacek@ohlasy.info (Tomáš Znamenáček)",
    owner: "tomas.znamenacek@ohlasy.info",
    items: episodes.map(convertEpisodeToPodcastItem),
  };

  response.setHeader(
    "Content-Type",
    request.query.plain ? "text/plain" : "application/rss+xml"
  );
  response.setHeader(
    "Cache-Control",
    "max-age=0, s-maxage=60, stale-while-revalidate=86400"
  );
  response.status(200).send(renderPodcastFeed(feed));
};
