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
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-10 lg:py-12">
        {/* Filters Section */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
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

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-32 sm:py-40">
            <div className="relative">
              {/* Elegant spinner */}
              <div className="w-12 h-12 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
            <p className="mt-6 text-gray-500 font-normal tracking-wide text-xs uppercase">
              Loading Products
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-32 sm:py-40">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-gray-400"
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
            <p className="text-gray-900 font-medium text-base tracking-tight mb-2">
              {t("noResults")}
            </p>
            <p className="text-gray-500 text-sm">
              Try adjusting your filters to discover more items
            </p>
          </div>
        ) : (
          <>
            <div
              className="product-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "24px",
              }}
            >
              {currentProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group animate-fadeIn"
                  style={{
                    animationDelay: `${index * 40}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
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
                            className="px-3 py-2 text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }

                      if (!showPage) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-[40px] px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-black text-white"
                              : "text-gray-700 hover:bg-gray-100"
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
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        /* Modern e-commerce grid responsive adjustments */
        @media (max-width: 640px) {
          .product-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          .product-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 20px !important;
          }
        }

        @media (min-width: 1025px) {
          .product-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 24px !important;
          }
        }

        /* Clean minimal scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        ::-webkit-scrollbar-track {
          background: #f5f5f5;
        }

        ::-webkit-scrollbar-thumb {
          background: #d4d4d4;
          border-radius: 3px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a3a3a3;
        }
      `}</style>
    </div>
  );
}
