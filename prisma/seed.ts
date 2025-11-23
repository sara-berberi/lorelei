import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Example products - remove or modify as needed
  const products = [
    {
      name: 'Premium Cotton T-Shirt',
      description: 'High-quality cotton t-shirt with minimalist design',
      price: 29.99,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      isSoldOut: false,
      isOnSale: false,
    },
    {
      name: 'Designer Denim Jacket',
      description: 'Classic denim jacket with modern fit',
      price: 89.99,
      salePrice: 69.99,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      isSoldOut: false,
      isOnSale: true,
    },
    {
      name: 'Elegant Summer Dress',
      description: 'Lightweight summer dress perfect for any occasion',
      price: 59.99,
      salePrice: null,
      imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
      sizes: JSON.stringify(['S', 'M', 'L']),
      isSoldOut: true,
      isOnSale: false,
    },
  ];

  for (const product of products) {
    await prisma.product.create({
      data: product,
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

