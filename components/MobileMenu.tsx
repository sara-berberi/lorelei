"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface MobileMenuProps {
  locale: string;
}

export default function MobileMenu({ locale }: MobileMenuProps) {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  const scrollToProducts = () => {
    setTimeout(() => {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        onClick={() => setIsOpen(true)}
        className="sm:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
        aria-label="Open menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
          onClick={closeMenu}
        />
      )}

      {/* Drawer */}
      <nav
        className={`fixed top-0 left-0 h-full w-72 bg-white z-[9999] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">Menu</p>
          <button onClick={closeMenu} className="text-gray-400 hover:text-gray-900 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <ul className="px-6 py-8 space-y-1">
          {[
            { label: t("home"), href: `/${locale}`, onClick: closeMenu },
            {
              label: t("products"),
              href: `/${locale}`,
              onClick: () => {
                sessionStorage.removeItem("selectedBrand");
                closeMenu();
                scrollToProducts();
              },
            },
            { label: t("brands"), href: `/${locale}/brands`, onClick: closeMenu },
            { label: t("mysteryBox"), href: `/${locale}/mystery-box`, onClick: closeMenu },
            { label: "Admin", href: `/${locale}/admin`, onClick: closeMenu },
          ].map(({ label, href, onClick }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={onClick}
                className="block py-3 text-[11px] tracking-[0.2em] uppercase text-gray-600 hover:text-gray-900 border-b border-gray-50 transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
