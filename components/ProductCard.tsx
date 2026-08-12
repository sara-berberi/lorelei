"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProductDetailsModal from "./ProductDetailsModal";
import ProductImage from "./ProductImage";
import { firstImageUrl } from "@/lib/images";
import { formatPrice } from "@/lib/format";
import { downloadBadgedImage } from "@/lib/badgeImage";
import { trackView } from "./RecentlyViewed";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  sizes: string | null;
  category: string | null;
  brand: string | null;
  isSoldOut: boolean;
  isOnSale: boolean;
  stock?: number | null;
}

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  /** Set for the first visible row so those images load immediately. */
  priority?: boolean;
}) {
  const tProduct = useTranslations("product");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  /** Save the photo with the sale/size/price badges drawn onto it. */
  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadBadgedImage(product);
    } catch {
      // Nothing actionable for a shopper here — the button simply resets.
    } finally {
      setDownloading(false);
    }
  };

  const displayImage = firstImageUrl(product.imageUrl);
  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const originalPrice = product.isOnSale && product.salePrice ? product.price : null;

  return (
    <>
      <div className="group cursor-pointer" data-product-id={product.id} onClick={() => { trackView(product); setIsModalOpen(true); }}>

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f6f4]">
          <ProductImage
            src={displayImage}
            alt={product.name}
            width={600}
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              // Sold-out pieces read as unavailable at a glance: dimmed, with
              // the label centred over the image. No hover zoom either, since
              // there's nothing to buy. Colour is kept — the clothes should
              // still look like the clothes.
              product.isSoldOut ? "opacity-60" : "group-hover:scale-[1.04]"
            }`}
          />

          {product.isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-gray-900 bg-white/90 backdrop-blur-sm px-4 py-2">
                {tProduct("soldOut")}
              </span>
            </div>
          )}

          {product.isOnSale && !product.isSoldOut && (
            <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase text-white bg-rose-500 px-2.5 py-1">
              Sale
            </span>
          )}

          {/* Download the photo with badges burned in */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            title="Download image with badges"
            aria-label="Download image with badges"
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-sm text-gray-700 hover:text-black opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-300 disabled:opacity-100 disabled:text-gray-400"
          >
            {downloading ? (
              <div className="w-3.5 h-3.5 border border-gray-300 border-t-gray-700 rounded-full animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
              </svg>
            )}
          </button>

          {/* Low stock warning */}
          {!product.isSoldOut && product.stock != null && product.stock <= 3 && product.stock > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-rose-500/90 backdrop-blur-sm px-3 py-1.5 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse flex-shrink-0" />
              <span className="text-[9px] tracking-[0.2em] uppercase text-white font-light">
                {tProduct("onlyLeft", { count: product.stock })}
              </span>
            </div>
          )}

          {/* Quick-add — appears on hover */}
          {!product.isSoldOut && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsModalOpen(true); }}
              className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm text-gray-900 py-3 text-[10px] tracking-[0.25em] uppercase opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
              aria-label="View product"
            >
              View
            </button>
          )}
        </div>

        {/* Info */}
        <div className={`mt-3 px-0.5 ${product.isSoldOut ? "opacity-50" : ""}`}>
          {product.brand && (
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">{product.brand}</p>
          )}
          <h3 className="text-sm font-light text-gray-900 leading-snug mb-2 line-clamp-2">{product.name}</h3>

          <div className="flex items-baseline gap-2">
            <span className={`text-sm font-light ${product.isOnSale ? "text-rose-500" : "text-gray-900"}`}>
              {formatPrice(displayPrice)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through font-light">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProductDetailsModal product={product} onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}
