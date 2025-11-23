# Lorelei Boutique - E-commerce Website

A premium, minimalist e-commerce website for Lorelei Boutique built with Next.js, TypeScript, TailwindCSS, and PostgreSQL.

## Features

- 🛍️ Product catalog with sale and sold-out badges
- 🌍 Bilingual support (English & Albanian)
- 📱 Fully responsive design
- 🎨 Premium Shopify-like aesthetic
- 📦 Order management system
- 🚀 Deployed on Vercel

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Internationalization:** next-intl
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd LoreleiCursor
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/lorelei_boutique?schema=public"
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Set up the database:

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

### Product Table

- `id` (serial, auto increment)
- `name` (VARCHAR 255)
- `description` (text, optional)
- `price` (float)
- `salePrice` (float, optional)
- `imageUrl` (string)
- `isSoldOut` (boolean)
- `isOnSale` (boolean)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)
- `deletedAt` (timestamp, optional)

### Order Table

- `id` (serial, auto increment)
- `fullName` (string)
- `instagramUsername` (string)
- `address` (string)
- `city` (string)
- `phoneNumber` (string)
- `productId` (integer)
- `createdAt` (timestamp)
- `totalPrice` (float)
- `postalFee` (float)
- `totalPriceWithPostalFee` (float)
- `notes` (text, optional)

## Project Structure

```
├── app/
│   ├── [locale]/          # Localized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   └── page.tsx       # Homepage
│   ├── api/               # API routes
│   │   ├── products/      # Product endpoints
│   │   └── orders/        # Order endpoints
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── CheckoutModal.tsx
│   ├── Hero.tsx
│   ├── LanguageToggle.tsx
│   ├── ProductCard.tsx
│   └── ProductGrid.tsx
├── i18n/                  # Internationalization
│   ├── messages/          # Translation files
│   ├── request.ts
│   └── routing.ts
├── lib/                   # Utilities
│   ├── albanian-cities.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma      # Database schema
└── middleware.ts          # Next.js middleware
```

## Deployment on Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Import your project in Vercel:

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your Git repository

3. Configure environment variables in Vercel:

   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_APP_URL`: Your production URL

4. Vercel will automatically:
   - Install dependencies
   - Run Prisma migrations
   - Build and deploy your application

## Database Management

Use DBeaver or any PostgreSQL client to manage your database:

- View and edit products
- View and manage orders
- Direct database access without foreign key constraints

## Language Support

The website supports two languages:

- **English (en)** - Default
- **Albanian (sq)**

Users can switch languages using the flag icons in the header.

## Order Process

1. Customer browses products
2. Clicks "Order Now" on desired product
3. Fills out checkout form with:
   - Name and Surname
   - Instagram Username
   - Address
   - City (from Albanian cities dropdown)
   - Phone Number
   - Optional notes
4. Order is saved to database
5. Confirmation message displayed
6. Business owner follows up via Instagram for payment on delivery

## Postal Fee

Fixed postal fee: ALL 5.00 (configurable in `components/CheckoutModal.tsx`)

## License

Private project for Lorelei Boutique.
