import Markdoc, { Node } from "@markdoc/markdoc";
import crypto from "crypto";

export const IMAGE_SIGNING_KEY = process.env.IMGPROXY_KEY ?? "";

/** SHA1 sum */
export function shasum(message: string) {
  var shasum = crypto.createHash("sha1");
  shasum.update(message);
  return shasum.digest("hex");
}

/** Return a URL to a resized image */
export function getSignedResizedImage(
  sourceImageUrl: string,
  targetWidth: number,
  signingSecret: string
): string {
  const proof = shasum([sourceImageUrl, targetWidth, signingSecret].join(":"));
  const params = new URLSearchParams({
    src: sourceImageUrl,
    width: targetWidth.toString(),
    proof,
  });
  return `https://nahledy.ohlasy.info/?${params}`;
}

export function getImageSrcSet(
  sourceUrl: string,
  signingSecret: string,
  widths = [3000, 2000, 1000, 500]
): string {
  return widths
    .map((w) => {
      const resizedUrl = getSignedResizedImage(sourceUrl, w, signingSecret);
      return `${resizedUrl} ${w}w`;
    })
    .join(", ");
}

/** Shuffle array in place, returns a reference to the same array */
export function shuffleInPlace<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** Return a shuffled copy of the input array */
export const shuffled = <T>(array: readonly T[]) => shuffleInPlace([...array]);

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export function* endlessGeneratorOf<T>(items: T[]): Generator<T, T, unknown> {
  let index = 0;
  while (true) {
    yield items[index];
    index = (index + 1) % items.length;
  }
}

export const stripMarkdown = (mdown: string) =>
  renderPlainText(Markdoc.parse(mdown));

export function renderPlainText(doc: Node): string {
  let output = "";
  for (const node of doc.walk()) {
    if (node.type === "text") {
      output += node.attributes.content;
    }
  }
  return output;
}

export function map<T, U>(
  val: T | undefined | null,
  f: (_: T) => U
): U | undefined {
  return val ? f(val) : undefined;
}

/** Tie single-letter prepositions with following text using a non-breaking space */
export function tilde(str: string, replacement = " "): string {
  // We need something like “word boundary followed by single-letter preposition”,
  // but JavaScript’s regex \b doesn’t support Unicode, so we use a lookbehind with
  // a Unicode aware class (\P{L} meaning “anything but a letter”).
  return str.replaceAll(/(?<=\P{L}|^)([uioaskzv]) /giu, `$1${replacement}`);
}

/** Commonly used time durations in seconds */
export const Duration = {
  oneMinute: 60,
  oneHour: 60 * 60,
  oneDay: 24 * 60 * 60,
  oneWeek: 7 * 24 * 60 * 60,
};

/** Filter out duplicates from an array, returns a new array */
export const unique = <T>(a: T[]) => [...new Set(a)];
