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
  }, [filters, fetchProducts]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  return (
    <>
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

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-400">Loading...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="text-gray-400">{t("noResults")}</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
