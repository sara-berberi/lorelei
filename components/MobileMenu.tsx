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
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [brands, setBrands] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const [mobileBrands, setMobileBrands] = useState<string[]>([]);
  const [mobileCategories, setMobileCategories] = useState<string[]>([]);
  const [mobilePrice, setMobilePrice] = useState<[number, number]>([0, 50000]);

  // -----------------------------
  // Load brands/categories from API
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resBrands = await fetch("/api/brands");
        if (resBrands.ok) setBrands(await resBrands.json());

        const resCategories = await fetch("/api/categories");
        if (resCategories.ok) setCategories(await resCategories.json());
      } catch (err) {
        console.error("Failed loading dropdown data:", err);
      }
    };
    fetchData();
  }, []);

  // -----------------------------
  // Load saved filters from sessionStorage
  // -----------------------------
  useEffect(() => {
    const storedCategories = sessionStorage.getItem("selectedCategory");
    const storedBrands = sessionStorage.getItem("selectedBrand");
    const storedPriceMin = sessionStorage.getItem("priceMin");
    const storedPriceMax = sessionStorage.getItem("priceMax");

    if (storedCategories) setMobileCategories(JSON.parse(storedCategories));
    if (storedBrands) setMobileBrands(JSON.parse(storedBrands));
    if (storedPriceMin && storedPriceMax)
      setMobilePrice([Number(storedPriceMin), Number(storedPriceMax)]);
  }, []);

  // -----------------------------
  // Prevent body scroll when menu open
  // -----------------------------
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  // -----------------------------
  // Toggle checkboxes
  // -----------------------------
  const toggleMobileCategory = (category: string) => {
    setMobileCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleMobileBrand = (brand: string) => {
    setMobileBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // -----------------------------
  // Apply or Clear filters
  // -----------------------------
  const applyMobileFilters = () => {
    sessionStorage.setItem(
      "selectedCategory",
      JSON.stringify(mobileCategories)
    );
    sessionStorage.setItem("selectedBrand", JSON.stringify(mobileBrands));
    sessionStorage.setItem("priceMin", String(mobilePrice[0]));
    sessionStorage.setItem("priceMax", String(mobilePrice[1]));
    closeMenu();
    scrollToProducts();
  };

  const clearMobileFilters = () => {
    setMobileCategories([]);
    setMobileBrands([]);
    setMobilePrice([0, 50000]);
    sessionStorage.removeItem("selectedCategory");
    sessionStorage.removeItem("selectedBrand");
    sessionStorage.removeItem("priceMin");
    sessionStorage.removeItem("priceMax");
    closeMenu();
    scrollToProducts();
  };

  const closeMenu = () => {
    setIsOpen(false);
    setFiltersOpen(false);
  };

  const scrollToProducts = () => {
    setTimeout(() => {
      const productsSection = document.getElementById("products");
      if (productsSection)
        productsSection.scrollIntoView({ behavior: "smooth" });
    }, 150);
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <>
      {/* Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden text-3xl px-4"
      >
        ☰
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={closeMenu} />
      )}

      {/* Sidebar */}
      <nav
        className={`fixed top-0 right-0 h-full w-72 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button onClick={closeMenu} className="text-3xl p-4 hover:opacity-70">
          ×
        </button>

        <ul className="px-4 mt-2 space-y-1">
          {/* Home */}
          <li>
            <Link
              href={`/${locale}`}
              className="block px-4 py-3 text-base font-medium hover:bg-gray-100 rounded-md"
              onClick={closeMenu}
            >
              {t("home")}
            </Link>
          </li>

          {/* Products */}
          <li>
            <Link
              href={`/${locale}`}
              className="block px-4 py-3 text-base font-medium hover:bg-gray-100 rounded-md"
              onClick={() => {
                sessionStorage.removeItem("selectedCategory");
                sessionStorage.removeItem("selectedBrand");
                sessionStorage.removeItem("priceMin");
                sessionStorage.removeItem("priceMax");
                closeMenu();
                scrollToProducts();
              }}
            >
              {t("products")}
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
