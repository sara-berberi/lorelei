import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function isAuthorized(password: unknown) {
  return !!password && password === process.env.ADMIN_PASSWORD;
}

/** Admin: every review, including hidden ones. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!isAuthorized(searchParams.get("password"))) return unauthorized();

  const reviews = await prisma.review.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const { password, clientName, message, imageUrl, sortOrder } =
    await request.json();
  if (!isAuthorized(password)) return unauthorized();

  const text = typeof message === "string" ? message.trim() : "";
  const image = typeof imageUrl === "string" ? imageUrl.trim() : "";

  // A review is either a message or a photo — it must have one of them.
  if (!text && !image) {
    return NextResponse.json(
      { error: "Add either a message or a photo." },
      { status: 400 }
    );
  }

  const review = await prisma.review.create({
    data: {
      clientName: clientName?.trim() || null,
      message: text || null,
      imageUrl: image || null,
      sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : 0,
    },
  });
  return NextResponse.json(review, { status: 201 });
}

export async function PATCH(request: Request) {
  const { password, id, ...fields } = await request.json();
  if (!isAuthorized(password)) return unauthorized();
  if (!id) {
    return NextResponse.json({ error: "Review id is required" }, { status: 400 });
  }

  const data: Record<string, any> = {};
  if (typeof fields.clientName === "string")
    data.clientName = fields.clientName.trim() || null;
  if (typeof fields.message === "string")
    data.message = fields.message.trim() || null;
  if (typeof fields.imageUrl === "string")
    data.imageUrl = fields.imageUrl.trim() || null;
  if (typeof fields.isVisible === "boolean") data.isVisible = fields.isVisible;
  if (fields.sortOrder !== undefined && Number.isFinite(Number(fields.sortOrder)))
    data.sortOrder = Number(fields.sortOrder);

  const review = await prisma.review.update({
    where: { id: Number(id) },
    data,
  });
  return NextResponse.json(review);
}

export async function DELETE(request: Request) {
  const { password, id } = await request.json();
  if (!isAuthorized(password)) return unauthorized();
  if (!id) {
    return NextResponse.json({ error: "Review id is required" }, { status: 400 });
  }

  await prisma.review.delete({ where: { id: Number(id) } });
  return NextResponse.json({ success: true });
}
