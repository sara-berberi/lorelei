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
      Coats: "coatsPuffers",
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
    <>
      <div
        className="fixed inset-0 bg-[#25092E] bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="bg-white rounded-none max-w-5xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 bg-white/90 backdrop-blur-sm rounded-full p-2.5 hover:bg-white transition-all shadow-sm"
              aria-label="Close"
            >
              <svg
                className="w-5 h-5 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Image Carousel */}
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
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
                        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
                          {images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-1.5 h-1.5 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? "bg-white w-6"
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
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 transition-all shadow-sm"
                            aria-label="Previous image"
                          >
                            <svg
                              className="w-4 h-4 text-gray-800"
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
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-2 transition-all shadow-sm"
                            aria-label="Next image"
                          >
                            <svg
                              className="w-4 h-4 text-gray-800"
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
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-gray-300 text-sm tracking-wider">
                      NO IMAGE
                    </span>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-8 sm:p-10 lg:p-12 flex flex-col bg-white">
                <div className="flex-1">
                  {/* Brand - Handwriting Style */}
                  {product.brand && (
                    <p className="text-lg text-gray-800 mb-1 font-['Brush_Script_MT',_cursive] tracking-wide">
                      {product.brand}
                    </p>
                  )}

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl font-light tracking-tight mb-3 text-gray-900 leading-tight">
                    {product.name}
                  </h1>

                  {/* Category */}
                  {product.category && (
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-6 font-light">
                      {getCategoryTranslation(product.category)}
                    </p>
                  )}

                  {/* Badges */}
                  <div className="flex gap-2 mb-8">
                    {product.isSoldOut && (
                      <span className="bg-gray-900 text-white px-4 py-1.5 text-xs font-light tracking-wider uppercase">
                        {t("soldOut")}
                      </span>
                    )}
                    {product.isOnSale && !product.isSoldOut && (
                      <span className="bg-[#25092E] text-white px-4 py-1.5 text-xs font-light tracking-wider uppercase">
                        {t("sale")}
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3 mb-8 pb-6 border-b border-gray-100">
                    <span
                      className={`text-3xl font-light tracking-tight ${
                        product.isOnSale ? "text-gray-900" : "text-gray-900"
                      }`}
                    >
                      ALL {displayPrice.toFixed(2)}
                    </span>
                    {originalPrice && (
                      <span className="text-lg text-gray-400 line-through font-light">
                        ALL {originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-gray-600 mb-8 text-sm leading-loose font-light">
                      {product.description}
                    </p>
                  )}

                  {/* Size Selection */}
                  <div className="mb-10">
                    <label className="block text-xs font-light mb-4 uppercase tracking-widest text-gray-700">
                      {t("selectSize")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          disabled={product.isSoldOut}
                          className={`px-5 py-3 border transition-all text-sm font-light tracking-wide ${
                            selectedSize === size
                              ? "border-black bg-[#25092E] text-white"
                              : product.isSoldOut
                              ? "border-gray-200 text-gray-300 cursor-not-allowed"
                              : "border-gray-300 hover:border-black text-gray-900"
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
                  className={`w-full py-4 px-6 font-light tracking-widest uppercase text-sm transition-all ${
                    product.isSoldOut || !selectedSize
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-[#25092E] text-white hover:bg-gray-800"
                  }`}
                >
                  {product.isSoldOut ? t("soldOut") : tCart("addToCart")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Import handwriting-style font */
        @import url("https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600&display=swap");

        /* Apply to brand names for that chic, handwritten touch */
        .font-\[\'Brush_Script_MT\'\,_cursive\] {
          font-family: "Dancing Script", "Brush Script MT", cursive;
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
