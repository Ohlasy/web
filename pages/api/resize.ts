/*
 * Image resizing service using https://sharp.pixelplumbing.com/
 *
 * Basic features:
 *
 * + Resize source URL to given width, keeping aspect ratio
 * + Keep the image in the source format (PNG or JPEG)
 *
 * Security:
 *
 * + Check for reasonable input image size
 * + Check for reasonable output image size
 * + Hash input params with a shared secret to prevent unauthorized callers
 *
 * Bonus features:
 *
 * + Output progressive PNGs and JPEGs
 */
import { NextApiRequest, NextApiResponse } from "next";
import { IMAGE_SIGNING_KEY } from "src/utils";
import sharp from "sharp";
import crypto from "crypto";

const maxInputFileSize = 30_000_000;
const maxInputPixelSize = 7_000;
const maxOutputPixelSize = 7_000;

function shasum(message: string) {
  var shasum = crypto.createHash("sha1");
  shasum.update(message);
  return shasum.digest("hex");
}

export default async (
  request: NextApiRequest,
  response: NextApiResponse
): Promise<void> => {
  const send = (code: number, msg: string) => response.status(code).send(msg);
  try {
    //
    // Validate arguments
    //
    if (request.method !== "GET" && request.method !== "HEAD") {
      send(400, "Only GET/HEAD supported");
      return;
    }

    const srcUrl = request.query.src;
    if (typeof srcUrl !== "string") {
      send(400, "Missing or invalid “src” argument");
      return;
    }

    const strWidth = request.query.width;
    if (typeof strWidth !== "string") {
      send(400, "Missing or invalid “width” argument");
      return;
    }

    const width = parseInt(strWidth);
    if (isNaN(width) || width <= 0 || width > maxOutputPixelSize) {
      send(400, "Invalid output width");
      return;
    }

    const payload = `${srcUrl}:${strWidth}:${IMAGE_SIGNING_KEY}`;
    const proof = request.query.proof;
    if (typeof proof !== "string" || proof !== shasum(payload)) {
      send(401, "Authentication proof missing or invalid");
      return;
    }

    //
    // Load and validate input image
    //
    const src = await fetch(srcUrl);
    let img = sharp(Buffer.from(await src.arrayBuffer()));
    const metadata = await img.metadata();

    const contentType = src.headers.get("Content-Type");
    if (!contentType) {
      throw "No content type reported by source image";
    }

    if (!metadata.size || metadata.size > maxInputFileSize) {
      throw "Source image size unknown or too big";
    }

    if (
      !metadata.width ||
      metadata.width > maxInputPixelSize ||
      !metadata.height ||
      metadata.height > maxInputPixelSize
    ) {
      throw "Source image dimensions unknown or too big";
    }

    //
    // Ship it!
    //

    response.setHeader(
      "Cache-Control",
      "max-age=86400, s-maxage=86400, stale-while-revalidate"
    );

    // Downscale if needed
    if (metadata.width > width) {
      img = img.resize({ width });
    }

    const out = await img
      .png({ force: false, progressive: true })
      .jpeg({ force: false, quality: 90, progressive: true })
      .toBuffer();

    response.setHeader("Content-Type", contentType);
    response.status(200).send(out);
  } catch (e) {
    response.setHeader("Content-Type", "text/plain");
    response.status(500).send(`Error: ${e}`);
  }
};
