import React from "react";
import Markdoc from "@markdoc/markdoc";
import { photo } from "src/markdoc-schema";
import { getImageSrcSet } from "src/utils";

// TBD: We can’t use contexts to inject the value from above
// since this is a server component and contexts can’t be used
// in server components (yet?). Once it’s possible to use contexts,
// we should move the dependency upwards?
const imageSigningSecret = process.env.IMGPROXY_KEY ?? "";

export type ArticleBodyProps = {
  /** Markdoc source */
  src: string;
};

export const ArticleContent = ({ src }: ArticleBodyProps) => {
  const syntaxTree = Markdoc.parse(src);
  const content = Markdoc.transform(syntaxTree, { tags: { photo } });
  const node = Markdoc.renderers.react(content, React, {
    components: { Photo },
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
        srcSet={getImageSrcSet(src, imageSigningSecret)}
        src={src}
        alt={alt ?? caption ?? ""}
        style={{ width: "400px", display: "block" }}
      />
      {author && <span>foto: {author}</span>}
    </div>
  );
};
