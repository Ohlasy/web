import { Schema, Config } from "@markdoc/markdoc";

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

export const spotify_episode: Schema = {
  render: "SpotifyEpisode",
  selfClosing: true,
  attributes: {
    id: {
      type: String,
      required: true,
      errorLevel: "error",
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
    spotify_episode,
    youtube_video,
    datawrapper_chart,
  },
};
