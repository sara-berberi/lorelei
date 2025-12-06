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

    // Validate products array
    console.log("Received products:", JSON.stringify(products, null, 2));

    // Check for invalid productIds
    const invalidProducts = products.filter(
      (p) =>
        !p.productId || typeof p.productId !== "number" || isNaN(p.productId)
    );

    if (invalidProducts.length > 0) {
      console.error("Invalid products found:", invalidProducts);
      return NextResponse.json(
        { error: "Invalid product data", details: invalidProducts },
        { status: 400 }
      );
    }

    // Create order first
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

    console.log("Order created with ID:", order.id);

    // Then create order items separately
    const orderItems = await Promise.all(
      products.map((p: ProductInput) => {
        console.log("Creating order item with data:", {
          orderId: order.id,
          productId: Number(p.productId),
          quantity: Number(p.quantity || 1),
          price: Number(p.price),
        });

        return prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: Number(p.productId),
            quantity: Number(p.quantity || 1),
            price: Number(p.price),
          },
        });
      })
    );

    console.log("Order items created:", orderItems.length);

    // Fetch the complete order with items
    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating order:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });
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
