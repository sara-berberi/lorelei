import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isAuthorized(password: unknown) {
  return !!password && password === process.env.ADMIN_PASSWORD;
}

/** Normalise incoming template fields; everything except name is optional. */
function templateData(fields: any) {
  const num = (v: any) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseFloat(v);
    return isNaN(n) ? null : n;
  };
  const int = (v: any) => {
    if (v === "" || v === null || v === undefined) return null;
    const n = parseInt(v, 10);
    return isNaN(n) ? null : n;
  };

  return {
    name: String(fields.name).trim().slice(0, 120),
    productName: fields.productName?.trim() || null,
    description: fields.description?.trim() || null,
    price: num(fields.price),
    salePrice: num(fields.salePrice),
    category: fields.category || null,
    brand: fields.brand?.trim() || null,
    sizes: fields.sizes ?? "[]",
    stock: int(fields.stock),
    isOnSale: !!fields.isOnSale,
    isSoldOut: !!fields.isSoldOut,
  };
}

// The admin panel authenticates by password, so listing is a POST-with-action
// style GET guarded by the password in the query string.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!isAuthorized(searchParams.get("password"))) return unauthorized();

  const templates = await prisma.productTemplate.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const { password, ...fields } = await request.json();
  if (!isAuthorized(password)) return unauthorized();

  if (!fields.name || !String(fields.name).trim()) {
    return NextResponse.json({ error: "Template name is required" }, { status: 400 });
  }

  const template = await prisma.productTemplate.create({
    data: templateData(fields),
  });
  return NextResponse.json(template, { status: 201 });
}

export async function PUT(request: Request) {
  const { password, id, ...fields } = await request.json();
  if (!isAuthorized(password)) return unauthorized();

  if (!id) {
    return NextResponse.json({ error: "Template id is required" }, { status: 400 });
  }
  if (!fields.name || !String(fields.name).trim()) {
    return NextResponse.json({ error: "Template name is required" }, { status: 400 });
  }

  const template = await prisma.productTemplate.update({
    where: { id: Number(id) },
    data: templateData(fields),
  });
  return NextResponse.json(template);
}

export async function DELETE(request: Request) {
  const { password, id } = await request.json();
  if (!isAuthorized(password)) return unauthorized();

  if (!id) {
    return NextResponse.json({ error: "Template id is required" }, { status: 400 });
  }

  await prisma.productTemplate.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
