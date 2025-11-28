import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic"; // ensures this API is never prerendered

export async function GET() {
  try {
    // Fetch all unique, non-null brands
    const products = await prisma.product.findMany({
      where: { deletedAt: null, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    // Extract brands as a string array
    const brands = products.map((p) => p.brand).filter((b): b is string => !!b);

    return NextResponse.json(brands);
  } catch (error: any) {
    console.error("Error fetching brands:", error);

    // Always return a consistent response even on error
    return NextResponse.json(
      { brands: [], error: "Failed to fetch brands", details: error.message },
      { status: 500 }
    );
  }
}
