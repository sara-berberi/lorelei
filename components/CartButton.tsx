"use client";

import { useCart } from "@/contexts/CartContext";
import { useTranslations } from "next-intl";

export default function CartButton() {
  const { getTotalItems, setIsOpen } = useCart();
  const t = useTranslations("cart");
  const itemCount = getTotalItems();

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative p-1.5 text-gray-700 hover:text-gray-900 transition-colors"
      aria-label={t("cart")}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-[#1a0a20] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center leading-none font-light">
          {itemCount > 9 ? "9+" : itemCount}
        </span>
      )}
    </button>
  );
}
