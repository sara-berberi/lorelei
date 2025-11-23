# Setup Guide for Lorelei Boutique

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE lorelei_boutique;
```

#### Option B: Cloud Database (Recommended for Vercel)
Use services like:
- [Supabase](https://supabase.com) (Free tier available)
- [Neon](https://neon.tech) (Free tier available)
- [Railway](https://railway.app) (Free tier available)

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lorelei_boutique?schema=public"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production (Vercel), add these in your Vercel project settings.

### 4. Initialize Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# (Optional) Seed with sample data
npm run prisma:seed
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Adding Products

### Via DBeaver (Recommended)

1. Open DBeaver and connect to your PostgreSQL database
2. Navigate to the `products` table
3. Insert new products with the following fields:
   - `name`: Product name (VARCHAR 255)
   - `description`: Optional description (TEXT)
   - `price`: Regular price (FLOAT)
   - `salePrice`: Sale price if on sale (FLOAT, nullable)
   - `imageUrl`: Full URL to product image (TEXT)
   - `isSoldOut`: Boolean (false by default)
   - `isOnSale`: Boolean (false by default)
   - `createdAt`: Auto-generated timestamp
   - `updatedAt`: Auto-generated timestamp
   - `deletedAt`: NULL (for active products)

### Example Product Insert

```sql
INSERT INTO products (name, description, price, salePrice, imageUrl, "isSoldOut", "isOnSale", "createdAt", "updatedAt")
VALUES (
  'Premium Cotton T-Shirt',
  'High-quality cotton t-shirt with minimalist design',
  29.99,
  NULL,
  'https://your-image-url.com/image.jpg',
  false,
  false,
  NOW(),
  NOW()
);
```

### Image Hosting

For production, host your product images on:
- Cloudinary
- AWS S3
- Vercel Blob Storage
- Or any CDN

Update `next.config.js` to allow your image domain:

```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-cdn-domain.com',
    },
  ],
}
```

## Viewing Orders

All orders are stored in the `orders` table. View them via:
- DBeaver (recommended)
- Prisma Studio: `npm run prisma:studio`

## Deployment Checklist

Before deploying to Vercel:

- [ ] Set up PostgreSQL database (cloud provider)
- [ ] Add `DATABASE_URL` to Vercel environment variables
- [ ] Add `NEXT_PUBLIC_APP_URL` to Vercel environment variables
- [ ] Update image domains in `next.config.js` if using external images
- [ ] Run database migrations on production database
- [ ] Test the checkout flow
- [ ] Verify language switching works

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is accessible from your network
- For Vercel, ensure database allows connections from Vercel IPs

### Images Not Loading
- Check image URLs are accessible
- Verify `next.config.js` includes your image domain
- Use absolute URLs for images

### Language Not Switching
- Clear browser cache
- Check middleware is working
- Verify locale routes are accessible

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [next-intl Documentation](https://next-intl-docs.vercel.app)

