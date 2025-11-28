import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Test database connection first
    await prisma.$connect();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const size = searchParams.get("size");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Build where clause
    const where: any = {
      deletedAt: null,
    };

    // Add category filter
    if (category && category !== "all") {
      where.category = category;
    }

    // Add brand filter
    if (brand && brand !== "all") {
      where.brand = brand;
    }

    // Add price filters
    if (minPrice) {
      where.price = { ...where.price, gte: parseFloat(minPrice) };
    }
    if (maxPrice) {
      where.price = { ...where.price, lte: parseFloat(maxPrice) };
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    // Filter by size if specified (size is stored as JSON string)
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

    // Return empty array if database error, so page still loads
    if (error.code === "P1001" || error.message?.includes("connect")) {
      console.error(
        "Database connection error. Check your DATABASE_URL in .env"
      );
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
