"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/CartContext";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const t = useTranslations("cart");
  const tCategories = useTranslations("categories");
  const { items, isOpen, setIsOpen, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const getCategoryTranslation = (category: string | null): string => {
    if (!category) return "";
    const map: Record<string, string> = { Tops: "tops", Bottoms: "bottoms", Dresses: "dresses", Coats: "coatsPuffers", Nightwear: "nightwear", Shoes: "shoes", Activewear: "activewear" };
    try { return tCategories(map[category] || category.toLowerCase()); } catch { return category; }
  };

  const getFirstImage = (imageUrl: string): string => {
    try {
      const parsed = JSON.parse(imageUrl);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
    } catch {}
    return imageUrl;
  };

  const checkoutItems = items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.isOnSale && item.salePrice ? item.salePrice : item.price,
    name: item.name,
    size: item.size || "N/A",
  }));

  return (
    <>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 h-16 sm:h-20 border-b border-gray-100">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">{t("cart")}</p>
                {items.length > 0 && (
                  <p className="text-[11px] text-gray-400 mt-0.5">{items.length} {items.length === 1 ? "item" : "items"}</p>
                )}
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Close">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg className="w-10 h-10 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-sm text-gray-400 font-light">{t("emptyCart")}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => {
                    const price = item.isOnSale && item.salePrice ? item.salePrice : item.price;
                    return (
                      <div key={item.id} className="flex gap-4">
                        {/* Image */}
                        <div className="w-20 h-24 bg-gray-50 overflow-hidden flex-shrink-0">
                          <img src={getFirstImage(item.imageUrl)} alt={item.name} className="w-full h-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            {item.brand && <p className="text-[10px] text-gray-400 tracking-wider mb-0.5">{item.brand}</p>}
                            <p className="text-sm font-light text-gray-900 truncate leading-snug">{item.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 tracking-wide">
                              {t("size")}: {item.size}
                              {item.category && <> · {getCategoryTranslation(item.category)}</>}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Qty controls */}
                            <div className="flex items-center gap-3">
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 border border-gray-200 text-gray-500 hover:border-gray-500 hover:text-gray-900 transition-colors text-sm flex items-center justify-center">
                                −
                              </button>
                              <span className="text-xs text-gray-700 w-4 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 border border-gray-200 text-gray-500 hover:border-gray-500 hover:text-gray-900 transition-colors text-sm flex items-center justify-center">
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="text-sm text-gray-900">ALL {(price * item.quantity).toFixed(0)}</p>
                              {item.isOnSale && (
                                <p className="text-[10px] text-gray-400 line-through">ALL {(item.price * item.quantity).toFixed(0)}</p>
                              )}
                            </div>
                          </div>

                          <button onClick={() => removeFromCart(item.id)} className="text-[10px] text-gray-300 hover:text-gray-600 tracking-widest uppercase mt-1 text-left transition-colors">
                            {t("remove")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-gray-100 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400">{t("total")}</span>
                  <span className="text-lg font-light text-gray-900">ALL {getTotalPrice().toFixed(0)}</span>
                </div>
                <button
                  onClick={() => { setIsOpen(false); setTimeout(() => setShowCheckout(true), 100); }}
                  className="w-full bg-[#1a0a20] text-white py-4 text-[11px] tracking-[0.25em] uppercase font-light hover:bg-black transition-colors"
                >
                  {t("checkout")}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          cartItems={checkoutItems}
          totalPrice={getTotalPrice()}
          postalFee={200}
          onClose={() => setShowCheckout(false)}
          onOrderSuccess={() => { clearCart(); setShowCheckout(false); }}
        />
      )}
    </>
  );
}
