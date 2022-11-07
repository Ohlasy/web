import fs from "fs";
import { resolve } from "path";
import crypto from "crypto";

/** Returns a flat array of all files under given directory */
export function getFilesRecursively(dir: string): string[] {
  let found: string[] = [];
  const dirents = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const path = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      found = found.concat(getFilesRecursively(path));
    } else {
      found.push(path);
    }
  }
  return found;
}

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
