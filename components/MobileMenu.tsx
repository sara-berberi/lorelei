"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown, X, Menu as MenuIcon } from "lucide-react";

interface MobileMenuProps {
  locale: string;
}

/** Category values as stored on products, paired with their message key. */
const CATEGORIES = [
  { value: "dresses", key: "dresses" },
  { value: "tops", key: "tops" },
  { value: "bottoms", key: "bottoms" },
  { value: "sets", key: "sets" },
  { value: "coatsPuffers", key: "coatsPuffers" },
  { value: "activewear", key: "activewear" },
  { value: "nightwear", key: "nightwear" },
  { value: "shoes", key: "shoes" },
];

export default function MobileMenu({ locale }: MobileMenuProps) {
  const t = useTranslations("common");
  const tCategories = useTranslations("categories");

  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  /** Play the exit animation before unmounting. */
  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
      setCategoriesOpen(false);
    }, 220);
  };

  const scrollToProducts = () => {
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 260);
  };

  /** Hand the chosen category to ProductGrid, then jump to the grid. */
  const goToCategory = (value: string) => {
    sessionStorage.setItem("selectedCategory", value);
    sessionStorage.removeItem("selectedBrand");
    closeMenu();
    scrollToProducts();
  };

  const linkCls =
    "flex items-center justify-between w-full py-3.5 text-[11px] tracking-[0.2em] uppercase text-gray-600 hover:text-gray-900 transition-colors border-b border-gray-50";

  const menu =
    isOpen && mounted ? (
      <div className="fixed inset-0 z-[99999]">
        {/* Backdrop */}
        <div
          onClick={closeMenu}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm ${
            closing ? "animate-menuFadeOut" : "animate-menuFadeIn"
          }`}
        />

        {/* Drawer */}
        <nav
          className={`absolute inset-y-0 left-0 w-[300px] max-w-[85vw] bg-white flex flex-col shadow-[4px_0_32px_rgba(0,0,0,0.14)] ${
            closing ? "animate-menuOut" : "animate-menuIn"
          }`}
          aria-label="Main menu"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 flex-shrink-0">
            <span className="text-[10px] tracking-[0.3em] uppercase text-gray-400">
              Menu
            </span>
            <button
              onClick={closeMenu}
              aria-label="Close menu"
              className="text-gray-400 hover:text-gray-900 transition-colors p-1 -m-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6">
            <Link href={`/${locale}`} onClick={closeMenu} className={linkCls}>
              {t("home")}
            </Link>

            {/* Products + expandable categories */}
            <div>
              <button
                onClick={() => setCategoriesOpen((v) => !v)}
                aria-expanded={categoriesOpen}
                className={linkCls}
              >
                {t("products")}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Submenu — animates its height so it feels like it unfolds. */}
              <div
                className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
                style={{
                  maxHeight: categoriesOpen ? `${(CATEGORIES.length + 1) * 44}px` : "0px",
                  opacity: categoriesOpen ? 1 : 0,
                }}
              >
                <div className="pl-3 border-l border-gray-100 ml-1 my-1">
                  <button
                    onClick={() => {
                      sessionStorage.removeItem("selectedCategory");
                      sessionStorage.removeItem("selectedBrand");
                      closeMenu();
                      scrollToProducts();
                    }}
                    className="block w-full text-left py-2.5 text-[11px] tracking-[0.15em] uppercase text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    {t("allProducts")}
                  </button>
                  {CATEGORIES.map(({ value, key }) => (
                    <button
                      key={value}
                      onClick={() => goToCategory(value)}
                      className="block w-full text-left py-2.5 text-[11px] tracking-[0.15em] uppercase text-gray-500 hover:text-gray-900 transition-colors"
                    >
                      {tCategories(key)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Link href={`/${locale}/brands`} onClick={closeMenu} className={linkCls}>
              {t("brands")}
            </Link>
            <Link href={`/${locale}/reviews`} onClick={closeMenu} className={linkCls}>
              {t("reviews")}
            </Link>
            <Link
              href={`/${locale}/special-prices`}
              onClick={closeMenu}
              className={`${linkCls} !text-rose-400 hover:!text-rose-600`}
            >
              {t("specialPrices")}
            </Link>
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 border-t border-gray-100 px-6 py-5 space-y-4">
            <a
              href="https://www.instagram.com/lorelei_boutique/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @lorelei_boutique
            </a>
            <Link
              href={`/${locale}/admin`}
              onClick={closeMenu}
              className="block text-[10px] tracking-[0.2em] uppercase text-gray-300 hover:text-gray-600 transition-colors"
            >
              Admin
            </Link>
          </div>
        </nav>

        <style jsx global>{`
          @keyframes menuIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @keyframes menuOut {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          @keyframes menuFadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes menuFadeOut { from { opacity: 1; } to { opacity: 0; } }
          .animate-menuIn { animation: menuIn 0.28s cubic-bezier(0.32, 0.72, 0, 1); }
          .animate-menuOut { animation: menuOut 0.22s cubic-bezier(0.32, 0.72, 0, 1) forwards; }
          .animate-menuFadeIn { animation: menuFadeIn 0.28s ease; }
          .animate-menuFadeOut { animation: menuFadeOut 0.22s ease forwards; }
          @media (prefers-reduced-motion: reduce) {
            .animate-menuIn, .animate-menuOut,
            .animate-menuFadeIn, .animate-menuFadeOut { animation: none; }
          }
        `}</style>
      </div>
    ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 -ml-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <MenuIcon className="w-5 h-5" />
      </button>

      {mounted && createPortal(menu, document.body)}
    </>
  );
}
