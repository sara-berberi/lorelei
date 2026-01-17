import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { notes } = await request.json();

  const order = await prisma.order.update({
    where: { id: Number(params.id) },
    data: { notes },
  });

  return NextResponse.json(order);
}
