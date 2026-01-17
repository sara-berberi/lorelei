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
}

export default function ProductGrid() {
  const t = useTranslations("filters");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Check for brand filter from sessionStorage (when navigating from brands page)
  const getInitialBrand = () => {
    if (typeof window !== "undefined") {
      const storedBrand = sessionStorage.getItem("selectedBrand");
      if (storedBrand) {
        sessionStorage.removeItem("selectedBrand");
        return storedBrand;
      }
    }
    return "all";
  };

  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    brand: getInitialBrand(),
    size: "all",
    minPrice: "",
    maxPrice: "",
  });

  const fetchProducts = useCallback(async (filterState: FilterState) => {
    try {
      setLoading(true);
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      // Build query string
      const params = new URLSearchParams();
      if (filterState.category !== "all")
        params.append("category", filterState.category);
      if (filterState.brand !== "all")
        params.append("brand", filterState.brand);
      if (filterState.size !== "all") params.append("size", filterState.size);
      if (filterState.minPrice) params.append("minPrice", filterState.minPrice);
      if (filterState.maxPrice) params.append("maxPrice", filterState.maxPrice);

      const url = `/api/products${
        params.toString() ? `?${params.toString()}` : ""
      }`;

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }

      const data = await res.json();

      // Handle both array and error response
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("Unexpected response format:", data);
        setProducts([]);
      }
    } catch (err: any) {
      console.error("Error fetching products:", err);
      if (err.name === "AbortError") {
        console.error("Request timed out. Check your database connection.");
      }
      setProducts([]); // Set empty array so page still renders
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [filters, fetchProducts]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  // Pagination calculations
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16">
        {/* Filters Section */}
        <div className="mb-10 sm:mb-14 lg:mb-16">
          <ProductFilters
            onFilterChange={handleFilterChange}
            initialFilters={{
              category: filters.category,
              brand: filters.brand,
              size: filters.size,
              minPrice: filters.minPrice,
              maxPrice: filters.maxPrice,
            }}
          />
        </div>

        {/* Results Count - Subtle but informative */}
        {!loading && products.length > 0 && (
          <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
            <p className="text-sm text-gray-500 font-light">
              <span className="font-medium text-gray-900">
                {products.length}
              </span>{" "}
              {products.length === 1 ? "piece" : "pieces"} available
            </p>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 sm:py-48">
            <div className="relative mb-8">
              {/* Premium loading animation */}
              <div className="w-16 h-16 border-[3px] border-gray-100 border-t-pink-400 rounded-full animate-spin"></div>
              <div
                className="absolute inset-0 w-16 h-16 border-[3px] border-transparent border-b-pink-300 rounded-full animate-spin"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>
            <p className="text-gray-400 font-light tracking-[0.2em] text-xs uppercase">
              Loading
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-32 sm:py-48 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center mb-8 shadow-sm">
              <svg
                className="w-9 h-9 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-gray-900 font-light text-xl tracking-tight mb-3">
              {t("noResults")}
            </h3>
            <p className="text-gray-500 text-sm font-light mb-8 max-w-md text-center leading-relaxed">
              We couldn&apos;t find any pieces matching your criteria. Try
              adjusting your filters to explore more options.
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>
        ) : (
          <>
            <div
              className="product-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "32px",
              }}
            >
              {currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group animate-fadeIn"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Premium Pagination */}
            {totalPages > 1 && (
              <div className="mt-16 sm:mt-20 mb-12 pt-12 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-3">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed bg-gray-50"
                        : "text-gray-700 hover:bg-gray-900 hover:text-white bg-white border border-gray-200 hover:border-gray-900 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                      <span className="hidden sm:inline">Previous</span>
                    </span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 &&
                            pageNum <= currentPage + 1);

                        // Show ellipsis
                        const showEllipsisBefore =
                          pageNum === currentPage - 2 && currentPage > 3;
                        const showEllipsisAfter =
                          pageNum === currentPage + 2 &&
                          currentPage < totalPages - 2;

                        if (showEllipsisBefore || showEllipsisAfter) {
                          return (
                            <span
                              key={pageNum}
                              className="px-4 py-3 text-gray-300 font-light"
                            >
                              ···
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`min-w-[44px] h-[44px] rounded-full text-sm font-medium transition-all duration-300 ${
                              currentPage === pageNum
                                ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg scale-110"
                                : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed bg-gray-50"
                        : "text-gray-700 hover:bg-gray-900 hover:text-white bg-white border border-gray-200 hover:border-gray-900 shadow-sm hover:shadow-md"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="hidden sm:inline">Next</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                </div>

                {/* Page indicator for mobile */}
                <p className="text-center mt-6 text-xs text-gray-400 font-light tracking-wide">
                  Page {currentPage} of {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Premium e-commerce grid responsive adjustments */
        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 24px !important;
          }
        }

        @media (min-width: 1025px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 32px !important;
          }
        }

        /* Elegant minimal scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: linear-gradient(to bottom, #fafafa, #f5f5f5);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #d4d4d4, #a3a3a3);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #a3a3a3, #737373);
        }

        /* Smooth page transitions */
        * {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}
