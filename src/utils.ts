import crypto from "crypto";

// TBD: We intentionally leak the key here, replace with server compontents
export const IMAGE_SIGNING_KEY = process.env.IMGPROXY_KEY ?? "";

/** This is a hack, see https://github.com/vercel/next.js/issues/11993 */
export const filterUndefines = <T>(data: T): T =>
  JSON.parse(JSON.stringify(data));

/** Return a URL to a resized image */
export function getSignedResizedImage(
  sourceImageUrl: string,
  targetWidth: number,
  signingSecret: string
): string {
  const root = "https://nahledy.ohlasy.info";
  const shasum = crypto.createHash("sha1");
  shasum.update([sourceImageUrl, targetWidth, signingSecret].join(":"));
  const proof = shasum.digest("hex");
  return `${root}/?src=${sourceImageUrl}&width=${targetWidth}&proof=${proof}`;
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
