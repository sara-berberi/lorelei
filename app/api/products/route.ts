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
    const deletedParam = searchParams.get("deleted");

    const isOnSale =
      isOnSaleParam === null ? undefined : isOnSaleParam === "true";
    const isSoldOut =
      isSoldOutParam === null ? undefined : isSoldOutParam === "true";

    // deleted=true returns only soft-deleted; default returns only active.
    // AND is used as a collector so independent filters can never overwrite
    // each other (each pushes its own clause instead of assigning where.OR).
    const and: any[] = [];
    const where: any =
      deletedParam === "true"
        ? { deletedAt: { not: null }, AND: and }
        : { deletedAt: null, AND: and };

    // Category is stored inconsistently (e.g. "Dresses" from older rows vs
    // "dresses" from the admin panel), so match case-insensitively.
    if (category && category !== "all") {
      and.push({ category: { equals: category, mode: "insensitive" } });
    }

    if (brand && brand !== "all") {
      and.push({ brand: { equals: brand, mode: "insensitive" } });
    }

    if (isOnSale !== undefined) where.isOnSale = isOnSale;
    if (isSoldOut !== undefined) where.isSoldOut = isSoldOut;

    if (minPrice || maxPrice) {
      const min = minPrice ? parseFloat(minPrice) : undefined;
      const max = maxPrice ? parseFloat(maxPrice) : undefined;
      const range = {
        ...(min !== undefined && !isNaN(min) && { gte: min }),
        ...(max !== undefined && !isNaN(max) && { lte: max }),
      };

      if (Object.keys(range).length) {
        // Compare against the price the customer actually pays: salePrice when
        // the item is on sale and has one, base price otherwise.
        and.push({
          OR: [
            { isOnSale: true, salePrice: { not: null, ...range } },
            { isOnSale: true, salePrice: null, price: range },
            { isOnSale: false, price: range },
          ],
        });
      }
    }

    // Sizes are a JSON string column, so they can't be filtered in SQL.
    // Fetch the matching rows, then narrow by parsed size.
    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // `size` accepts one value or a comma-separated list. A product matches
    // if it stocks ANY of the requested sizes.
    const wantedSizes = (size ?? "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s && s !== "all");

    let filteredProducts = products;
    if (wantedSizes.length > 0) {
      filteredProducts = products.filter((product) => {
        if (!product.sizes) return false;
        let available: string[];
        try {
          const parsed = JSON.parse(product.sizes);
          available = Array.isArray(parsed) ? parsed.map(String) : [];
        } catch {
          // Legacy rows may store a plain comma-separated string.
          available = product.sizes.split(",");
        }
        const normalised = available.map((s) => s.trim().toLowerCase());
        return wantedSizes.some((w) => normalised.includes(w));
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
