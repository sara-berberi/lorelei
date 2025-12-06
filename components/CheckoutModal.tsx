"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ProductItem {
  productId: number;
  quantity: number;
  price: number;
  name?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ProductItem[];
  totalPrice: number;
  postalFee: number;
  onOrderSuccess: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  totalPrice,
  postalFee,
  onOrderSuccess,
}: CheckoutModalProps) {
  const [fullName, setFullName] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const totalPriceWithPostalFee = totalPrice + postalFee;

  const t = useTranslations("cart");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!fullName || !instagramUsername || !address || !city || !phoneNumber) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);

      // Transform cart items to ensure productId is included
      const productsForOrder = cartItems.map((item) => ({
        productId: Number(item.productId), // Ensure it's a number
        quantity: Number(item.quantity || 1), // Ensure it's a number with fallback
        price: Number(item.price), // Ensure it's a number
      }));

      // Log for debugging
      console.log("Cart items received:", cartItems);
      console.log("Products being sent:", productsForOrder);
      console.log("Full request body:", {
        fullName,
        instagramUsername,
        address,
        city,
        phoneNumber,
        products: productsForOrder,
        totalPrice: Number(totalPrice),
        postalFee: Number(postalFee),
        totalPriceWithPostalFee: Number(totalPriceWithPostalFee),
        notes: notes || undefined,
      });

      // Validate that all productIds are present and valid
      const invalidProducts = productsForOrder.filter(
        (p) => !p.productId || isNaN(p.productId)
      );
      if (invalidProducts.length > 0) {
        console.error("Invalid products found:", invalidProducts);
        alert(
          "Error: Some products are missing IDs. Please refresh and try again."
        );
        setLoading(false);
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          instagramUsername,
          address,
          city,
          phoneNumber,
          products: productsForOrder,
          totalPrice: Number(totalPrice),
          postalFee: Number(postalFee),
          totalPriceWithPostalFee: Number(totalPriceWithPostalFee),
          notes: notes || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Order creation failed:", data);
        alert("❌ Failed: " + (data.error || "Unknown error"));
        return;
      }

      alert("✅ Order created successfully!");

      // Reset form
      setFullName("");
      setInstagramUsername("");
      setAddress("");
      setCity("");
      setPhoneNumber("");
      setNotes("");

      onOrderSuccess();
      onClose();
    } catch (error) {
      console.error("Order submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <button
            disabled={loading}
            onClick={!loading ? onClose : undefined}
            className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all disabled:opacity-40"
          >
            ✕
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>
          <p className="text-sm text-gray-500 mt-1">{t("completeOrder")}</p>
        </div>

        {/* Scrollable Content */}
        <div className="px-8 py-6 overflow-y-auto flex-1">
          <div className="space-y-5">
            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("name")} *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagram Username *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                placeholder="@username"
                value={instagramUsername}
                onChange={(e) => setInstagramUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("phoneNumber")} *
              </label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                placeholder="+355 69 123 4567"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>

            {/* Shipping Information */}
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                {t("shippingAddress")}
              </h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("streetAddress")} *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("city")} *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                placeholder="Tirana"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("orderNotes")}
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none resize-none"
                placeholder={t("orderNotes")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">
                {t("orderSummary")}
              </h3>

              <div className="space-y-3">
                {cartItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm text-gray-700"
                  >
                    <span className="flex-1">
                      {item.name ?? `Product #${item.productId}`} ×{" "}
                      {item.quantity}
                    </span>
                    <span className="font-medium">
                      {item.price * item.quantity} Lek
                    </span>
                  </div>
                ))}

                <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t("subtotal")}</span>
                    <span>{totalPrice} Lek</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t("shippingFee")}</span>
                    <span>{postalFee} Lek</span>
                  </div>

                  <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-200">
                    <span>{t("total")}</span>
                    <span>{totalPriceWithPostalFee} Lek</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Button */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t("processing")}
              </span>
            ) : (
              t("confirmOrder")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
