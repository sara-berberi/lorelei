import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      fullName,
      instagramUsername,
      address,
      city,
      phoneNumber,
      productId,
      totalPrice,
      postalFee,
      totalPriceWithPostalFee,
      notes,
    } = body;

    // Validate required fields
    if (
      !fullName ||
      !instagramUsername ||
      !address ||
      !city ||
      !phoneNumber ||
      !productId ||
      totalPrice === undefined ||
      postalFee === undefined ||
      totalPriceWithPostalFee === undefined
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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
        productId,
        totalPrice,
        postalFee,
        totalPriceWithPostalFee,
        notes: notes || null,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

