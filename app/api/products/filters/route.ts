import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

    // Extract unique categories
    const categories = Array.from(
      new Set(products.map((p) => p.category).filter((c): c is string => !!c))
    ).sort();

    // Extract unique brands
    const brands = Array.from(
      new Set(products.map((p) => p.brand).filter((b): b is string => !!b))
    ).sort();

    // Extract unique sizes from all products
    const allSizes = new Set<string>();
    products.forEach((product) => {
      if (product.sizes) {
        try {
          const sizes = JSON.parse(product.sizes);
          if (Array.isArray(sizes)) sizes.forEach((size) => allSizes.add(size));
        } catch {
          // Ignore JSON errors
        }
      }
    });
    const sizes = Array.from(allSizes).sort();

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
