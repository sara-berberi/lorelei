"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import Pagination from "./Pagination";
import ProductGridSkeleton from "./ProductGridSkeleton";

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

export default function ProductGrid() {
  const t = useTranslations("filters");
  const tProduct = useTranslations("product");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Filters handed off via sessionStorage when navigating from the brands
  // page or the mobile menu's category submenu.
  const takeStored = (key: string) => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        sessionStorage.removeItem(key);
        return stored;
      }
    }
    return "all";
  };

  // Read the brand handoff from sessionStorage exactly once, and keep the
  // object identity stable so ProductFilters isn't re-seeded on every render.
  const [initialFilters] = useState<FilterState>(() => ({
    category: takeStored("selectedCategory"),
    brand: takeStored("selectedBrand"),
    size: "",
    minPrice: "",
    maxPrice: "",
    isOnSale: undefined,
    isSoldOut: undefined,
  }));

  const [filters, setFilters] = useState<FilterState>(initialFilters);

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
      // size is a comma-separated list; empty means no size filter
      if (filterState.size && filterState.size !== "all")
        params.append("size", filterState.size);
      if (filterState.minPrice) params.append("minPrice", filterState.minPrice);
      if (filterState.maxPrice) params.append("maxPrice", filterState.maxPrice);

      if (filterState.isOnSale !== undefined) {
        params.append("isOnSale", String(filterState.isOnSale));
      }

      if (filterState.isSoldOut !== undefined) {
        params.append("isSoldOut", String(filterState.isSoldOut));
      }

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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16">
        {/* Filters Section */}
        <div className="mb-10 sm:mb-14 lg:mb-16">
          <ProductFilters
            onFilterChange={handleFilterChange}
            initialFilters={initialFilters}
            resultCount={products.length}
          />
        </div>

        {/* Results Count - Subtle but informative */}
        {!loading && products.length > 0 && (
          <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
            <p className="text-sm text-gray-500 font-light">
              <span className="font-medium text-gray-900">
                {products.length}
              </span>{" "}
              {products.length === 1 ? tProduct("pieceAvailable") : tProduct("piecesAvailable")}
            </p>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <ProductGridSkeleton count={productsPerPage} />
        ) : products.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-40 text-center">
            <p className="text-sm font-light text-gray-400 mb-2">{t("noResults")}</p>
            <p className="text-xs text-gray-300 tracking-wide">{t("adjustFilters")}</p>
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
                    // Only stagger the first row; later cards appear instantly
                    // so scrolling never waits on an animation queue.
                    animationDelay: `${Math.min(index, 4) * 40}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <ProductCard product={product} priority={index < 4} />
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              labels={{ previous: t("previous"), next: t("next"), page: t("page"), of: t("of") }}
            />
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

        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.55; }
        }
        .animate-shimmer {
          animation: shimmer 1.5s ease-in-out infinite;
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
