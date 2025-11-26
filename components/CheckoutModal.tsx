"use client";

import { useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { albanianCities } from "@/lib/albanian-cities";
import { CartItem } from "@/contexts/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice: number | null;
  isOnSale: boolean;
}

interface CheckoutModalProps {
  product?: Product;
  cartItems?: CartItem[];
  onClose: () => void;
  onOrderSuccess?: () => void;
}

const POSTAL_FEE = 200; // Fixed postal fee in euros

export default function CheckoutModal({
  product,
  cartItems,
  onClose,
  onOrderSuccess,
}: CheckoutModalProps) {
  const t = useTranslations("checkout");
  const tOrder = useTranslations("order");
  const tCart = useTranslations("cart");
  const tCategories = useTranslations("categories");
  const router = useRouter();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Determine if this is a cart checkout or single product checkout
  const isCartCheckout = !!cartItems && cartItems.length > 0;

  // Calculate totals
  const totalPrice = isCartCheckout
    ? cartItems.reduce((sum, item) => {
        const price =
          item.isOnSale && item.salePrice ? item.salePrice : item.price;
        return sum + price * item.quantity;
      }, 0)
    : product?.isOnSale && product?.salePrice
    ? product.salePrice
    : product?.price || 0;

  const totalWithFee = totalPrice + POSTAL_FEE;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const fullName = `${formData.get("name")} ${formData.get("surname")}`;
    const instagramUsername = formData.get("instagramUsername");
    const address = formData.get("address");
    const city = formData.get("city");
    const phoneNumber = formData.get("phoneNumber");
    const notes = formData.get("notes") || null;

    try {
      if (isCartCheckout && cartItems) {
        // Create one order per cart item
        const orderPromises = cartItems.map(async (item) => {
          const itemPrice =
            item.isOnSale && item.salePrice ? item.salePrice : item.price;
          const itemTotal = itemPrice * item.quantity;
          const itemTotalWithFee = itemTotal + POSTAL_FEE;

          const orderData = {
            fullName,
            instagramUsername,
            address,
            city,
            phoneNumber,
            productId: item.productId,
            totalPrice: itemTotal,
            postalFee: POSTAL_FEE,
            totalPriceWithPostalFee: itemTotalWithFee,
            notes: notes
              ? `${notes} | Size: ${item.size}, Qty: ${item.quantity}`
              : `Size: ${item.size}, Qty: ${item.quantity}`,
          };

          return fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
          });
        });

        const responses = await Promise.all(orderPromises);
        const allSuccessful = responses.every((res) => res.ok);

        if (allSuccessful) {
          setShowSuccess(true);
          if (onOrderSuccess) {
            onOrderSuccess(); // Clear cart
          }
          setTimeout(() => {
            onClose();
            router.refresh();
          }, 3000);
        } else {
          alert("Error submitting some orders. Please try again.");
        }
      } else if (product) {
        // Single product checkout
        const orderData = {
          fullName,
          instagramUsername,
          address,
          city,
          phoneNumber,
          productId: product.id,
          totalPrice: totalPrice,
          postalFee: POSTAL_FEE,
          totalPriceWithPostalFee: totalWithFee,
          notes: notes || null,
        };

        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          setShowSuccess(true);
          setTimeout(() => {
            onClose();
            router.refresh();
          }, 3000);
        } else {
          alert("Error submitting order. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center">
          <div className="text-3xl mb-3">✓</div>
          <p className="text-base mb-4">{tOrder("success")}</p>
          <button
            onClick={onClose}
            className="bg-black text-white px-5 py-2 text-sm hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-lg w-full my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl font-light">{t("title")}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl sm:text-3xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Product/Cart Summary */}
        {isCartCheckout && cartItems ? (
          <div className="mb-4 sm:mb-5 p-3 bg-gray-50 rounded max-h-40 overflow-y-auto">
            <p className="font-medium text-sm sm:text-base mb-2">
              {t("orderSummary")}
            </p>
            <div className="space-y-2">
              {cartItems.map((item) => {
                const itemPrice =
                  item.isOnSale && item.salePrice ? item.salePrice : item.price;
                return (
                  <div
                    key={item.id}
                    className="flex justify-between text-xs sm:text-sm"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        {item.brand && (
                          <span className="text-gray-500 text-xs">
                            ({item.brand})
                          </span>
                        )}
                      </div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        {item.category && getCategoryTranslation(item.category)}
                        {item.category && item.size && " • "}
                        {item.size && `${tCart("size")}: ${item.size}`}
                        {" × "}
                        {item.quantity}
                      </div>
                    </div>
                    <span className="ml-2">
                      €{(itemPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : product ? (
          <div className="mb-4 sm:mb-5 p-3 bg-gray-50 rounded">
            <p className="font-medium text-sm sm:text-base mb-1">
              {product.name}
            </p>
            <p className="text-base sm:text-lg">ALL {totalPrice.toFixed(2)}</p>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-xs sm:text-sm font-medium mb-1"
              >
                {t("name")}
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black rounded"
              />
            </div>
            <div>
              <label
                htmlFor="surname"
                className="block text-xs sm:text-sm font-medium mb-1"
              >
                {t("surname")}
              </label>
              <input
                type="text"
                id="surname"
                name="surname"
                required
                className="w-full border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black rounded"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="instagramUsername"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              {t("instagramUsername")}
            </label>
            <input
              type="text"
              id="instagramUsername"
              name="instagramUsername"
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black rounded"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              {t("address")}
            </label>
            <input
              type="text"
              id="address"
              name="address"
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black rounded"
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              {t("city")}
            </label>
            <select
              id="city"
              name="city"
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black rounded"
            >
              <option value="">Select a city</option>
              {albanianCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              {t("phoneNumber")}
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              required
              className="w-full border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black rounded"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="block text-xs sm:text-sm font-medium mb-1"
            >
              {t("notes")}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              className="w-full border border-gray-300 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-black rounded resize-none"
            />
          </div>

          <div className="border-t pt-3 sm:pt-4 space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span>{t("totalPrice")}:</span>
              <span>ALL {totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs sm:text-sm">
              <span>{t("postalFee")}:</span>
              <span>ALL {POSTAL_FEE.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-sm sm:text-base pt-2 border-t">
              <span>{t("totalWithFee")}:</span>
              <span>ALL {totalWithFee.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2.5 sm:py-3 px-4 text-sm sm:text-base font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed rounded transition-colors"
          >
            {isSubmitting ? "Submitting..." : t("confirmOrder")}
          </button>
        </form>
      </div>
    </div>
  );
}
