import { IMAGE_SIGNING_KEY, shasum } from "src/utils";
import sharp from "sharp";

const maxInputFileSize = 30_000_000;
const maxInputPixelSize = 7_000;
const maxOutputPixelSize = 7_000;

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
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const srcUrl = searchParams.get("src");
  if (typeof srcUrl !== "string") {
    return new Response("Missing or invalid “src” argument", { status: 400 });
  }

  const strWidth = searchParams.get("width");
  if (typeof strWidth !== "string") {
    return new Response("Missing or invalid “width” argument", {
      status: 400,
    });
  }

  const width = parseInt(strWidth);
  if (isNaN(width) || width <= 0 || width > maxOutputPixelSize) {
    return new Response("Invalid output width", { status: 400 });
  }

  const payload = `${srcUrl}:${strWidth}:${IMAGE_SIGNING_KEY}`;
  const proof = searchParams.get("proof");
  if (typeof proof !== "string" || proof !== shasum(payload)) {
    return new Response("Authentication proof missing or invalid", {
      status: 401,
    });
  }

  //
  // Load and validate input image
  //

  // Caching the response leads to some weird errors in console
  const srcImageResponse = await fetch(srcUrl, { cache: "no-store" });
  if (!srcImageResponse.ok) {
    return srcImageResponse;
  }

  let img = sharp(Buffer.from(await srcImageResponse.arrayBuffer()));
  const metadata = await img.metadata();

  const contentType = srcImageResponse.headers.get("Content-Type");
  if (!contentType) {
    return new Response("No content type reported by source image", {
      status: 500,
    });
  }

  if (!metadata.size || metadata.size > maxInputFileSize) {
    return new Response("Source image size unknown or too big", {
      status: 500,
    });
  }

  if (
    !metadata.width ||
    metadata.width > maxInputPixelSize ||
    !metadata.height ||
    metadata.height > maxInputPixelSize
  ) {
    return new Response("Source image dimensions unknown or too big", {
      status: 500,
    });
  }

  //
  // Ship it!
  //

  // Downscale if needed
  if (metadata.width > width) {
    img = img.resize({ width });
  }

  const out = await img
    .png({ force: false, progressive: true })
    .jpeg({ force: false, quality: 90, progressive: true })
    .toBuffer();

  return new Response(out, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control":
        "max-age=604800, s-maxage=604800, stale-while-revalidate",
    },
  });
}
