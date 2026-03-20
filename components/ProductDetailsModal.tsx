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
  sizes: string | null;
  category: string | null;
  brand: string | null;
  isSoldOut: boolean;
  isOnSale: boolean;
}

export default function ProductDetailsModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const t = useTranslations("product");
  const tCart = useTranslations("cart");
  const tCategories = useTranslations("categories");
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [added, setAdded] = useState(false);

  const getCategoryLabel = (category: string | null) => {
    if (!category) return "";
    const map: Record<string, string> = { Tops: "tops", Bottoms: "bottoms", Dresses: "dresses", Coats: "coatsPuffers", Nightwear: "nightwear", Shoes: "shoes", Activewear: "activewear" };
    try { return tCategories(map[category] || category.toLowerCase()); } catch { return category; }
  };

  const availableSizes = (() => {
    if (!product.sizes) return [];
    try {
      const parsed = JSON.parse(product.sizes);
      return Array.isArray(parsed) ? parsed : [];
    } catch { return []; }
  })();

  const images = (() => {
    try {
      const parsed = JSON.parse(product.imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as string[];
    } catch {}
    return [product.imageUrl];
  })();

  const displayPrice = product.isOnSale && product.salePrice ? product.salePrice : product.price;
  const originalPrice = product.isOnSale && product.salePrice ? product.price : null;

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize);
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 800);
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const d = touchStart - touchEnd;
    if (d > 50 && currentImageIndex < images.length - 1) setCurrentImageIndex(i => i + 1);
    if (d < -50 && currentImageIndex > 0) setCurrentImageIndex(i => i - 1);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-4xl max-h-[94vh] overflow-y-auto shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 text-gray-400 hover:text-gray-900 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">

          {/* ── Images ── */}
          <div
            className="relative aspect-[3/4] bg-[#f7f6f4] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 0 ? (
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[10px] tracking-widest uppercase text-gray-300">No Image</span>
              </div>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImageIndex(i)}
                    className={`rounded-full transition-all duration-300 ${i === currentImageIndex ? "w-5 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50"}`}
                  />
                ))}
              </div>
            )}

            {/* Arrow navigation */}
            {images.length > 1 && currentImageIndex > 0 && (
              <button onClick={() => setCurrentImageIndex(i => i - 1)} className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
            )}
            {images.length > 1 && currentImageIndex < images.length - 1 && (
              <button onClick={() => setCurrentImageIndex(i => i + 1)} className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            )}
          </div>

          {/* ── Details ── */}
          <div className="flex flex-col p-8 sm:p-10">

            {/* Brand + category */}
            <div className="mb-5">
              {product.brand && (
                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 mb-1">{product.brand}</p>
              )}
              {product.category && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-gray-300">{getCategoryLabel(product.category)}</p>
              )}
            </div>

            {/* Name */}
            <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900 leading-tight mb-6">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6 pb-6 border-b border-gray-100">
              <span className="text-2xl font-light text-gray-900">
                ALL {displayPrice.toFixed(0)}
              </span>
              {originalPrice && (
                <span className="text-base text-gray-400 line-through font-light">
                  ALL {originalPrice.toFixed(0)}
                </span>
              )}
              {product.isOnSale && !product.isSoldOut && (
                <span className="ml-auto text-[9px] tracking-[0.2em] uppercase text-gray-500 border border-gray-200 px-2.5 py-1">
                  Sale
                </span>
              )}
              {product.isSoldOut && (
                <span className="ml-auto text-[9px] tracking-[0.2em] uppercase text-gray-500 border border-gray-200 px-2.5 py-1">
                  Sold Out
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-gray-500 font-light leading-relaxed mb-8">
                {product.description}
              </p>
            )}

            {/* Size selection */}
            {availableSizes.length > 0 && (
              <div className="mb-8">
                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mb-3">
                  {t("selectSize")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => !product.isSoldOut && setSelectedSize(size)}
                      disabled={product.isSoldOut}
                      className={`min-w-[44px] h-10 px-3 border text-[11px] tracking-wider uppercase transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-gray-900 border-gray-900 text-white"
                          : product.isSoldOut
                          ? "border-gray-100 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 text-gray-700 hover:border-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-auto space-y-3">
              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.isSoldOut || !selectedSize || added}
                className={`w-full py-4 text-[11px] tracking-[0.3em] uppercase font-light transition-all duration-300 ${
                  added
                    ? "bg-gray-900 text-white"
                    : product.isSoldOut
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : !selectedSize
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
              >
                {added ? "Added ✓" : product.isSoldOut ? t("soldOut") : tCart("addToCart")}
              </button>

              {!selectedSize && !product.isSoldOut && (
                <p className="text-center text-[10px] tracking-wider text-gray-400">Please select a size</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
