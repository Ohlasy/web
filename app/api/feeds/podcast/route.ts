import {
  convertEpisodeToPodcastItem,
  getPodcastEpisodes,
} from "src/data-source/content";
import { absolute, RouteTo } from "src/routing";
import { iTunesPodcastShow, renderPodcastFeed } from "src/feeds";
import { join } from "path";

export async function GET() {
  const dataFile = join(process.cwd(), "content/podcast.yml");
  const episodes = await getPodcastEpisodes(dataFile);
  const feed: iTunesPodcastShow = {
    title: "Ohlasy Podcast",
    author: "Ohlasy",
    link: absolute(RouteTo.podcasts),
    selfLink: absolute(RouteTo.mainPodcastFeed),
    description: "Dění na Boskovicku, záznamy debat a rozhovorů",
    image: "https://i.ohlasy.info/i/waibo6c.png",
    category: "News",
    explicit: false,
    language: "cs",
    ttl: 10080,
    copyright: "Ohlasy, z.s.",
    managingEditor: "tomas.trumpes@ohlasy.info (Tomáš Trumpeš)",
    webMaster: "tomas.znamenacek@ohlasy.info (Tomáš Znamenáček)",
    owner: "tomas.znamenacek@ohlasy.info",
    items: episodes.map(convertEpisodeToPodcastItem),
  };
  return new Response(renderPodcastFeed(feed), {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
