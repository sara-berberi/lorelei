"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface MobileMenuProps {
  locale: string;
}

export default function MobileMenu({ locale }: MobileMenuProps) {
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const menu = isOpen ? (
    <div style={{ position: "fixed", inset: 0, zIndex: 99999 }}>
      {/* Backdrop */}
      <div
        onClick={closeMenu}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
      />

      {/* Drawer */}
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "288px",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: "64px",
          borderBottom: "1px solid #f3f4f6",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", color: "#9ca3af" }}>
            Menu
          </span>
          <button onClick={closeMenu} style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <ul style={{ padding: "32px 24px", listStyle: "none", margin: 0 }}>
          {[
            { label: t("home"), href: `/${locale}`, onClick: closeMenu },
            {
              label: t("products"),
              href: `/${locale}`,
              onClick: () => { sessionStorage.removeItem("selectedBrand"); closeMenu(); scrollToProducts(); },
            },
            { label: t("brands"), href: `/${locale}/brands`, onClick: closeMenu },
            { label: t("mysteryBox"), href: `/${locale}/mystery-box`, onClick: closeMenu },
            { label: t("specialPrices"), href: `/${locale}/special-prices`, onClick: closeMenu, red: true },
            { label: "Admin", href: `/${locale}/admin`, onClick: closeMenu },
          ].map(({ label, href, onClick, red }: { label: string; href: string; onClick: () => void; red?: boolean }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={onClick}
                style={{
                  display: "block",
                  padding: "12px 0",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: red ? "#fb7185" : "#4b5563",
                  textDecoration: "none",
                  borderBottom: "1px solid #f9fafb",
                }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  ) : null;

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

      {mounted && createPortal(menu, document.body)}
    </>
  );
}
