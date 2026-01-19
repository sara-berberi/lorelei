import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const isOnSaleParam = searchParams.get("isOnSale");
    const isSoldOutParam = searchParams.get("isSoldOut");

    const isOnSale =
      isOnSaleParam === null ? undefined : isOnSaleParam === "true";
    const isSoldOut =
      isSoldOutParam === null ? undefined : isSoldOutParam === "true";

    const where: any = { deletedAt: null };

    if (category && category !== "all") where.category = category;
    if (brand && brand !== "all") where.brand = brand;

    if (isOnSale !== undefined) where.isOnSale = isOnSale;
    if (isSoldOut !== undefined) where.isSoldOut = isSoldOut;

    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : undefined;
      const max = maxPrice ? parseFloat(maxPrice) : undefined;

      where.OR = [
        {
          isOnSale: true,
          salePrice: {
            ...(min !== undefined && { gte: min }),
            ...(max !== undefined && { lte: max }),
          },
        },
        {
          isOnSale: false,
          price: {
            ...(min !== undefined && { gte: min }),
            ...(max !== undefined && { lte: max }),
          },
        },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Size filter (JSON)
    let filteredProducts = products;
    if (size && size !== "all") {
      filteredProducts = products.filter((product) => {
        if (!product.sizes) return false;
        try {
          const sizes = JSON.parse(product.sizes);
          return Array.isArray(sizes) && sizes.includes(size);
        } catch {
          return false;
        }
      });
    }

    return NextResponse.json(filteredProducts);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}
