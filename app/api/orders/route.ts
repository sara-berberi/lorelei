import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

type ProductInput = {
  productId: number;
  quantity?: number;
  price: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      instagramUsername,
      address,
      city,
      phoneNumber,
      products,
      totalPrice,
      postalFee,
      totalPriceWithPostalFee,
      notes,
    }: {
      fullName: string;
      instagramUsername: string;
      address: string;
      city: string;
      phoneNumber: string;
      products: ProductInput[];
      totalPrice: number;
      postalFee: number;
      totalPriceWithPostalFee: number;
      notes?: string;
    } = body;

    // Validation
    if (
      !fullName ||
      !instagramUsername ||
      !address ||
      !city ||
      !phoneNumber ||
      !products ||
      products.length === 0
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        fullName,
        instagramUsername,
        address,
        city,
        phoneNumber,
        totalPrice: Number(totalPrice),
        postalFee: Number(postalFee),
        totalPriceWithPostalFee: Number(totalPriceWithPostalFee),
        notes: notes || null,
      },
    });

    // Create order items
    const orderItems = await Promise.all(
      products.map((p) =>
        prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: Number(p.productId),
            quantity: Number(p.quantity || 1),
            price: Number(p.price),
          },
        })
      )
    );

    // Return the order + items manually (no relations)
    const completeOrder = {
      ...order,
      items: orderItems,
    };

    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error.message,
        code: error.code,
        meta: error.meta,
      },
      { status: 500 }
    );
  }
}
