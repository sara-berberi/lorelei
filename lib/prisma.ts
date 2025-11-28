import { PrismaClient } from "@prisma/client";

// Prevent multiple instances during dev & enable safe config for Vercel serverless
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // @ts-ignore
    __internal: {
      useStatementCache: false, // disable statement cache
    },
    log: ["error", "warn"],
  });

// Store the client globally in development only
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
