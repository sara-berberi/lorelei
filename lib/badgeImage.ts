/**
 * Renders a product photo with its badges burned into the pixels, so the
 * result can be posted to Instagram/WhatsApp as-is.
 *
 * The badges mirror what the storefront card shows — a Sale flag, the sizes
 * that are actually available, and the price (with the pre-sale price struck
 * through) — but drawn onto a canvas rather than as DOM overlays, since the
 * point is a single downloadable file.
 *
 * Browser-only: this uses canvas and Image, so call it from client code.
 */

import { cloudinaryUrl, firstImageUrl } from "./images";
import { formatPrice } from "./format";

export interface BadgeProduct {
  id: number;
  name: string;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  sizes: string | null;
  isOnSale: boolean;
  isSoldOut?: boolean;
  stock?: number | null;
}

/** Width we render at — big enough for social, small enough to stay quick. */
const CANVAS_WIDTH = 1080;

/** Fallback aspect ratio when the source image fails to report its own. */
const FALLBACK_RATIO = 4 / 3;

function parseSizes(sizes: string | null): string[] {
  if (!sizes) return [];
  try {
    const parsed = JSON.parse(sizes);
    if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
  } catch {
    // Not JSON — nothing sensible to show.
  }
  return [];
}

/**
 * Load an image with CORS enabled. Cloudinary serves `Access-Control-Allow-Origin: *`,
 * which is what keeps the canvas untainted and `toBlob` usable.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load image: ${src}`));
    img.src = src;
  });
}

/** Rounded rectangle path — used for every badge chip. */
function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Draw a chip with a text label, returning the width consumed so callers can
 * lay chips out in a row.
 */
function drawChip(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  {
    font,
    bg,
    fg,
    padX,
    height,
    letterSpacing = 0,
  }: {
    font: string;
    bg: string;
    fg: string;
    padX: number;
    height: number;
    letterSpacing?: number;
  }
): number {
  ctx.font = font;
  // Letter spacing is applied manually: it isn't universally supported on
  // canvas contexts, and the tracked-out uppercase look matters here.
  const glyphs = Array.from(text);
  const textWidth =
    glyphs.reduce((sum, ch) => sum + ctx.measureText(ch).width, 0) +
    letterSpacing * Math.max(0, glyphs.length - 1);
  const width = textWidth + padX * 2;

  ctx.fillStyle = bg;
  roundedRect(ctx, x, y, width, height, height / 2);
  ctx.fill();

  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";
  let cursor = x + padX;
  for (const ch of glyphs) {
    ctx.fillText(ch, cursor, y + height / 2);
    cursor += ctx.measureText(ch).width + letterSpacing;
  }

  return width;
}

/**
 * Compose the badged image for one product.
 *
 * Rejects when the product has no usable image, or when the image can't be
 * fetched — callers surface that per product rather than failing a whole batch.
 */
