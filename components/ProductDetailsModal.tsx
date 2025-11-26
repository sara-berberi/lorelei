"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  sizes: string | null; // JSON string
  category: string | null;
  brand: string | null;
  isSoldOut: boolean;
  isOnSale: boolean;
}

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
}: ProductDetailsModalProps) {
  const t = useTranslations("product");
  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const tCategories = useTranslations("categories");
  const { addToCart } = useCart();

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

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Parse sizes from JSON string or use default
  const availableSizes = (() => {
    if (!product.sizes) return ["S", "M", "L", "XL"];
    try {
      const parsed = JSON.parse(product.sizes);
      return Array.isArray(parsed) && parsed.length > 0
        ? parsed
        : ["S", "M", "L", "XL"];
    } catch {
      return ["S", "M", "L", "XL"];
    }
  })();

  // Parse images - support both single image URL and JSON array of URLs
  const images = (() => {
    try {
      // Try to parse as JSON array first (for multiple images)
      const parsed = JSON.parse(product.imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as string[];
      }
    } catch {
      // If parsing fails, it's a single image URL string
    }
    // Fallback to single image
    return [product.imageUrl];
  })();

  const displayPrice =
    product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const originalPrice =
    product.isOnSale && product.salePrice ? product.price : null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert(t("selectSize"));
      return;
    }
    addToCart(product, selectedSize);
    onClose();
  };

  // Swipe handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-[#2E294E] bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image Carousel */}
            <div className="relative aspect-square bg-gray-100 overflow-hidden">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[currentImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  />

                  {/* Carousel indicators */}
                  {images.length > 1 && (
                    <>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                        {images.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`w-2 h-2 rounded-full transition-all ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                            aria-label={`Go to image ${index + 1}`}
                          />
                        ))}
                      </div>

                      {/* Navigation arrows */}
                      {currentImageIndex > 0 && (
                        <button
                          onClick={() =>
                            setCurrentImageIndex(currentImageIndex - 1)
                          }
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                          aria-label="Previous image"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                      )}

                      {currentImageIndex < images.length - 1 && (
                        <button
                          onClick={() =>
                            setCurrentImageIndex(currentImageIndex + 1)
                          }
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                          aria-label="Next image"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6 sm:p-8 flex flex-col">
              <div className="flex-1">
                {/* Badges */}
                <div className="flex gap-2 mb-4">
                  {product.isSoldOut && (
                    <span className="bg-[#2E294E] text-white px-3 py-1 text-xs font-medium">
                      {t("soldOut")}
                    </span>
                  )}
                  {product.isOnSale && !product.isSoldOut && (
                    <span className="bg-red-500 text-white px-3 py-1 text-xs font-medium">
                      {t("sale")}
                    </span>
                  )}
                </div>

                {/* Brand and Category */}
                <div className="mb-2">
                  {product.brand && (
                    <p className="text-sm text-gray-500 mb-1">
                      {product.brand}
                    </p>
                  )}
                  {product.category && (
                    <p className="text-xs text-gray-400">
                      {getCategoryTranslation(product.category)}
                    </p>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-light mb-4">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="flex items-center gap-3 mb-6">
                  {originalPrice && (
                    <span className="text-gray-400 line-through text-lg">
                      ALL {originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span
                    className={`text-2xl font-medium ${
                      product.isOnSale ? "text-red-600" : "text-black"
                    }`}
                  >
                    ALL {displayPrice.toFixed(2)}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Size Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-3">
                    {t("selectSize")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={product.isSoldOut}
                        className={`px-4 py-2 border-2 transition-all text-sm font-medium rounded ${
                          selectedSize === size
                            ? "border-black bg-[#2E294E] text-white"
                            : product.isSoldOut
                            ? "border-gray-200 text-gray-400 cursor-not-allowed"
                            : "border-gray-300 hover:border-black"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.isSoldOut || !selectedSize}
                className={`w-full py-3 px-4 font-medium transition-colors ${
                  product.isSoldOut || !selectedSize
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed rounded"
                    : "bg-[#2E294E] text-white rounded hover:bg-gray-800"
                }`}
              >
                {product.isSoldOut ? t("soldOut") : tCart("addToCart")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
