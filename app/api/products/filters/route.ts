import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  try {
    // Get all products (not deleted)
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      select: {
        category: true,
        brand: true,
        sizes: true,
        price: true,
        salePrice: true,
        isOnSale: true,
      },
    });

    // Collapse values that differ only by case/whitespace (e.g. "Dresses" and
    // "dresses") to a single option, keeping the first spelling seen.
    const uniqueByCase = (values: (string | null)[]) => {
      const seen = new Map<string, string>();
      values.forEach((v) => {
        const trimmed = v?.trim();
        if (!trimmed) return;
        const key = trimmed.toLowerCase();
        if (!seen.has(key)) seen.set(key, trimmed);
      });
      return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
    };

    const categories = uniqueByCase(products.map((p) => p.category));
    const brands = uniqueByCase(products.map((p) => p.brand));

    // Extract unique sizes from all products
    const rawSizes: string[] = [];
    products.forEach((product) => {
      if (!product.sizes) return;
      try {
        const parsed = JSON.parse(product.sizes);
        if (Array.isArray(parsed)) rawSizes.push(...parsed.map(String));
      } catch {
        // Legacy rows may store a plain comma-separated string.
        rawSizes.push(...product.sizes.split(","));
      }
    });

    // Sort in garment order (XS→XXL, then numeric), not alphabetically.
    const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "ONE SIZE"];
    const sizeRank = (s: string) => {
      const i = SIZE_ORDER.indexOf(s.toUpperCase());
      if (i !== -1) return i;
      const n = parseFloat(s);
      return isNaN(n) ? 1000 : 100 + n;
    };
    const sizes = uniqueByCase(rawSizes).sort(
      (a, b) => sizeRank(a) - sizeRank(b) || a.localeCompare(b)
    );

    // Calculate price range
    const prices = products.map((p) =>
      p.isOnSale && p.salePrice ? p.salePrice : p.price
    );
    const minPrice = prices.length ? Math.min(...prices) : 0;
    const maxPrice = prices.length ? Math.max(...prices) : 0;

    return NextResponse.json({
      categories,
      brands,
      sizes,
      priceRange: { min: minPrice, max: maxPrice },
    });
  } catch (error: any) {
    console.error("Error fetching filters:", error);

    return NextResponse.json(
      {
        categories: [],
        brands: [],
        sizes: [],
        priceRange: { min: 0, max: 0 },
        error: "Failed to fetch filters",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
