"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

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
      "Coats & Puffers": "coatsPuffers",
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
      <div className="text-sm text-gray-400 py-4">
        {t("loading") || "Loading filters…"}
      </div>
    );
  }

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedBrand !== "all" ||
    selectedSize !== "all" ||
    minPrice !== "" ||
    maxPrice !== "";

  return (
    <div className="mb-10 border-b border-gray-200 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-medium tracking-tight text-gray-800">
          {t("title")}
        </h2>

        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm text-gray-500 hover:text-gray-800 underline underline-offset-2 transition"
          >
            {t("clearAll")}
          </button>
        )}
      </div>

      {/* Filters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Select Component (Shopify style) */}
        {filterOptions.categories.length > 0 && (
          <FilterSelect
            label={t("category")}
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
        )}

        {filterOptions.brands.length > 0 && (
          <FilterSelect
            label={t("brand")}
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
        )}

        {filterOptions.sizes.length > 0 && (
          <FilterSelect
            label={t("size")}
            value={selectedSize}
            onChange={setSelectedSize}
            options={[
              { label: t("allSizes"), value: "all" },
              ...filterOptions.sizes.map((s) => ({ label: s, value: s })),
            ]}
          />
        )}

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            {t("price")}
          </label>

          <div className="flex gap-3">
            <FilterInput
              placeholder={t("minPrice")}
              value={minPrice}
              onChange={setMinPrice}
            />
            <FilterInput
              placeholder={t("maxPrice")}
              value={maxPrice}
              onChange={setMaxPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------- */
/* CHIC SHOPIFY COMPONENTS */
/* --------------------- */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-2 text-gray-700">{label}</label>
      <select
        className="
          w-full px-3 py-2
          border border-gray-300 bg-white rounded-md
          text-sm text-gray-700
          focus:outline-none focus:ring-2 focus:ring-black/10
          transition
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
    </div>
  );
}

function FilterInput({
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
        w-full px-3 py-2
        border border-gray-300 bg-white rounded-md
        text-sm text-gray-700 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-black/10
        transition
      "
    />
  );
}
