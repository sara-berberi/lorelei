import { PrismaClient } from "@prisma/client";

// Prevent multiple instances during dev & enable safe config for Vercel serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Disable prepared statements - fixes "s1 already exists" on Vercel
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ["error", "warn"],
  });

// Store the client globally in development only
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
