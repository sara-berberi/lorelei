"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { X, SlidersHorizontal, Check, ChevronDown } from "lucide-react";

interface FilterOptions {
  categories: string[];
  brands: string[];
  sizes: string[];
  priceRange: { min: number; max: number };
}

export interface FilterValues {
  category: string;
  brand: string;
  size: string;
  minPrice: string;
  maxPrice: string;
  isOnSale?: boolean;
  isSoldOut?: boolean;
}

interface ProductFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
  initialFilters?: Partial<FilterValues>;
  hideSaleFilter?: boolean;
  /** Result count, shown on the mobile "show results" button. */
  resultCount?: number;
}

/**
 * Minimal underlined select. Defined at module scope (not inside the render
 * body) so React keeps the same element between renders instead of
 * remounting it on every keystroke.
 */
function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-transparent border-0 border-b border-gray-200 text-[11px] tracking-widest uppercase text-gray-700 focus:outline-none focus:border-gray-900 transition-colors cursor-pointer py-2 pr-6 w-full truncate"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}

/** Small square checkbox row used for the availability toggles. */
function CheckRow({
  label,
  active,
  onToggle,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      className="flex items-center gap-2.5 group w-full text-left"
    >
      <span
        className={`w-4 h-4 border flex items-center justify-center transition-colors flex-shrink-0 ${
          active
            ? "bg-gray-900 border-gray-900"
            : "border-gray-300 group-hover:border-gray-500"
        }`}
      >
        {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </span>
      <span
        className={`text-[11px] tracking-wider uppercase transition-colors ${
          active ? "text-gray-900" : "text-gray-500 group-hover:text-gray-800"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

export default function ProductFilters({
  onFilterChange,
  initialFilters,
  hideSaleFilter,
  resultCount,
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

  // Seed from initialFilters so a brand chosen on the brands page (or any
  // caller-provided value) is reflected in the controls on every breakpoint.
  const [selectedCategory, setSelectedCategory] = useState(initialFilters?.category ?? "all");
  const [selectedBrand, setSelectedBrand] = useState(initialFilters?.brand ?? "all");
  const [selectedSize, setSelectedSize] = useState(initialFilters?.size ?? "all");
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice ?? "");
  const [isOnSale, setIsOnSale] = useState<boolean | undefined>(initialFilters?.isOnSale);
  const [isSoldOut, setIsSoldOut] = useState<boolean | undefined>(initialFilters?.isSoldOut);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products/filters")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && !cancelled) setFilterOptions(d);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  // Close the drawer on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Price inputs are debounced so typing doesn't fire a request per keystroke.
  const [debouncedMin, setDebouncedMin] = useState(minPrice);
  const [debouncedMax, setDebouncedMax] = useState(maxPrice);
  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedMin(minPrice);
      setDebouncedMax(maxPrice);
    }, 350);
    return () => clearTimeout(id);
  }, [minPrice, maxPrice]);

  // Report changes upward. onFilterChange is intentionally read from a ref so
  // an unmemoised parent callback can't cause an infinite update loop.
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
  }, [onFilterChange]);

  useEffect(() => {
    onFilterChangeRef.current({
      category: selectedCategory,
      brand: selectedBrand,
      size: selectedSize,
      minPrice: debouncedMin,
      maxPrice: debouncedMax,
      isOnSale,
      isSoldOut,
    });
  }, [selectedCategory, selectedBrand, selectedSize, debouncedMin, debouncedMax, isOnSale, isSoldOut]);

  const getCategoryLabel = useCallback(
    (c: string) => {
      // Categories are stored with inconsistent casing; normalise before
      // looking up the translation, and fall back to the raw value.
      const key = c.trim().toLowerCase().replace(/[\s&]+/g, "");
      const map: Record<string, string> = {
        tops: "tops",
        bottoms: "bottoms",
        dresses: "dresses",
        coats: "coatsPuffers",
        coatspuffers: "coatsPuffers",
        nightwear: "nightwear",
        shoes: "shoes",
        activewear: "activewear",
        sets: "sets",
      };
      const messageKey = map[key];
      if (!messageKey) return c;
      try {
        return tCategories(messageKey);
      } catch {
        return c;
      }
    },
    [tCategories]
  );

  const handleClearAll = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSelectedSize("all");
    setMinPrice("");
    setMaxPrice("");
    setIsOnSale(undefined);
    setIsSoldOut(undefined);
  };

  const activeCount = useMemo(() => {
    let n = 0;
    if (selectedCategory !== "all") n++;
    if (selectedBrand !== "all") n++;
    if (selectedSize !== "all") n++;
    if (minPrice !== "" || maxPrice !== "") n++;
    if (isOnSale !== undefined) n++;
    if (isSoldOut !== undefined) n++;
    return n;
  }, [selectedCategory, selectedBrand, selectedSize, minPrice, maxPrice, isOnSale, isSoldOut]);

  const hasActiveFilters = activeCount > 0;

  const categoryOptions = useMemo(
    () => [
      { label: t("allCategories"), value: "all" },
      ...filterOptions.categories.map((c) => ({ label: getCategoryLabel(c), value: c })),
    ],
    [filterOptions.categories, getCategoryLabel, t]
  );

  const brandOptions = useMemo(
    () => [
      { label: t("allBrands"), value: "all" },
      ...filterOptions.brands.map((b) => ({ label: b, value: b })),
    ],
    [filterOptions.brands, t]
  );

  const availability = useMemo(
    () => [
      {
        label: t("onSale"),
        active: isOnSale === true,
        toggle: () => setIsOnSale(isOnSale === true ? undefined : true),
      },
      {
        label: t("inStock"),
        active: isSoldOut === false,
        toggle: () => setIsSoldOut(isSoldOut === false ? undefined : false),
      },
      {
        label: t("soldOut"),
        active: isSoldOut === true,
        toggle: () => setIsSoldOut(isSoldOut === true ? undefined : true),
      },
    ],
    [isOnSale, isSoldOut, t]
  );

  // Size chips, shared between the drawer and the desktop bar.
  const sizeChips = (
    <div className="flex flex-wrap gap-1.5">
      {["all", ...filterOptions.sizes].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setSelectedSize(s)}
          aria-pressed={selectedSize === s}
          className={`min-w-[2.5rem] px-3 py-1.5 text-[10px] tracking-widest uppercase transition-all border ${
            selectedSize === s
              ? "bg-gray-900 text-white border-gray-900"
              : "text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900"
          }`}
        >
          {s === "all" ? t("allSizes") : s}
        </button>
      ))}
    </div>
  );

  const priceInputs = (compact = false) => (
    <div className="flex items-center gap-3">
      <input
        type="number"
        inputMode="numeric"
        placeholder={t("minPrice")}
        value={minPrice}
        min="0"
        onChange={(e) => setMinPrice(e.target.value)}
        className={`${
          compact ? "w-20 text-[11px]" : "flex-1 w-0 text-xs"
        } border-0 border-b border-gray-200 bg-transparent px-0 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors`}
      />
      <span className="text-gray-300 text-xs flex-shrink-0">—</span>
      <input
        type="number"
        inputMode="numeric"
        placeholder={t("maxPrice")}
        value={maxPrice}
        min="0"
        onChange={(e) => setMaxPrice(e.target.value)}
        className={`${
          compact ? "w-20 text-[11px]" : "flex-1 w-0 text-xs"
        } border-0 border-b border-gray-200 bg-transparent px-0 py-2 text-gray-700 placeholder-gray-300 focus:outline-none focus:border-gray-900 transition-colors`}
      />
    </div>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
      <p className="text-[9px] tracking-[0.3em] uppercase text-gray-400 mb-3">{title}</p>
      {children}
    </div>
  );

  if (loading) {
    // Reserve the bar's height so the grid below doesn't jump when it appears.
    return <div className="hidden lg:block h-[74px] border-b border-gray-100" aria-hidden />;
  }

  return (
    <>
      {/* ── Mobile trigger ─────────────────────────────────────────────── */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden flex items-center gap-2 border border-gray-200 px-4 py-2.5 text-[10px] tracking-[0.2em] uppercase text-gray-700 hover:border-gray-900 transition-colors"
      >
        <SlidersHorizontal className="w-3.5 h-3.5" />
        {t("title")}
        {hasActiveFilters && (
          <span className="ml-0.5 min-w-[1.15rem] h-[1.15rem] px-1 rounded-full bg-gray-900 text-white text-[9px] flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Active filter summary on mobile */}
      {hasActiveFilters && (
        <div className="lg:hidden mt-3 flex flex-wrap items-center gap-1.5">
          {selectedCategory !== "all" && (
            <Chip label={getCategoryLabel(selectedCategory)} onClear={() => setSelectedCategory("all")} />
          )}
          {selectedBrand !== "all" && (
            <Chip label={selectedBrand} onClear={() => setSelectedBrand("all")} />
          )}
          {selectedSize !== "all" && (
            <Chip label={selectedSize} onClear={() => setSelectedSize("all")} />
          )}
          {(minPrice !== "" || maxPrice !== "") && (
            <Chip
              label={`${minPrice || "0"}–${maxPrice || "∞"}`}
              onClear={() => {
                setMinPrice("");
                setMaxPrice("");
              }}
            />
          )}
          <button
            onClick={handleClearAll}
            className="text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-900 transition-colors ml-1"
          >
            {t("clearAll")}
          </button>
        </div>
      )}

      {/* ── Mobile drawer ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[10000]" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/25 backdrop-blur-sm animate-filterFade"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white flex flex-col animate-filterSlide">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <p className="text-[10px] tracking-[0.3em] uppercase text-gray-500">{t("title")}</p>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close filters"
                className="text-gray-400 hover:text-gray-900 transition-colors p-1 -m-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-7 space-y-8">
              {filterOptions.categories.length > 0 && (
                <Section title={t("category")}>
                  <Select
                    label={t("category")}
                    value={selectedCategory}
                    onChange={setSelectedCategory}
                    options={categoryOptions}
                  />
                </Section>
              )}

              {filterOptions.brands.length > 0 && (
                <Section title={t("brand")}>
                  <Select
                    label={t("brand")}
                    value={selectedBrand}
                    onChange={setSelectedBrand}
                    options={brandOptions}
                  />
                </Section>
              )}

              {filterOptions.sizes.length > 0 && <Section title={t("size")}>{sizeChips}</Section>}

              {!hideSaleFilter && (
                <Section title={t("availability")}>
                  <div className="space-y-3">
                    {availability.map((a) => (
                      <CheckRow key={a.label} label={a.label} active={a.active} onToggle={a.toggle} />
                    ))}
                  </div>
                </Section>
              )}

              <Section title={t("price")}>{priceInputs(false)}</Section>
            </div>

            {/* Sticky footer */}
            <div className="flex-shrink-0 border-t border-gray-100 px-6 py-4 flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={handleClearAll}
                  className="text-[10px] tracking-[0.2em] uppercase text-gray-500 hover:text-gray-900 transition-colors px-2 py-3"
                >
                  {t("clearAll")}
                </button>
              )}
              <button
                onClick={() => setMobileOpen(false)}
                className="flex-1 bg-gray-900 text-white py-3.5 text-[10px] tracking-[0.25em] uppercase hover:bg-black transition-colors"
              >
                {t("apply")}
                {typeof resultCount === "number" && ` · ${resultCount}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Desktop bar ────────────────────────────────────────────────── */}
      <div className="hidden lg:flex items-end gap-10 border-b border-gray-100 pb-4 pt-1 px-1">
        {filterOptions.categories.length > 0 && (
          <div className="min-w-[140px]">
            <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-1">{t("category")}</p>
            <Select
              label={t("category")}
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
            />
          </div>
        )}

        {filterOptions.brands.length > 0 && (
          <div className="min-w-[120px]">
            <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-1">{t("brand")}</p>
            <Select
              label={t("brand")}
              value={selectedBrand}
              onChange={setSelectedBrand}
              options={brandOptions}
            />
          </div>
        )}

        {filterOptions.sizes.length > 0 && (
          <div>
            <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-2">{t("size")}</p>
            {sizeChips}
          </div>
        )}

        <div>
          <p className="text-[9px] tracking-[0.25em] uppercase text-gray-400 mb-1">{t("price")}</p>
          {priceInputs(true)}
        </div>

        {!hideSaleFilter && (
          <div className="flex flex-col gap-2 pb-1">
            {availability.slice(0, 2).map((a) => (
              <CheckRow key={a.label} label={a.label} active={a.active} onToggle={a.toggle} />
            ))}
          </div>
        )}

        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="ml-auto text-[10px] tracking-[0.2em] uppercase text-gray-400 hover:text-gray-900 transition-colors pb-2 whitespace-nowrap"
          >
            {t("clearAll")} ({activeCount})
          </button>
        )}
      </div>

      <style jsx global>{`
        @keyframes filterSlide {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes filterFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-filterSlide {
          animation: filterSlide 0.28s cubic-bezier(0.32, 0.72, 0, 1);
        }
        .animate-filterFade {
          animation: filterFade 0.28s ease;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-filterSlide,
          .animate-filterFade {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}

/** Removable pill summarising one active filter on mobile. */
function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      onClick={onClear}
      className="flex items-center gap-1.5 border border-gray-200 px-2.5 py-1 text-[10px] tracking-widest uppercase text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
    >
      {label}
      <X className="w-2.5 h-2.5" />
    </button>
  );
}
