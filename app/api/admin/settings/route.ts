import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows: any[] = await (prisma as any).$queryRaw`
      SELECT "heroImageUrl" FROM site_settings WHERE id = 1 LIMIT 1
    `;
    return NextResponse.json({ heroImageUrl: rows?.[0]?.heroImageUrl ?? null });
  } catch {
    return NextResponse.json({ heroImageUrl: null });
  }
}

export async function PUT(request: Request) {
  const { password, heroImageUrl } = await request.json();

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await (prisma as any).$executeRaw`
      INSERT INTO site_settings (id, "heroImageUrl", "updatedAt")
      VALUES (1, ${heroImageUrl}, NOW())
      ON CONFLICT (id) DO UPDATE SET "heroImageUrl" = ${heroImageUrl}, "updatedAt" = NOW()
    `;
    return NextResponse.json({ heroImageUrl });
  } catch {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
