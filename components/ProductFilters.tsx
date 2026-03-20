"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, SlidersHorizontal } from "lucide-react";

interface FilterOptions {
  categories: string[];
  brands: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
}

interface ProductFiltersProps {
  onFilterChange: (filters: {
    category: string; brand: string; size: string;
    minPrice: string; maxPrice: string;
    isOnSale?: boolean; isSoldOut?: boolean;
  }) => void;
  initialFilters?: {
    category?: string; brand?: string; size?: string;
    minPrice?: string; maxPrice?: string;
    isOnSale?: boolean; isSoldOut?: boolean;
  };
}

export default function ProductFilters({ onFilterChange, initialFilters }: ProductFiltersProps) {
  const t = useTranslations("filters");
  const tCategories = useTranslations("categories");

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ categories: [], brands: [], sizes: [], priceRange: { min: 0, max: 0 } });
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category || "all");
  const [selectedBrand, setSelectedBrand] = useState(initialFilters?.brand || "all");
  const [selectedSize, setSelectedSize] = useState(initialFilters?.size || "all");
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || "");
  const [isOnSale, setIsOnSale] = useState<boolean | undefined>(undefined);
  const [isSoldOut, setIsSoldOut] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    fetch("/api/products/filters")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setFilterOptions(d); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    onFilterChange({ category: selectedCategory, brand: selectedBrand, size: selectedSize, minPrice, maxPrice, isOnSale, isSoldOut });
  }, [selectedCategory, selectedBrand, selectedSize, minPrice, maxPrice, isOnSale, isSoldOut, onFilterChange]);

  const getCategoryLabel = (c: string) => {
    const map: Record<string, string> = { Tops: "tops", Bottoms: "bottoms", Dresses: "dresses", Coats: "coatsPuffers", Nightwear: "nightwear", Shoes: "shoes", Activewear: "activewear" };
    try { return tCategories(map[c] || c.toLowerCase()); } catch { return c; }
  };

  const handleClearAll = () => {
    setSelectedCategory("all"); setSelectedBrand("all"); setSelectedSize("all");
    setMinPrice(""); setMaxPrice(""); setIsOnSale(undefined); setIsSoldOut(undefined);
  };

  const hasActiveFilters = selectedCategory !== "all" || selectedBrand !== "all" || selectedSize !== "all" || minPrice !== "" || maxPrice !== "" || isOnSale !== undefined || isSoldOut !== undefined;

  if (loading) return null;

  // ── Shared select ──────────────────────────────────────────────────────────
  const Select = ({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { label: string; value: string }[] }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none bg-transparent border-0 border-b border-gray-200 text-[11px] tracking-widest uppercase text-gray-600 focus:outline-none focus:border-gray-600 transition-colors cursor-pointer py-1.5 pr-4 w-full"
    >
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const filterContent = (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400">{t("title")}</p>
        {hasActiveFilters && (
          <button onClick={handleClearAll} className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-900 transition-colors">
            {t("clearAll")}
          </button>
        )}
      </div>

      {filterOptions.categories.length > 0 && (
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-300 mb-2">{t("category")}</p>
          <Select value={selectedCategory} onChange={setSelectedCategory} options={[{ label: t("allCategories"), value: "all" }, ...filterOptions.categories.map((c) => ({ label: getCategoryLabel(c), value: c }))]} />
        </div>
      )}

      {filterOptions.brands.length > 0 && (
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-300 mb-2">{t("brand")}</p>
          <Select value={selectedBrand} onChange={setSelectedBrand} options={[{ label: t("allBrands"), value: "all" }, ...filterOptions.brands.map((b) => ({ label: b, value: b }))]} />
        </div>
      )}

      {filterOptions.sizes.length > 0 && (
        <div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-gray-300 mb-3">{t("size")}</p>
          <div className="flex flex-wrap gap-1.5">
            {["all", ...filterOptions.sizes].map((s) => (
              <button key={s} onClick={() => setSelectedSize(s)} className={`px-2.5 py-1 text-[10px] tracking-widest uppercase transition-all border ${selectedSize === s ? "bg-gray-900 text-white border-gray-900" : "text-gray-500 border-gray-200 hover:border-gray-500"}`}>
                {s === "all" ? t("allSizes") : s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div>
        <p className="text-[9px] tracking-[0.3em] uppercase text-gray-300 mb-3">{t("availability")}</p>
        <div className="space-y-2.5">
          {[
            { label: t("onSale"), active: isOnSale === true, toggle: () => setIsOnSale(isOnSale === true ? undefined : true) },
            { label: t("inStock"), active: isSoldOut === false, toggle: () => setIsSoldOut(isSoldOut === false ? undefined : false) },
            { label: t("soldOut"), active: isSoldOut === true, toggle: () => setIsSoldOut(isSoldOut === true ? undefined : true) },
          ].map(({ label, active, toggle }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer">
              <div onClick={toggle} className={`w-3.5 h-3.5 border transition-colors flex items-center justify-center ${active ? "bg-gray-900 border-gray-900" : "border-gray-300"}`}>
                {active && <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-[11px] tracking-wider uppercase text-gray-500">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-[9px] tracking-[0.3em] uppercase text-gray-300 mb-3">{t("price")}</p>
        <div className="flex items-center gap-3">
          <input type="number" placeholder={t("minPrice")} value={minPrice} min="0" onChange={(e) => setMinPrice(e.target.value)} className="flex-1 border-0 border-b border-gray-200 bg-transparent px-0 py-1.5 text-xs text-gray-600 placeholder-gray-300 focus:outline-none focus:border-gray-600 transition-colors w-0" />
          <span className="text-gray-300 text-xs flex-shrink-0">—</span>
          <input type="number" placeholder={t("maxPrice")} value={maxPrice} min="0" onChange={(e) => setMaxPrice(e.target.value)} className="flex-1 border-0 border-b border-gray-200 bg-transparent px-0 py-1.5 text-xs text-gray-600 placeholder-gray-300 focus:outline-none focus:border-gray-600 transition-colors w-0" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-[#1a0a20] text-white px-5 py-2.5 shadow-lg flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        {t("title")}
        {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-white/60" />}
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setMobileOpen(false)} />
          <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-xs bg-white z-50 overflow-y-auto">
            <div className="p-8 relative">
              <button onClick={() => setMobileOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors">
                <X className="w-4 h-4" />
              </button>
              {filterContent}
            </div>
          </div>
        </>
      )}

      {/* Desktop: horizontal bar */}
      <div className="hidden lg:flex items-center gap-10 border-b border-gray-100 py-3 px-1">
        {filterOptions.categories.length > 0 && (
          <div className="min-w-[120px]">
            <p className="text-[9px] tracking-[0.25em] uppercase text-gray-300 mb-1">{t("category")}</p>
            <Select value={selectedCategory} onChange={setSelectedCategory} options={[{ label: t("allCategories"), value: "all" }, ...filterOptions.categories.map((c) => ({ label: getCategoryLabel(c), value: c }))]} />
          </div>
        )}
        {filterOptions.brands.length > 0 && (
          <div className="min-w-[100px]">
            <p className="text-[9px] tracking-[0.25em] uppercase text-gray-300 mb-1">{t("brand")}</p>
            <Select value={selectedBrand} onChange={setSelectedBrand} options={[{ label: t("allBrands"), value: "all" }, ...filterOptions.brands.map((b) => ({ label: b, value: b }))]} />
          </div>
        )}
        {filterOptions.sizes.length > 0 && (
          <div className="min-w-[80px]">
            <p className="text-[9px] tracking-[0.25em] uppercase text-gray-300 mb-1">{t("size")}</p>
            <Select value={selectedSize} onChange={setSelectedSize} options={[{ label: t("allSizes"), value: "all" }, ...filterOptions.sizes.map((s) => ({ label: s, value: s }))]} />
          </div>
        )}
        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-gray-300 mb-1">{t("price")}</p>
          <div className="flex items-center gap-2">
            <input type="number" placeholder={t("minPrice")} value={minPrice} min="0" onChange={(e) => setMinPrice(e.target.value)} className="w-20 border-0 border-b border-gray-200 bg-transparent px-0 py-1.5 text-[11px] text-gray-600 placeholder-gray-300 focus:outline-none focus:border-gray-600 transition-colors" />
            <span className="text-gray-300 text-xs">—</span>
            <input type="number" placeholder={t("maxPrice")} value={maxPrice} min="0" onChange={(e) => setMaxPrice(e.target.value)} className="w-20 border-0 border-b border-gray-200 bg-transparent px-0 py-1.5 text-[11px] text-gray-600 placeholder-gray-300 focus:outline-none focus:border-gray-600 transition-colors" />
          </div>
        </div>
        <div className="flex items-end gap-4 pb-1">
          {[
            { label: t("onSale"), active: isOnSale === true, toggle: () => setIsOnSale(isOnSale === true ? undefined : true) },
            { label: t("inStock"), active: isSoldOut === false, toggle: () => setIsSoldOut(isSoldOut === false ? undefined : false) },
          ].map(({ label, active, toggle }) => (
            <button key={label} onClick={toggle} className={`text-[10px] tracking-widest uppercase transition-colors ${active ? "text-gray-900" : "text-gray-400 hover:text-gray-700"}`}>
              {label}
            </button>
          ))}
        </div>
        {hasActiveFilters && (
          <button onClick={handleClearAll} className="ml-auto text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-900 transition-colors pb-1">
            {t("clearAll")}
          </button>
        )}
      </div>
    </>
  );
}
