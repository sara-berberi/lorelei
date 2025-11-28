import { PrismaClient } from "@prisma/client";

// Global singleton for serverless environments
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ["error", "warn"],
    __internal: { useStatementCache: false } as never, // TS bypass
  });

// Only assign global in development to avoid multiple instances
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}
