import React from "react";
import Markdoc from "@markdoc/markdoc";
import { photo } from "src/markdoc-schema";

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
      <img src={src} alt={alt ?? caption ?? ""} className="img-responsive" />
      {(author || caption) && (
        <span className="img-meta">
          {caption}
          {caption && "  "}
          {author && <span className="img-author">foto: {author}</span>}
        </span>
      )}
    </div>
  );
};
