/**
 * Image URL helpers.
 *
 * Product images are stored either as a single URL string or as a JSON array
 * of URLs. Most are hosted on Cloudinary, which can resize/recompress on the
 * fly via URL transforms — so instead of shipping the multi-megabyte original
 * to a phone we request an appropriately sized, auto-format (WebP/AVIF) copy.
 */

/** Parse the stored imageUrl column into a list of URLs. */
export function parseImageUrls(imageUrl: string | null | undefined): string[] {
  if (!imageUrl) return [];
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed)) {
      return parsed.map(String).filter(Boolean);
    }
  } catch {
    // Not JSON — treat as a single plain URL.
  }
  return [imageUrl];
}

/** First image of a product, or empty string when there is none. */
export function firstImageUrl(imageUrl: string | null | undefined): string {
  return parseImageUrls(imageUrl)[0] ?? "";
}

const CLOUDINARY_UPLOAD = "/image/upload/";

/**
 * Ask Cloudinary for a transformed version of an image.
 *
 * Returns the URL untouched for non-Cloudinary hosts, and avoids
 * double-inserting transforms if the URL already carries them.
 */
export function cloudinaryUrl(
  url: string,
  { width, quality = "auto", crop = "fill" }: { width: number; quality?: string; crop?: string }
): string {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  const idx = url.indexOf(CLOUDINARY_UPLOAD);
  if (idx === -1) return url;

  const prefix = url.slice(0, idx + CLOUDINARY_UPLOAD.length);
  let rest = url.slice(idx + CLOUDINARY_UPLOAD.length);

  // Strip any transform segment we (or someone else) added previously so the
  // widths stay correct when this runs more than once.
  const firstSegment = rest.split("/")[0];
  if (/^[a-z]_[^/]*/.test(firstSegment) && firstSegment.includes(",")) {
    rest = rest.slice(firstSegment.length + 1);
  }

  const transform = `f_auto,q_${quality},c_${crop},w_${width},dpr_auto`;
  return `${prefix}${transform}/${rest}`;
}

/** Widths we generate for product imagery, covering phone → retina desktop. */
export const PRODUCT_WIDTHS = [200, 300, 400, 600, 800, 1200];

/** Build a srcset so the browser downloads only the size it actually needs. */
export function buildSrcSet(url: string, widths: number[] = PRODUCT_WIDTHS): string | undefined {
  if (!url || !url.includes("res.cloudinary.com")) return undefined;
  return widths.map((w) => `${cloudinaryUrl(url, { width: w })} ${w}w`).join(", ");
}
