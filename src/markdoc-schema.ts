import { Schema } from "@markdoc/markdoc";

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
    caption: {
      type: String,
    },
    author: {
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
