"use client";

import { useState } from "react";
import ProductDetailsModal from "./ProductDetailsModal";

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
}

export default function ProductCard({ product }: { product: Product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getFirstImage = (imageUrl: string): string => {
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {}
    return imageUrl;
  };

  const displayImage = getFirstImage(product.imageUrl);
  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const originalPrice = product.isOnSale && product.salePrice ? product.price : null;

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setIsModalOpen(true)}>

        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#f7f6f4]">
          {!imageError ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[10px] tracking-widest uppercase text-gray-300">No Image</span>
            </div>
          )}

          {/* Status badges — understated */}
          {product.isSoldOut && (
            <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase text-white/90 bg-gray-900/70 backdrop-blur-sm px-2.5 py-1">
              Sold Out
            </span>
          )}
          {product.isOnSale && !product.isSoldOut && (
            <span className="absolute top-3 left-3 text-[9px] tracking-[0.2em] uppercase text-white/90 bg-[#1a0a20]/70 backdrop-blur-sm px-2.5 py-1">
              Sale
            </span>
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
        <div className="mt-3 px-0.5">
          {product.brand && (
            <p className="text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1">{product.brand}</p>
          )}
          <h3 className="text-sm font-light text-gray-900 leading-snug mb-2 line-clamp-2">{product.name}</h3>

          <div className="flex items-baseline gap-2">
            <span className="text-sm font-light text-gray-900">
              ALL {displayPrice.toFixed(0)}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through font-light">
                ALL {originalPrice.toFixed(0)}
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
