import { join } from "node:path";
import type { NextRequest } from "next/server";
import {
  convertEpisodeToPodcastItem,
  getPodcastEpisodes,
} from "@/src/data/content";
import { type iTunesPodcastShow, renderPodcastFeed } from "@/src/feeds";
import { absolute, RouteTo } from "@/src/routing";

type Params = {
  slug: string;
};

type Props = {
  params: Promise<Params>;
};

type PodcastDescription = {
  title: string;
  image: string;
  description: string;
  selfLink: string;
};

const availablePodcasts: Record<string, PodcastDescription> = {
  ohlasy: {
    title: "Ohlasy Podcast",
    image: "https://i.ohlasy.info/i/waibo6c.png",
    description: "Dění na Boskovicku, záznamy debat a rozhovorů",
    selfLink: absolute(RouteTo.mainPodcastFeed),
  },
  hrebenovka: {
    title: "Hřebenovka",
    image: "https://i.ohlasy.info/i/2e70d674.png",
    description:
      "Rozhovory z nadhledu se zajímavými lidmi z Boskovic a okolí o důležitých tématech, která pálí naše město. Na kulturu, sport, architekturu, školství nebo komunitní dění se ptají moderátoři Marek Čech a David Liber. O zvuk se stará Jiří Krajíček.",
    selfLink: absolute(RouteTo.hrebenovkaFeed),
  },
};

export async function GET(_: NextRequest, { params }: Props) {
  const { slug } = await params;
  const metadata = availablePodcasts[slug];
  if (!metadata) {
    return new Response(`Podcast “${slug}” not found`, { status: 404 });
  }
  const { title, image, description, selfLink } = metadata;
  const dataFile = join(process.cwd(), `content/podcasts/${slug}.yml`);
  const episodes = await getPodcastEpisodes(dataFile);
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
    items: episodes.map(convertEpisodeToPodcastItem),
  };
  return new Response(renderPodcastFeed(feed), {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml",
    },
  });
}
