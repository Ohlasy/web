import React from "react";
import Markdoc from "@markdoc/markdoc";
import { getImageSrcSet, tilde } from "src/utils";
import { defaultMarkdocConfig } from "src/markdoc-schema";
import { DatawrapperChart } from "./DatawrapperChart";
import Image from "next/image";
import { default as NextLink } from "next/link";
import { siteUrl } from "src/routing";
import { plausibleEventClass } from "src/data/plausible";
import { PodcastPlayer } from "./PodcastPlayer";

export type ArticleBodyProps = {
  /** Markdoc source */
  src: string;
};

export const ArticleContent = ({ src }: ArticleBodyProps) => {
  const syntaxTree = Markdoc.parse(src);

  // Tie single-letter prepositions
  for (const node of syntaxTree.walk()) {
    if (node.type === "text") {
      node.attributes.content = tilde(node.attributes.content);
    }
  }

  const content = Markdoc.transform(syntaxTree, defaultMarkdocConfig);
  const node = Markdoc.renderers.react(content, React, {
    components: {
      Link,
      Photo,
      ProfilePhoto,
      SpotifyEpisode,
      YouTubeVideo,
      DatawrapperChart,
      PodcastPlayer,
    },
  });
  return <div className="article-content">{node}</div>;
};

/** Make sure we use local next/link for hyperlinks to keep client-side navigation */
const Link = ({ href, children }: { href: string; children: string }) => {
  if (href.startsWith(siteUrl)) {
    return (
      <NextLink
        href={href.replace(siteUrl, "")}
        className={plausibleEventClass({
          name: "Internal Link",
          type: "article-content",
        })}
      >
        {children}
      </NextLink>
    );
  } else {
    return <NextLink href={href}>{children}</NextLink>;
  }
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
  const imageStyle: React.CSSProperties = {
    maxWidth: "100%",
    height: "auto",
    marginTop: "25px",
    marginBottom: "25px",
  };
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
        style={imageStyle}
      />
    ) : (
      // Without image dimensions, we have to resort to plain old <img> with layout jumps.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={src}
        src={src}
        srcSet={getImageSrcSet(src)}
        sizes="(min-width: 900px) 60vw, 100vw"
        alt={alt ?? caption ?? ""}
        style={imageStyle}
      />
    );
  const credits = author ? `foto: ${author}` : "stáhnout foto";
  return (
    <div>
      {image}
      <div
        className="text-balance"
        style={{
          marginTop: "-18px",
          marginBottom: "18px",
          fontSize: "90%",
          lineHeight: "1.4em",
          color: "gray",
        }}
      >
        {caption && <span style={{ marginRight: "2ex" }}>{caption}</span>}
        <span style={{ textTransform: "uppercase", fontSize: "80%" }}>
          <a href={src} style={{ color: "inherit" }}>
            {credits}
          </a>
        </span>
      </div>
    </div>
  );
};

type ProfilePhotoProps = {
  src: string;
  name?: string;
};

const ProfilePhoto = ({ src, name }: ProfilePhotoProps) => (
  <div style={{ marginTop: "2ex" }}>
    <Image
      src={src}
      alt={name ?? ""}
      width={100}
      height={100}
      style={{
        borderRadius: "50%",
        float: "left",
        marginRight: "2ex",
      }}
    />
  </div>
);

type SpotifyEpisodeProps = {
  id: string;
};

const SpotifyEpisode = ({ id }: SpotifyEpisodeProps) => (
  <iframe
    src={`https://open.spotify.com/embed/episode/${id}`}
    width="100%"
    height="352"
    allowFullScreen
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy"
    className="my-6"
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
    style={{ aspectRatio: aspect, marginTop: "20px", marginBottom: "20px" }}
    src={`https://www.youtube-nocookie.com/embed/${id}`}
    title={title}
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowFullScreen
  ></iframe>
);
