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
  category: string | null;
  brand: string | null;
  isSoldOut: boolean;
  isOnSale: boolean;
}

export default function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("common");
  const tCategories = useTranslations("categories");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getCategoryTranslation = (category: string | null): string => {
    if (!category) return "";
    const categoryMap: Record<string, string> = {
      Tops: "tops",
      Bottoms: "bottoms",
      Dresses: "dresses",
      "Coats & Puffers": "coatsPuffers",
      Nightwear: "nightwear",
      Shoes: "shoes",
      Activewear: "activewear",
    };
    const key = categoryMap[category] || category.toLowerCase();
    try {
      return tCategories(key);
    } catch {
      return category;
    }
  };

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

          {/* Sold Out / Sale Badges */}
          {product.isSoldOut && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs rounded font-medium">
              {t("soldOut")}
            </div>
          )}
          {product.isOnSale && !product.isSoldOut && (
            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-[#EE353B] text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs rounded font-medium">
              {t("sale")}
            </div>
          )}

          {/* Small Add to Cart Button on bottom-left */}
          {/* Small Add to Cart Button on bottom-left */}
          {!product.isSoldOut && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="absolute bottom-2 left-2 bg-white text-[#2E294E] p-2 hover:bg-white transition-colors shadow-md flex items-center justify-center"
              aria-label="Add to Cart"
            >
              {/* Shopping Bag SVG */}
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M34.2129 13.7872V13.3787C34.2129 7.96398 29.8234 3.57447 24.4086 3.57447H23.5916C18.1769 3.57447 13.7874 7.96398 13.7874 13.3787V13.7872"
                  stroke="currentColor"
                  strokeWidth="2.04255"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.5745 12.766H2.55322V13.7872V44.4255V45.4468H3.5745H26V43.4043H4.59578V14.8085H43.4043V27H45.4468V13.7872V12.766H44.4256H3.5745Z"
                  fill="currentColor"
                />
                <line
                  x1="36"
                  y1="29"
                  x2="36"
                  y2="43"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="29"
                  y1="36"
                  x2="43"
                  y2="36"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Product Name and Price */}
        <div className="mt-3 sm:mt-4">
          {product.brand && (
            <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
          )}
          <h3 className="text-base sm:text-lg font-light mb-1.5 sm:mb-2">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-xs text-gray-400 mb-2">
              {getCategoryTranslation(product.category)}
            </p>
          )}
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            {originalPrice && (
              <span className="text-gray-400 line-through text-xs sm:text-sm">
                ALL {originalPrice.toFixed(2)}
              </span>
            )}
            <span
              className={`text-base sm:text-lg font-medium ${
                product.isOnSale ? "text-[#EE353B]" : "text-black"
              }`}
            >
              ALL {displayPrice.toFixed(2)}
            </span>
          </div>
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
