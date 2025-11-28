import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Get all unique brands from products
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        brand: { not: null },
      },
      select: { brand: true },
      distinct: ["brand"],
      orderBy: { brand: "asc" },
    });

    const brands = products.map((p) => p.brand).filter((b): b is string => !!b);

    return NextResponse.json(brands);
  } catch (error: any) {
    console.error("Error fetching brands:", error);

    return NextResponse.json(
      { error: "Failed to fetch brands", details: error.message },
      { status: 500 }
    );
  }
}
