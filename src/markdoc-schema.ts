import { type Config, type Schema, Tag } from "@markdoc/markdoc";
import {
  getAllPodcastEpisodesSync,
  getPodcastMetadataSync,
} from "./data/podcasts";

export const photo: Schema = {
  render: "Photo",
  selfClosing: true,
  attributes: {
    src: {
      type: String,
      required: true,
      errorLevel: "error",
    },
    alt: {
      type: String,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    caption: {
      type: String,
    },
    author: {
      type: String,
    },
  },
};

export const profile_photo: Schema = {
  render: "ProfilePhoto",
  selfClosing: true,
  attributes: {
    src: {
      type: String,
      required: true,
      errorLevel: "error",
    },
    name: {
      type: String,
    },
  },
};

export const youtube_video: Schema = {
  render: "YouTubeVideo",
  selfClosing: true,
  attributes: {
    id: {
      type: String,
      required: true,
      errorLevel: "error",
    },
    aspect: {
      type: Number,
    },
    title: {
      type: String,
    },
    time: {
      type: Number,
    },
  },
};

export const datawrapper_chart: Schema = {
  render: "DatawrapperChart",
  selfClosing: true,
  attributes: {
    id: {
      type: String,
      required: true,
      errorLevel: "error",
    },
    version: {
      type: String,
    },
    title: {
      type: String,
    },
  },
};

export const podcast_player: Schema = {
  render: "PodcastPlayer",
  selfClosing: true,

  attributes: {
    show: {
      type: String,
      required: false,
      default: "ohlasy",
    },
    file: {
      type: String,
      required: true,
      errorLevel: "error",
    },
    t: {
      type: Number,
      required: false,
    },
  },

  transform(node, config) {
    const attributes = node.transformAttributes(config);
    const allEpisodes = getAllPodcastEpisodesSync(attributes.show);
    const episode = allEpisodes.find((e) => e.url.endsWith(attributes.file));
    const showMetadata = getPodcastMetadataSync(attributes.show);
    return new Tag("PodcastPlayer", { episode, showMetadata, ...attributes });
  },
};

export const defaultMarkdocConfig: Config = {
  nodes: {
    link: {
      // Use next/link for hypertext links
      render: "Link",
      attributes: {
        href: {
          type: "String",
          required: true,
        },
      },
    },
  },
  tags: {
    photo,
    profile_photo,
    youtube_video,
    datawrapper_chart,
    podcast_player,
  },
};
