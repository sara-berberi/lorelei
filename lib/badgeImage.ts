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

/**
 * Instagram's feed post size: 1080×1350, a 4:5 portrait. Rendering straight
 * into this frame means the badges sit exactly where they'll appear in the
 * feed — anything else gets re-cropped by Instagram, which would eat the
 * corners the badges live in.
 */
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1350;

/** The boutique logo, stamped bottom-right so reposts stay attributed. */
const LOGO_URL =
  "https://res.cloudinary.com/dj6ono36y/image/upload/v1763922421/_979F0DC6-3FB1-4148-AF21-52C979B86FD4_-removebg-preview_bpaz6n.png";

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

  // Request a generous width so the badges sit on a sharp photo. `c_limit`
  // keeps the original proportions — the 4:5 crop happens on our canvas, so
  // Cloudinary must not crop it first.
  // The logo is fetched in parallel, and is optional: if it fails to load the
  // badged image is still worth having, just unbranded.
  const [img, logo] = await Promise.all([
    loadImage(cloudinaryUrl(source, { width: CANVAS_WIDTH * 1.5, crop: "limit" })),
    loadImage(cloudinaryUrl(LOGO_URL, { width: 240, crop: "limit" })).catch(() => null),
  ]);

  const width = CANVAS_WIDTH;
  const height = CANVAS_HEIGHT;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");

  // Fill the 4:5 frame by cropping rather than stretching — garments must not
  // be distorted. Whichever axis overflows is trimmed evenly from both sides,
  // which keeps a centred subject centred.
  const srcW = img.naturalWidth || width;
  const srcH = img.naturalHeight || height;
  const scale = Math.max(width / srcW, height / srcH);
  const drawW = srcW * scale;
  const drawH = srcH * scale;

  // A neutral ground behind the photo, matching the storefront's image
  // placeholder, in case the source has transparency.
  ctx.fillStyle = "#f7f6f4";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);

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

  const panelContentHeight = Math.max(
    priceFontSize + (sizes.length > 0 ? gap + sizeChipHeight : 0),
    // The logo shares this band, so the scrim has to be tall enough to sit
    // behind it too.
    logo ? 150 * unit : 0
  );
  const panelHeight = panelContentHeight + margin * 2;
  const panelTop = height - panelHeight;

  const scrim = ctx.createLinearGradient(0, panelTop - 60 * unit, 0, height);
  scrim.addColorStop(0, "rgba(0,0,0,0)");
  scrim.addColorStop(0.45, "rgba(0,0,0,0.45)");
  scrim.addColorStop(1, "rgba(0,0,0,0.72)");
  ctx.fillStyle = scrim;
  ctx.fillRect(0, panelTop - 60 * unit, width, panelHeight + 60 * unit);

  // ── Logo, bottom-right ─────────────────────────────────────────────────
  // Drawn before the text so its footprint is known: the sizes and price are
  // then kept clear of it rather than sliding underneath.
  let logoLeft = width - margin;
  if (logo && logo.naturalWidth > 0) {
    const logoBox = 150 * unit;
    const logoScale = Math.min(
      logoBox / logo.naturalWidth,
      logoBox / logo.naturalHeight
    );
    const logoW = logo.naturalWidth * logoScale;
    const logoH = logo.naturalHeight * logoScale;
    const logoX = width - margin - logoW;
    const logoY = height - margin - logoH;

    ctx.drawImage(logo, logoX, logoY, logoW, logoH);
    logoLeft = logoX;
  }

  /** Right-hand limit for text, leaving a gutter before the logo. */
  const textRight = logoLeft - 24 * unit;

  // Anchor the text block to the bottom of the band so it stays aligned with
  // the logo even when the logo makes the panel taller than the text needs.
  const textBlockHeight =
    priceFontSize + (sizes.length > 0 ? gap + sizeChipHeight : 0);
  let cursorY = height - margin - textBlockHeight;

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
      // Stop before chips would collide with the logo rather than clipping.
      if (x > textRight - 60 * unit) break;
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
    const wasY = priceY + 4 * unit;

    ctx.font = `300 ${wasFontSize}px Helvetica, Arial, sans-serif`;
    const wasWidth = ctx.measureText(wasText).width;

    // Skip the struck-through original rather than let it slide under the
    // logo. The sale price and the SALE flag still carry the message.
    if (wasX + wasWidth <= textRight) {
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(wasText, wasX, wasY);

      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2 * unit;
      ctx.beginPath();
      ctx.moveTo(wasX, wasY);
      ctx.lineTo(wasX + wasWidth, wasY);
      ctx.stroke();
    }
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
 * Render every product into a single zip and hand it over as one download.
 *
 * Products that fail to render are collected and reported rather than
 * aborting the batch — one broken image URL shouldn't cost the admin the
 * whole export. `onProgress` fires after each product so callers can show
 * a counter.
 */
export async function downloadBadgedZip(
  products: BadgeProduct[],
  {
    fileName = "products.zip",
    onProgress,
  }: {
    fileName?: string;
    onProgress?: (done: number, total: number) => void;
  } = {}
): Promise<{ succeeded: number; failed: BadgeProduct[] }> {
  // Imported lazily so the zip machinery only loads when an export actually
  // runs, rather than in every page bundle that renders a product.
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const failed: BadgeProduct[] = [];
  const used = new Set<string>();
  let succeeded = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    try {
      const blob = await renderBadgedImage(product);

      // Names are derived from the product name, so two similarly named
      // pieces can collide — de-duplicate rather than letting one win.
      let name = badgedFileName(product);
      if (used.has(name)) {
        const dot = name.lastIndexOf(".");
        name = `${name.slice(0, dot)}-${i + 1}${name.slice(dot)}`;
      }
      used.add(name);

      zip.file(name, blob);
      succeeded++;
    } catch {
      failed.push(product);
    }
    onProgress?.(i + 1, products.length);
  }

  if (succeeded === 0) {
    return { succeeded, failed };
  }

  // Images are already JPEG-compressed, so re-compressing them in the zip
  // costs time for no meaningful size win.
  const archive = await zip.generateAsync({ type: "blob", compression: "STORE" });
  triggerDownload(archive, fileName);

  return { succeeded, failed };
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
