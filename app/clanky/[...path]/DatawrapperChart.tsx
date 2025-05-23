"use client";

import { useEffect, useRef } from "react";

type Props = {
  id: string;
  version?: string;
  title?: string; // TBD: insert to embed
};

export const DatawrapperChart = ({ id, version }: Props) => {
  const elem = useRef<HTMLDivElement | null>(null);
  const script = useRef<HTMLScriptElement>();
  const embedUrl = version
    ? `https://datawrapper.dwcdn.net/${id}/embed.js?v=${version}`
    : `https://datawrapper.dwcdn.net/${id}/embed.js`;
  useEffect(() => {
    if (!script.current) {
      script.current = document.createElement("script");
      script.current.src = embedUrl;
      script.current.defer = true;
      elem.current!.appendChild(script.current);
    }
  }, [elem, script, id, embedUrl]);

  return (
    <div ref={elem} style={{ marginTop: "30px", marginBottom: "30px" }}>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://datawrapper.dwcdn.net/${id}/full.png`}
          alt="Graf"
          loading="lazy"
        />
      </noscript>
    </div>
  );
};
