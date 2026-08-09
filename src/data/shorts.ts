import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { load } from "js-yaml";
import {
  array,
  type decodeType,
  field,
  type Pojo,
  record,
  string,
} from "typescript-json-decoder";

export type Short = decodeType<typeof decodeShort>;

/** @internal */
export const decodeShort = record({
  id: field("url", (value) => parseYouTubeId(string(value))),
});

/** @internal */
export const decodeShorts = array(decodeShort);

/** Extract the YouTube video ID from a Shorts or watch URL, throwing if it can’t be found */
export const parseYouTubeId = (url: string): string => {
  const parsed = new URL(url);
  // https://www.youtube.com/shorts/<id>
  const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/]+)/);
  if (shortsMatch) {
    return shortsMatch[1];
  }
  // https://youtu.be/<id>
  if (parsed.hostname === "youtu.be" && parsed.pathname.length > 1) {
    return parsed.pathname.slice(1);
  }
  // https://www.youtube.com/watch?v=<id>
  const videoParam = parsed.searchParams.get("v");
  if (videoParam) {
    return videoParam;
  }
  throw new Error(`Could not parse a YouTube video ID from URL: ${url}`);
};

export const getAllShorts = async (): Promise<Short[]> => {
  const path = join(process.cwd(), "content", "shorts.yml");
  return await readFile(path, "utf-8")
    .then((str) => load(str) as Pojo)
    .then(decodeShorts);
};
