import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Soft-delete
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: { deletedAt: new Date() },
  });

  return NextResponse.json(product);
}

// Restore soft-deleted product
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { password } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: { deletedAt: null },
  });

  return NextResponse.json(product);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { password, ...fields } = body;

  // Verify admin password server-side
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  const allowedFields = [
    "price",
    "salePrice",
    "isOnSale",
    "isSoldOut",
    "description",
    "sizes",
    "imageUrl",
    "name",
  ];

  const data: Record<string, any> = {};
  for (const key of allowedFields) {
    if (key in fields) {
      data[key] = fields[key];
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data,
  });

  return NextResponse.json(product);
}
