import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Coerce the incoming id list into unique, valid product ids. */
function parseIds(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  const ids = raw
    .map((v) => Number(v))
    .filter((n) => Number.isInteger(n) && n > 0);
  return Array.from(new Set(ids));
}

/**
 * Bulk edit. Only the fields present in `changes` are written, so the admin
 * can (for example) put a whole selection on sale without touching prices.
 */
export async function PATCH(request: Request) {
  const { password, ids: rawIds, changes } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) return unauthorized();

  const ids = parseIds(rawIds);
  if (ids.length === 0) {
    return NextResponse.json({ error: "No products selected" }, { status: 400 });
  }
  if (!changes || typeof changes !== "object") {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  const data: Record<string, any> = {};

  // Absolute value fields.
  if (changes.price !== undefined && changes.price !== "") {
    const n = parseFloat(changes.price);
    if (isNaN(n) || n < 0) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    data.price = n;
  }
  if (changes.salePrice !== undefined) {
    if (changes.salePrice === null || changes.salePrice === "") {
      data.salePrice = null;
    } else {
      const n = parseFloat(changes.salePrice);
      if (isNaN(n) || n < 0) {
        return NextResponse.json({ error: "Invalid sale price" }, { status: 400 });
      }
      data.salePrice = n;
    }
  }
  if (changes.stock !== undefined) {
    if (changes.stock === null || changes.stock === "") {
      data.stock = null;
    } else {
      const n = parseInt(changes.stock, 10);
      if (isNaN(n) || n < 0) {
        return NextResponse.json({ error: "Invalid stock" }, { status: 400 });
      }
      data.stock = n;
    }
  }
  if (typeof changes.category === "string" && changes.category !== "") {
    data.category = changes.category;
  }
  if (typeof changes.brand === "string" && changes.brand !== "") {
    data.brand = changes.brand.trim();
  }
  if (typeof changes.isOnSale === "boolean") data.isOnSale = changes.isOnSale;
  if (typeof changes.isSoldOut === "boolean") data.isSoldOut = changes.isSoldOut;
  if (typeof changes.sizes === "string") data.sizes = changes.sizes;

  // Percentage discount is relative to each product's own price, so it needs
  // per-row maths rather than a single updateMany.
  const discountRaw = changes.discountPercent;
  const hasDiscount =
    discountRaw !== undefined && discountRaw !== null && discountRaw !== "";
  let discount = 0;
  if (hasDiscount) {
    discount = parseFloat(discountRaw);
    if (isNaN(discount) || discount <= 0 || discount >= 100) {
      return NextResponse.json(
        { error: "Discount must be between 1 and 99" },
        { status: 400 }
      );
    }
  }

  if (Object.keys(data).length === 0 && !hasDiscount) {
    return NextResponse.json({ error: "No changes provided" }, { status: 400 });
  }

  if (hasDiscount) {
    const targets = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, price: true },
    });

    await prisma.$transaction(
      targets.map((p) =>
        prisma.product.update({
          where: { id: p.id },
          data: {
            ...data,
            // Discount sets the sale price and flags the item as on sale,
            // unless the admin explicitly set those in the same operation.
            salePrice: Math.round(p.price * (1 - discount / 100) * 100) / 100,
            isOnSale: data.isOnSale ?? true,
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: targets.length });
  }

  const result = await prisma.product.updateMany({
    where: { id: { in: ids } },
    data,
  });

  return NextResponse.json({ success: true, count: result.count });
}

/**
 * Bulk soft-delete (archive), or restore when `restore` is true — mirroring
 * the single-product DELETE/PUT behaviour.
 */
export async function POST(request: Request) {
  const { password, ids: rawIds, restore } = await request.json();
  if (password !== process.env.ADMIN_PASSWORD) return unauthorized();

  const ids = parseIds(rawIds);
  if (ids.length === 0) {
    return NextResponse.json({ error: "No products selected" }, { status: 400 });
  }

  const result = await prisma.product.updateMany({
    where: { id: { in: ids } },
    data: { deletedAt: restore ? null : new Date() },
  });

  return NextResponse.json({ success: true, count: result.count });
}
