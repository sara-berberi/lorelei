"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  imageUrl: string;
  sizes: string | null;
  category: string | null;
  brand: string | null;
  isSoldOut: boolean;
  isOnSale: boolean;
}

interface FilterState {
  category: string;
  brand: string;
  size: string;
  minPrice: string;
  maxPrice: string;
  isOnSale?: boolean;
  isSoldOut?: boolean;
}

export default function SaleGrid() {
  const t = useTranslations("filters");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    brand: "all",
    size: "all",
    minPrice: "",
    maxPrice: "",
  });

  const fetchProducts = useCallback(async (f: FilterState) => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const params = new URLSearchParams();
      // Always locked to on-sale, never mystery box
      params.append("isOnSale", "true");
      params.append("excludeCategory", "mysteryBox");

      if (f.category !== "all") params.append("category", f.category);
      if (f.brand !== "all") params.append("brand", f.brand);
      if (f.size !== "all") params.append("size", f.size);
      if (f.minPrice) params.append("minPrice", f.minPrice);
      if (f.maxPrice) params.append("maxPrice", f.maxPrice);
      if (f.isSoldOut !== undefined) params.append("isSoldOut", String(f.isSoldOut));

      const res = await fetch(`/api/products?${params.toString()}`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
    setCurrentPage(1);
  }, [filters, fetchProducts]);

  const handleFilterChange = useCallback((f: FilterState) => {
    setFilters(f);
  }, []);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-[50vh] bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16">

        {/* Filters */}
        <div className="mb-10 sm:mb-14">
          <ProductFilters
            onFilterChange={handleFilterChange}
            initialFilters={{ category: filters.category, brand: filters.brand, size: filters.size, minPrice: filters.minPrice, maxPrice: filters.maxPrice }}
            hideSaleFilter
          />
        </div>

        {!loading && products.length > 0 && (
          <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
            <p className="text-sm text-gray-500 font-light">
              <span className="font-medium text-gray-900">{products.length}</span>{" "}
              {products.length === 1 ? "piece" : "pieces"} on sale
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center py-40">
            <div className="w-5 h-5 border border-gray-300 border-t-gray-700 rounded-full animate-spin mb-6" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">Loading</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-40 text-center">
            <p className="text-sm font-light text-gray-400 mb-2">{t("noResults")}</p>
            <p className="text-xs text-gray-300 tracking-wide">No sale items available right now</p>
          </div>
        ) : (
          <>
            <div className="product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}>
              {currentProducts.map((product, index) => (
                <div key={product.id} className="animate-fadeIn" style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 mb-12 pt-12 border-t border-gray-100 flex justify-center items-center gap-2">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-6 py-3 rounded-full text-sm transition-all ${currentPage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-900 hover:text-white bg-white border border-gray-200 shadow-sm"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  if (n !== 1 && n !== totalPages && (n < currentPage - 1 || n > currentPage + 1)) return null;
                  return (
                    <button key={n} onClick={() => handlePageChange(n)} className={`min-w-[44px] h-[44px] rounded-full text-sm transition-all ${currentPage === n ? "bg-gray-900 text-white shadow-lg" : "text-gray-600 bg-white border border-gray-200 hover:bg-gray-100"}`}>
                      {n}
                    </button>
                  );
                })}
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`px-6 py-3 rounded-full text-sm transition-all ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-700 hover:bg-gray-900 hover:text-white bg-white border border-gray-200 shadow-sm"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.5s ease forwards; }
        @media (max-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; } }
        @media (min-width: 641px) and (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 24px !important; } }
      `}</style>
    </div>
  );
}
