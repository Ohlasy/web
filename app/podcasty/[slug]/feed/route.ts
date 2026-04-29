import type { NextRequest } from "next/server";
import {
  convertEpisodeToFeedItem,
  getAllPodcastEpisodesSync,
  getPodcastMetadata,
} from "@/src/data/podcasts";
import { type iTunesPodcastShow, renderPodcastFeed } from "@/src/feeds";
import { absolute, RouteTo } from "@/src/routing";

type Params = {
  slug: string;
};

type Props = {
  params: Promise<Params>;
};

export async function GET(_: NextRequest, { params }: Props) {
  const { slug } = await params;
  const metadata = await getPodcastMetadata(slug).catch(() => null);
  if (!metadata) {
    return new Response(
      `Podcast “${slug}” not found (or has invalid metadata)`,
      { status: 404 },
    );
  }
  const { title, image, description, feed: selfLink } = metadata;
  const episodes = getAllPodcastEpisodesSync(slug);
  const feed: iTunesPodcastShow = {
    title,
    description,
    image,
    selfLink,
    author: "Ohlasy",
    link: absolute(RouteTo.podcasts),
    category: "News",
    explicit: false,
    language: "cs",
    ttl: 10080,
    copyright: "Ohlasy, z.s.",
    managingEditor: "tomas.trumpes@ohlasy.info (Tomáš Trumpeš)",
    webMaster: "tomas.znamenacek@ohlasy.info (Tomáš Znamenáček)",
    owner: "tomas.znamenacek@ohlasy.info",
    items: episodes.map(convertEpisodeToFeedItem),
  };
  return new Response(renderPodcastFeed(feed), {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
