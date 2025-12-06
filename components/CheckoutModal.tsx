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
  // const [fullName, setFullName] = useState("");
  // const [instagramUsername, setInstagramUsername] = useState("");
  // const [address, setAddress] = useState("");
  // const [city, setCity] = useState("");
  // const [phoneNumber, setPhoneNumber] = useState("");
  // const [notes, setNotes] = useState("");

  // const [loading, setLoading] = useState(false);
  const totalPriceWithPostalFee = totalPrice + postalFee;

  const t = useTranslations("cart");

  if (!isOpen) return null;

  // const handleSubmit = async () => {
  //   if (!fullName || !instagramUsername || !address || !city || !phoneNumber) {
  //     alert("Please fill in all required fields.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     // Transform cart items to ensure productId is included
  //     const productsForOrder = cartItems.map((item) => ({
  //       productId: Number(item.productId), // Ensure it's a number
  //       quantity: Number(item.quantity || 1), // Ensure it's a number with fallback
  //       price: Number(item.price), // Ensure it's a number
  //     }));

  //     // Log for debugging
  //     console.log("Cart items received:", cartItems);
  //     console.log("Products being sent:", productsForOrder);
  //     console.log("Full request body:", {
  //       fullName,
  //       instagramUsername,
  //       address,
  //       city,
  //       phoneNumber,
  //       products: productsForOrder,
  //       totalPrice: Number(totalPrice),
  //       postalFee: Number(postalFee),
  //       totalPriceWithPostalFee: Number(totalPriceWithPostalFee),
  //       notes: notes || undefined,
  //     });

  //     // Validate that all productIds are present and valid
  //     const invalidProducts = productsForOrder.filter(
  //       (p) => !p.productId || isNaN(p.productId)
  //     );
  //     if (invalidProducts.length > 0) {
  //       console.error("Invalid products found:", invalidProducts);
  //       alert(
  //         "Error: Some products are missing IDs. Please refresh and try again."
  //       );
  //       setLoading(false);
  //       return;
  //     }

  //     const res = await fetch("/api/orders", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         fullName,
  //         instagramUsername,
  //         address,
  //         city,
  //         phoneNumber,
  //         products: productsForOrder,
  //         totalPrice: Number(totalPrice),
  //         postalFee: Number(postalFee),
  //         totalPriceWithPostalFee: Number(totalPriceWithPostalFee),
  //         notes: notes || undefined,
  //       }),
  //     });

  //     const data = await res.json();

  //     if (!res.ok) {
  //       console.error("Order creation failed:", data);
  //       alert("❌ Failed: " + (data.error || "Unknown error"));
  //       return;
  //     }

  //     alert("✅ Order created successfully!");

  //     // Reset form
  //     setFullName("");
  //     setInstagramUsername("");
  //     setAddress("");
  //     setCity("");
  //     setPhoneNumber("");
  //     setNotes("");

  //     onOrderSuccess();
  //     onClose();
  //   } catch (error) {
  //     console.error("Order submission error:", error);
  //     alert("Something went wrong. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-gray-100">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
          >
            ✕
          </button>
          <h2 className="text-3xl font-bold text-gray-900">Checkout</h2>
          <p className="text-sm text-gray-500 mt-1">{t("completeOrder")}</p>
        </div>

        {/* Content */}
        <div className="px-8 py-8 overflow-y-auto flex-1">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
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

          {/* Instagram DM Notice */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-purple-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Web Checkout Temporarily Unavailable
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We are currently working to fix our web checkout system. In the
              meantime, please send us a message on Instagram with your order
              details and shipping information.
            </p>
            <a
              href="https://instagram.com/lorelei_boutique"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
              </svg>
              Send Message on Instagram
            </a>
          </div>

          {/* Form fields - COMMENTED OUT */}
          {/* <div className="space-y-5">
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
          </div> */}
        </div>

        {/* Footer - COMMENTED OUT */}
        {/* <div className="px-8 py-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
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
        </div> */}
      </div>
    </div>
  );
}
