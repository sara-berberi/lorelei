"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

interface FilterOptions {
  categories: string[];
  brands: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
}

interface ProductFiltersProps {
  onFilterChange: (filters: {
    category: string;
    brand: string;
    size: string;
    minPrice: string;
    maxPrice: string;
  }) => void;
  initialFilters?: {
    category?: string;
    brand?: string;
    size?: string;
    minPrice?: string;
    maxPrice?: string;
  };
}

export default function ProductFilters({
  onFilterChange,
  initialFilters,
}: ProductFiltersProps) {
  const t = useTranslations("filters");
  const tCategories = useTranslations("categories");

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    brands: [],
    sizes: [],
    priceRange: { min: 0, max: 0 },
  });

  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(
    initialFilters?.category || "all"
  );
  const [selectedBrand, setSelectedBrand] = useState(
    initialFilters?.brand || "all"
  );
  const [selectedSize, setSelectedSize] = useState(
    initialFilters?.size || "all"
  );
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || "");

  // Fetch options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await fetch("/api/products/filters");
        if (res.ok) {
          const data = await res.json();
          setFilterOptions(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFilterOptions();
  }, []);

  // Notify parent
  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      brand: selectedBrand,
      size: selectedSize,
      minPrice,
      maxPrice,
    });
  }, [
    selectedCategory,
    selectedBrand,
    selectedSize,
    minPrice,
    maxPrice,
    onFilterChange,
  ]);

  const handleClearAll = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedSize("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const getCategoryTranslation = (category: string) => {
    const map: Record<string, string> = {
      Tops: "tops",
      Bottoms: "bottoms",
      Dresses: "dresses",
      Coats: "coatsPuffers",
      Nightwear: "nightwear",
      Shoes: "shoes",
      Activewear: "activewear",
    };

    const key = map[category] || category.toLowerCase();
    try {
      return tCategories(key);
    } catch {
      return category;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-gray-400 tracking-wide">
          {t("loading") || "Loading filters…"}
        </div>
      </div>
    );
  }

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    selectedSize !== "all" ||
    minPrice !== "" ||
    maxPrice !== "";

  const filterContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-light tracking-wider uppercase text-gray-900">
            {t("title")}
          </h2>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-xs tracking-wide uppercase text-gray-500 hover:text-gray-900 transition-colors duration-200 font-medium"
          >
            {t("clearAll")}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-8">
        {filterOptions.categories.length > 0 && (
          <FilterGroup label={t("category")}>
            <ChicSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={[
                { label: t("allCategories"), value: "all" },
                ...filterOptions.categories.map((c) => ({
                  label: getCategoryTranslation(c),
                  value: c,
                })),
              ]}
            />
          </FilterGroup>
        )}

        {filterOptions.brands.length > 0 && (
          <FilterGroup label={t("brand")}>
            <ChicSelect
              value={selectedBrand}
              onChange={setSelectedBrand}
              options={[
                { label: t("allBrands"), value: "all" },
                ...filterOptions.brands.map((b) => ({
                  label: b,
                  value: b,
                })),
              ]}
            />
          </FilterGroup>
        )}

        {filterOptions.sizes.length > 0 && (
          <FilterGroup label={t("size")}>
            <ChicSelect
              value={selectedSize}
              onChange={setSelectedSize}
              options={[
                { label: t("allSizes"), value: "all" },
                ...filterOptions.sizes.map((s) => ({ label: s, value: s })),
              ]}
            />
          </FilterGroup>
        )}

        {/* Price Range */}
        <FilterGroup label={t("price")}>
          <div className="flex gap-3">
            <PriceInput
              placeholder={t("minPrice")}
              value={minPrice}
              onChange={setMinPrice}
            />
            <span className="text-gray-300 self-center text-sm">—</span>
            <PriceInput
              placeholder={t("maxPrice")}
              value={maxPrice}
              onChange={setMaxPrice}
            />
          </div>
        </FilterGroup>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm font-medium tracking-wide">Filters</span>
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white z-50 shadow-2xl overflow-y-auto">
            <div className="p-6">
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              {filterContent}
            </div>
          </div>
        </>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-100 p-8 shadow-sm">
        {filterContent}
      </div>
    </>
  );
}

/* --------------------- */
/* ELEGANT COMPONENTS */
/* --------------------- */

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium uppercase tracking-widest text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
}

function ChicSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="relative">
      <select
        className="
          w-full px-4 py-3
          border border-gray-200 bg-white rounded-lg
          text-sm text-gray-800
          appearance-none cursor-pointer
          focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200
          transition-all duration-200
          pr-10
        "
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

function PriceInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      min="0"
      step="0.01"
      onChange={(e) => onChange(e.target.value)}
      className="
        flex-1 px-4 py-3
        border border-gray-200 bg-white rounded-lg
        text-sm text-gray-800 placeholder-gray-400
        focus:outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200
        transition-all duration-200
      "
    />
  );
}