export async function renderBadgedImage(product: BadgeProduct): Promise<Blob> {
  const source = firstImageUrl(product.imageUrl);
  if (!source) throw new Error("Product has no image");

  // Request a generous width so the badges sit on a sharp photo.
  const img = await loadImage(cloudinaryUrl(source, { width: CANVAS_WIDTH * 1.5 }));

  const ratio =
    img.naturalWidth > 0 && img.naturalHeight > 0
      ? img.naturalHeight / img.naturalWidth
      : FALLBACK_RATIO;

  const width = CANVAS_WIDTH;
  const height = Math.round(width * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");

  ctx.drawImage(img, 0, 0, width, height);

  // Everything below scales off the canvas width so the badges look the same
  // regardless of the photo's aspect ratio.
  const unit = width / 1080;
  const margin = 40 * unit;

  // ── Sale flag, top-left ────────────────────────────────────────────────
  if (product.isOnSale) {
    drawChip(ctx, "SALE", margin, margin, {
      font: `600 ${26 * unit}px Helvetica, Arial, sans-serif`,
      bg: "#f43f5e",
      fg: "#ffffff",
      padX: 22 * unit,
      height: 52 * unit,
      letterSpacing: 4 * unit,
    });
  }

  // ── Bottom panel: a scrim so light photos keep the text readable ───────
  const sizes = parseSizes(product.sizes);
  const priceValue =
    product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const wasPrice = product.isOnSale && product.salePrice ? product.price : null;

  const priceFontSize = 54 * unit;
  const sizeChipHeight = 46 * unit;
  const gap = 18 * unit;

  const panelContentHeight =
    priceFontSize + (sizes.length > 0 ? gap + sizeChipHeight : 0);
  const panelHeight = panelContentHeight + margin * 2;
  const panelTop = height - panelHeight;

  const scrim = ctx.createLinearGradient(0, panelTop - 60 * unit, 0, height);
  scrim.addColorStop(0, "rgba(0,0,0,0)");
  scrim.addColorStop(0.45, "rgba(0,0,0,0.45)");
  scrim.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = scrim;
  ctx.fillRect(0, panelTop - 60 * unit, width, panelHeight + 60 * unit);

  let cursorY = panelTop + margin;

  // ── Sizes row ──────────────────────────────────────────────────────────
  if (sizes.length > 0) {
    let x = margin;
    for (const size of sizes) {
      const chipWidth = drawChip(ctx, size.toUpperCase(), x, cursorY, {
        font: `500 ${22 * unit}px Helvetica, Arial, sans-serif`,
        bg: "rgba(255,255,255,0.92)",
        fg: "#111827",
        padX: 18 * unit,
        height: sizeChipHeight,
        letterSpacing: 2 * unit,
      });
      x += chipWidth + 10 * unit;
      // Stop before chips would run off the edge rather than clipping them.
      if (x > width - margin - 60 * unit) break;
    }
    cursorY += sizeChipHeight + gap;
  }

  // ── Price ──────────────────────────────────────────────────────────────
  ctx.textBaseline = "middle";
  const priceY = cursorY + priceFontSize / 2;

  ctx.font = `300 ${priceFontSize}px Helvetica, Arial, sans-serif`;
  const priceText = formatPrice(priceValue);
  ctx.fillStyle = wasPrice ? "#fda4af" : "#ffffff";
  ctx.fillText(priceText, margin, priceY);

  if (wasPrice) {
    const wasFontSize = 34 * unit;
    const wasText = formatPrice(wasPrice);
    const wasX = margin + ctx.measureText(priceText).width + 18 * unit;

    ctx.font = `300 ${wasFontSize}px Helvetica, Arial, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.fillText(wasText, wasX, priceY + 4 * unit);

    // Strike-through on the original price.
    const wasWidth = ctx.measureText(wasText).width;
    ctx.strokeStyle = "rgba(255,255,255,0.7)";
    ctx.lineWidth = 2 * unit;
    ctx.beginPath();
    ctx.moveTo(wasX, priceY + 4 * unit);
    ctx.lineTo(wasX + wasWidth, priceY + 4 * unit);
    ctx.stroke();
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not encode image"))),
      "image/jpeg",
      0.92
    );
  });
}

/** Filesystem-safe filename for a product's badged image. */
export function badgedFileName(product: BadgeProduct): string {
  const slug = product.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${slug || "product"}-${product.id}.jpg`;
}

/** Push a blob to the user as a download. */
export function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoke on the next tick — revoking synchronously can cancel the download
  // in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Render and download one product's badged image. */
export async function downloadBadgedImage(product: BadgeProduct): Promise<void> {
  const blob = await renderBadgedImage(product);
  triggerDownload(blob, badgedFileName(product));
}

/**
 * A product is worth exporting when it's still sellable — sold-out pieces and
 * ones that have run down to zero stock are skipped by the bulk download.
 */
export function isDownloadable(product: BadgeProduct & { deletedAt?: string | null }): boolean {
  if (product.deletedAt) return false;
  if (product.isSoldOut) return false;
  if (product.stock != null && product.stock <= 0) return false;
  return Boolean(firstImageUrl(product.imageUrl));
}
