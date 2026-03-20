"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";

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

export default function MysteryBoxGrid() {
  const t = useTranslations("filters");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch("/api/products?category=mysteryBox", {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-12 lg:py-16">

        {!loading && products.length > 0 && (
          <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
            <p className="text-sm text-gray-500 font-light">
              <span className="font-medium text-gray-900">{products.length}</span>{" "}
              {products.length === 1 ? "piece" : "pieces"} available
            </p>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-40">
            <div className="w-5 h-5 border border-gray-300 border-t-gray-700 rounded-full animate-spin mb-6" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300">Loading</p>
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-40 text-center">
            <p className="text-sm font-light text-gray-400 mb-2">{t("noResults")}</p>
            <p className="text-xs text-gray-300 tracking-wide">No mystery boxes available right now. Check back soon!</p>
          </div>
        ) : (
          <>
            <div
              className="product-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px" }}
            >
              {currentProducts.map((product, index) => (
                <div key={product.id} className="group animate-fadeIn" style={{ animationDelay: `${index * 50}ms`, animationFillMode: "backwards" }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-16 sm:mt-20 mb-12 pt-12 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-3">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${currentPage === 1 ? "text-gray-300 cursor-not-allowed bg-gray-50" : "text-gray-700 hover:bg-gray-900 hover:text-white bg-white border border-gray-200 hover:border-gray-900 shadow-sm hover:shadow-md"}`}>
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                      <span className="hidden sm:inline">Previous</span>
                    </span>
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const showPage = pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                      const showEllipsisBefore = pageNum === currentPage - 2 && currentPage > 3;
                      const showEllipsisAfter = pageNum === currentPage + 2 && currentPage < totalPages - 2;
                      if (showEllipsisBefore || showEllipsisAfter) return <span key={pageNum} className="px-4 py-3 text-gray-300 font-light">···</span>;
                      if (!showPage) return null;
                      return (
                        <button key={pageNum} onClick={() => handlePageChange(pageNum)} className={`min-w-[44px] h-[44px] rounded-full text-sm font-medium transition-all duration-300 ${currentPage === pageNum ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg scale-110" : "text-gray-600 hover:bg-gray-100 bg-white border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"}`}>
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`px-6 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${currentPage === totalPages ? "text-gray-300 cursor-not-allowed bg-gray-50" : "text-gray-700 hover:bg-gray-900 hover:text-white bg-white border border-gray-200 hover:border-gray-900 shadow-sm hover:shadow-md"}`}>
                    <span className="flex items-center gap-2">
                      <span className="hidden sm:inline">Next</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </span>
                  </button>
                </div>
                <p className="text-center mt-6 text-xs text-gray-400 font-light tracking-wide">Page {currentPage} of {totalPages}</p>
              </div>
            )}
          </>
        )}
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        @media (max-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 16px !important; } }
        @media (min-width: 641px) and (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 24px !important; } }
        @media (min-width: 1025px) { .product-grid { grid-template-columns: repeat(4, 1fr) !important; gap: 32px !important; } }
      `}</style>
    </div>
  );
}
