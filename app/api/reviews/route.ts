import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

/** Public: visible reviews only, in the admin's chosen order. */
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { isVisible: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        clientName: true,
        message: true,
        imageUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json(reviews);
  } catch (error: any) {
    // The section is decorative — never break the homepage over it.
    console.error("Error fetching reviews:", error);
    return NextResponse.json([]);
  }
}
