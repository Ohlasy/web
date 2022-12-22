// @ts-ignore, TBD: fix later, types are missing
import DWChart from "react-datawrapper-chart";
import React from "react";
import Markdoc from "@markdoc/markdoc";
import { getImageSrcSet, IMAGE_SIGNING_KEY } from "src/utils";
import { defaultMarkdocConfig } from "src/markdoc-schema";

export type ArticleBodyProps = {
  /** Markdoc source */
  src: string;
};

export const ArticleContent = ({ src }: ArticleBodyProps) => {
  const syntaxTree = Markdoc.parse(src);
  const content = Markdoc.transform(syntaxTree, defaultMarkdocConfig);
  const node = Markdoc.renderers.react(content, React, {
    components: { Photo, SpotifyEpisode, YouTubeVideo, DatawrapperChart },
  });
  return <>{node}</>;
};

type PhotoProps = {
  src: string;
  alt?: string;
  author?: string;
  caption?: string;
  aspect?: number;
};

const Photo = ({ src, alt, author, caption, aspect }: PhotoProps) => {
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={src}
        src={src}
        srcSet={getImageSrcSet(src, IMAGE_SIGNING_KEY)}
        sizes="(min-width: 900px) 60vw, 100vw"
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

type YouTubeVideoProps = {
  id: string;
  aspect?: number;
  title?: string;
};

const YouTubeVideo = ({
  id,
  aspect = 16 / 9,
  title = "Přehrávač videa",
}: YouTubeVideoProps) => (
  <iframe
    width="100%"
    frameBorder="0"
    style={{ aspectRatio: aspect, marginTop: "20px", marginBottom: "20px" }}
    src={`https://www.youtube-nocookie.com/embed/${id}`}
    title={title}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
);

type DatawrapperChartProps = {
  id: string;
  version?: number;
  title?: string;
};

const DatawrapperChart = ({
  id,
  version = 1,
  title = "Graf",
}: DatawrapperChartProps) => (
  <DWChart
    title={title}
    src={`https://datawrapper.dwcdn.net/${id}/${version}`}
    loading="lazy"
  />
);
