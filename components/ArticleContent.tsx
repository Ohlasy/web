import React from "react";
import Markdoc from "@markdoc/markdoc";
import { photo, spotify_episode } from "src/markdoc-schema";
import { getImageSrcSet, IMAGE_SIGNING_KEY } from "src/utils";

export type ArticleBodyProps = {
  /** Markdoc source */
  src: string;
};

export const ArticleContent = ({ src }: ArticleBodyProps) => {
  const syntaxTree = Markdoc.parse(src);
  const content = Markdoc.transform(syntaxTree, {
    tags: { photo, spotify_episode },
  });
  const node = Markdoc.renderers.react(content, React, {
    components: { Photo, SpotifyEpisode },
  });
  return <>{node}</>;
};

type PhotoProps = {
  src: string;
  alt?: string;
  author?: string;
  caption?: string;
};

const Photo = ({ src, alt, author, caption }: PhotoProps) => {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        src={src}
        srcSet={getImageSrcSet(src, IMAGE_SIGNING_KEY)}
        alt={alt ?? caption ?? ""}
        className="img-responsive"
      />
      {(author || caption) && (
        <div className="img-meta">
          {caption}
          {caption && "  "}
          {author && <span className="img-author">foto: {author}</span>}
        </div>
      )}
    </div>
  );
};

type SpotifyEpisodeProps = {
  id: string;
};

const SpotifyEpisode = ({ id }: SpotifyEpisodeProps) => (
  <iframe
    src={`https://open.spotify.com/embed/episode/${id}`}
    width="100%"
    height="352"
    frameBorder="0"
    allowFullScreen
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
  />
);
