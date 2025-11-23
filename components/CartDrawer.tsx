"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "@/contexts/CartContext";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer() {
  const t = useTranslations("cart");
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <>
      {/* Cart Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white z-50 shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 sm:p-6 border-b">
              <h2 className="text-xl font-light">{t("cart")}</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
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
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">{t("emptyCart")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => {
                    const price =
                      item.isOnSale && item.salePrice
                        ? item.salePrice
                        : item.price;
                    // Get first image if imageUrl is a JSON array
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
                    const displayImage = getFirstImage(item.imageUrl);

                    return (
                      <div key={item.id} className="flex gap-4 pb-4 border-b">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={displayImage}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {t("size")}:{" "}
                            <span className="font-medium">{item.size}</span>
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                −
                              </button>
                              <span className="w-8 text-center text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-6 h-6 border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                ALL {(price * item.quantity).toFixed(2)}
                              </p>
                              {item.isOnSale && (
                                <p className="text-xs text-gray-400 line-through">
                                  ALL {(item.price * item.quantity).toFixed(2)}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-gray-500 hover:text-gray-700 mt-2"
                          >
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
              <div className="border-t p-4 sm:p-6 space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>{t("total")}:</span>
                  <span>ALL {getTotalPrice().toFixed(2)}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                    // Small delay to ensure cart drawer closes before modal opens
                    setTimeout(() => {
                      setShowCheckout(true);
                    }, 100);
                  }}
                  className="w-full bg-black text-white py-3 px-4 font-medium hover:bg-gray-800 transition-colors"
                >
                  {t("checkout")}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Modal - rendered outside drawer for proper z-index */}
      {showCheckout && (
        <CheckoutModal
          cartItems={items}
          onClose={() => {
            setShowCheckout(false);
          }}
          onOrderSuccess={() => {
            clearCart();
            setShowCheckout(false);
          }}
        />
      )}
    </>
  );
}
