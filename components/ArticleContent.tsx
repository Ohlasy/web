// @ts-ignore, TBD: fix later, types are missing
import DWChart from "react-datawrapper-chart";
import React from "react";
import Markdoc from "@markdoc/markdoc";
import { getImageSrcSet, IMAGE_SIGNING_KEY } from "src/utils";
import { defaultMarkdocConfig } from "src/markdoc-schema";
import Image from "next/image";

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
  width?: number;
  height?: number;
};

const Photo = ({ src, alt, author, caption, width, height }: PhotoProps) => {
  const image =
    // If we have the image dimensions, we can use next/image to get better
    // speed and format support and less layout jumping.
    width && height ? (
      <Image
        key={src}
        src={src}
        sizes="(min-width: 900px) 60vw, 100vw"
        alt={alt ?? caption ?? ""}
        width={width}
        height={height}
        className="img-responsive"
      />
    ) : (
      // Without image dimensions, we have to resort to plain old <img> with layout jumps.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={src}
        src={src}
        srcSet={getImageSrcSet(src, IMAGE_SIGNING_KEY)}
        sizes="(min-width: 900px) 60vw, 100vw"
        alt={alt ?? caption ?? ""}
        className="img-responsive"
      />
    );
  return (
    <div>
      {image}
      <div className="img-meta">
        {caption && <span style={{ marginRight: "2ex" }}>{caption}</span>}
        {author && (
          <span className="img-author">
            <a href={src} style={{ color: "inherit" }}>
              foto: {author}
            </a>
          </span>
        )}
        {!author && (
          <span className="img-author">
            <a href={src} style={{ color: "inherit" }}>
              stáhnout foto
            </a>
          </span>
        )}
      </div>
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
