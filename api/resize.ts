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
 * + Check for reasonable output image size?
 * + Hash input params with a shared secret to prevent unauthorized callers
 *
 * Bonus features TBD:
 *
 * - Output progressive PNGs and JPEGs?
 */
import { VercelRequest, VercelResponse } from "@vercel/node";
import fetch from "node-fetch";
import sharp from "sharp";
import crypto from "crypto";

const maxInputFileSize = 30_000_000;
const maxInputPixelSize = 7_000;
const maxOutputPixelSize = 7_000;

const hashSecret = process.env.IMGPROXY_KEY;

async function shasum(message: string) {
  var shasum = crypto.createHash("sha1");
  shasum.update(message);
  return shasum.digest("hex");
}

export default async (
  request: VercelRequest,
  response: VercelResponse
): Promise<void> => {
  try {
    //
    // Validate arguments
    //
    if (request.method !== "GET") {
      throw "Only GET supported";
    }

    const srcUrl = request.query.src;
    if (typeof srcUrl !== "string") {
      throw "Missing or invalid “src” argument";
    }

    const strWidth = request.query.width;
    if (typeof strWidth !== "string") {
      throw "Missing or invalid “width” argument";
    }

    const width = parseInt(strWidth);
    if (isNaN(width) || width <= 0 || width > maxOutputPixelSize) {
      throw "Invalid output width";
    }

    const payload = `${srcUrl}:${strWidth}:${hashSecret}`;
    const proof = request.query.proof;
    if (typeof proof !== "string" || proof !== (await shasum(payload))) {
      throw "Authentization proof missing or invalid";
    }

    //
    // Load and validate input image
    //
    const src = await fetch(srcUrl);
    const img = sharp(Buffer.from(await src.arrayBuffer()));
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

    response.setHeader("Content-Type", contentType);
    response.setHeader(
      "Cache-Control",
      "max-age=0, s-maxage=60, stale-while-revalidate=60"
    );

    if (metadata.width <= width) {
      // Image is already smaller, no upscaling done
      response.status(200).send(src.buffer);
    } else {
      // Downscale and serve
      const out = await img.resize({ width }).toBuffer();
      response.status(200).send(out);
    }
  } catch (e) {
    response.status(500).send(`Error: ${e}`);
  }
};
