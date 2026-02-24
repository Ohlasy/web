import Markdoc, { Node } from "@markdoc/markdoc";

type SupportedImageWidth = 640 | 1080 | 1920 | 3840;

/**
 * Return a URL to a resized image
 *
 * This is (mis)using the undocumented Next.js image URL scheme,
 * if Vercel changes something, will this go down in flames?
 */
export const getResizedImageUrl = (
  sourceImageUrl: string,
  targetWidth: SupportedImageWidth,
) =>
  `/_next/image/?url=${encodeURIComponent(
    sourceImageUrl,
  )}&w=${targetWidth}&q=75`;

export function getImageSrcSet(
  sourceUrl: string,
  widths: SupportedImageWidth[] = [3840, 1920, 1080, 640],
): string {
  return widths
    .map((w) => `${getResizedImageUrl(sourceUrl, w)} ${w}w`)
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
  value: TValue | null | undefined,
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
  f: (_: T) => U,
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
