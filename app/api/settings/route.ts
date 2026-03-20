import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rows: any[] = await (prisma as any).$queryRaw`
      SELECT "heroImageUrl" FROM site_settings WHERE id = 1 LIMIT 1
    `;
    return NextResponse.json({ heroImageUrl: rows?.[0]?.heroImageUrl ?? null });
  } catch {
    return NextResponse.json({ heroImageUrl: null });
  }
}
