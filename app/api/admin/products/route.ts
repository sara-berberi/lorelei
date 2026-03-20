import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { password, ...fields } = body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    name,
    description,
    price,
    salePrice,
    isOnSale,
    isSoldOut,
    category,
    brand,
    sizes,
    imageUrl,
  } = fields;

  if (!name || !price || !imageUrl) {
    return NextResponse.json(
      { error: "Name, price and at least one image are required" },
      { status: 400 }
    );
  }

  const product = await prisma.product.create({
    data: {
      name,
      description: description || null,
      price: parseFloat(price),
      salePrice: salePrice ? parseFloat(salePrice) : null,
      isOnSale: !!isOnSale,
      isSoldOut: !!isSoldOut,
      category: category || null,
      brand: brand || null,
      sizes: sizes ?? "[]",
      imageUrl,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
