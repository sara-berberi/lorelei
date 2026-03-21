"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "./ProductCard";

const KEY = "lorelei_recently_viewed";
const MAX = 4;

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
  stock?: number | null;
}

export function trackView(product: Product) {
  try {
    const existing: Product[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const filtered = existing.filter((p) => p.id !== product.id);
    const updated = [product, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export default function RecentlyViewed({ currentProductId }: { currentProductId?: number }) {
  const t = useTranslations("whatsapp");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    try {
      const stored: Product[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      const filtered = currentProductId ? stored.filter((p) => p.id !== currentProductId) : stored;
      setProducts(filtered.slice(0, MAX));
    } catch {}
  }, [currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="bg-white border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-12 xl:px-16">
      <div className="max-w-[1440px] mx-auto">
        <p className="text-[10px] tracking-[0.35em] uppercase text-gray-400 mb-8">{t("recentlyViewed")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
