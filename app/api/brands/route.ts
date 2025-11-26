import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    await prisma.$connect();
    
    // Get all unique brands from products
    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        brand: {
          not: null,
        },
      },
      select: {
        brand: true,
      },
      distinct: ['brand'],
      orderBy: {
        brand: 'asc',
      },
    });
    
    const brands = products
      .map((p) => p.brand)
      .filter((b): b is string => b !== null && b !== undefined);
    
    return NextResponse.json(brands);
  } catch (error: any) {
    console.error('Error fetching brands:', error);
    
    if (error.code === 'P1001' || error.message?.includes('connect')) {
      console.error('Database connection error. Check your DATABASE_URL in .env');
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch brands', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}

