"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

interface ProductItem {
  productId: number;
  quantity: number;
  price: number;
  name?: string;
  size?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: ProductItem[];
  totalPrice: number;
  postalFee: number;
  onOrderSuccess: () => void;
}

const inputCls = "w-full border-0 border-b border-gray-200 bg-transparent px-0 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:border-gray-700 transition-colors";
const labelCls = "block text-[10px] tracking-[0.2em] uppercase text-gray-400 mb-1.5";

export default function CheckoutModal({ isOpen, onClose, cartItems, totalPrice, postalFee, onOrderSuccess }: CheckoutModalProps) {
  const [fullName, setFullName] = useState("");
  const [instagramUsername, setInstagramUsername] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const t = useTranslations("cart");
  const totalWithFee = totalPrice + postalFee;

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError("");
    if (!fullName || !instagramUsername || !address || !city || !phoneNumber) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setLoading(true);
      const products = cartItems.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity || 1),
        price: Number(item.price),
        size: item.size || "N/A",
      }));

      if (products.length === 0) { setError("Your cart is empty."); return; }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName, instagramUsername, address, city, phoneNumber,
          products,
          totalPrice: Number(totalPrice),
          postalFee: Number(postalFee),
          totalPriceWithPostalFee: Number(totalWithFee),
          notes: notes || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }

      setFullName(""); setInstagramUsername(""); setAddress(""); setCity(""); setPhoneNumber(""); setNotes("");
      onOrderSuccess();
      onClose();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/25 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-6">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-none max-h-[95vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-base font-light tracking-wide text-gray-900">Checkout</h2>
            <p className="text-[10px] tracking-widest uppercase text-gray-400 mt-0.5">{t("completeOrder")}</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">

          {/* Order summary */}
          <section>
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 mb-5">{t("orderSummary")}</p>
            <div className="space-y-3">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <span className="text-sm text-gray-600 font-light flex-1 truncate pr-4">
                    {item.name ?? `Product #${item.productId}`}
                    <span className="text-gray-400"> × {item.quantity}</span>
                  </span>
                  <span className="text-sm text-gray-900 flex-shrink-0">
                    {(item.price * item.quantity).toFixed(0)} Lek
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span className="tracking-wide">{t("subtotal")}</span>
                <span>{totalPrice.toFixed(0)} Lek</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span className="tracking-wide">{t("shippingFee")}</span>
                <span>{postalFee} Lek</span>
              </div>
              <div className="flex justify-between text-sm text-gray-900 font-light pt-2 border-t border-gray-100">
                <span className="tracking-wide">{t("total")}</span>
                <span>{totalWithFee.toFixed(0)} Lek</span>
              </div>
            </div>
          </section>

          {/* Customer info */}
          <section className="space-y-7">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">Your Details</p>
            <div>
              <label className={labelCls}>{t("name")} *</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Instagram *</label>
              <input type="text" value={instagramUsername} onChange={(e) => setInstagramUsername(e.target.value)} placeholder="@username" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("phoneNumber")} *</label>
              <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+355 69 000 0000" className={inputCls} />
            </div>
          </section>

          {/* Shipping */}
          <section className="space-y-7">
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">{t("shippingAddress")}</p>
            <div>
              <label className={labelCls}>{t("streetAddress")} *</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("city")} *</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Tirana" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("orderNotes")}</label>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full border border-gray-100 bg-transparent px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-300 transition-colors resize-none font-light" />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 space-y-3">
          {error && <p className="text-[11px] text-rose-500 tracking-wide">{error}</p>}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#1a0a20] text-white py-4 text-[11px] tracking-[0.25em] uppercase font-light hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                {t("processing")}
              </span>
            ) : t("confirmOrder")}
          </button>
        </div>
      </div>
    </div>
  );
}
