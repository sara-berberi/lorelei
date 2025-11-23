"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ProductDetailsModal from "./ProductDetailsModal";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  sizes: string | null;
  isSoldOut: boolean;
  isOnSale: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("common");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Get first image for product card (support both single URL and JSON array)
  const getFirstImage = (imageUrl: string): string => {
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0] as string;
      }
    } catch {
      // If parsing fails, it's a single image URL
    }
    return imageUrl;
  };

  const displayImage = getFirstImage(product.imageUrl);
  const displayPrice =
    product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const originalPrice =
    product.isOnSale && product.salePrice ? product.price : null;

  return (
    <>
      <div
        className="group relative cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {!imageError ? (
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400 text-sm">No Image</span>
            </div>
          )}
          {product.isSoldOut && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-medium">
              {t("soldOut")}
            </div>
          )}
          {product.isOnSale && !product.isSoldOut && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-red-500 text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs font-medium">
              {t("sale")}
            </div>
          )}
        </div>
        <div className="mt-3 sm:mt-4">
          <h3 className="text-base sm:text-lg font-light mb-1.5 sm:mb-2">
            {product.name}
          </h3>
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            {originalPrice && (
              <span className="text-gray-400 line-through text-xs sm:text-sm">
                ALL {originalPrice.toFixed(2)}
              </span>
            )}
            <span
              className={`text-base sm:text-lg font-medium ${
                product.isOnSale ? "text-red-600" : "text-black"
              }`}
            >
              ALL {displayPrice.toFixed(2)}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            disabled={product.isSoldOut}
            className={`w-full py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-medium transition-colors ${
              product.isSoldOut
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
            }`}
          >
            {t("orderNow")}
          </button>
        </div>
      </div>
      {isModalOpen && (
        <ProductDetailsModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
