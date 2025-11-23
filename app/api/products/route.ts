import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection first
    await prisma.$connect();
    
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    
    // Return empty array if database error, so page still loads
    if (error.code === 'P1001' || error.message?.includes('connect')) {
      console.error('Database connection error. Check your DATABASE_URL in .env');
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

