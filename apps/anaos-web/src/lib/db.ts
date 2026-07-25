import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    console.warn("[DB] DATABASE_URL not set — running in demo mode (no database).");
    return null;
  }
  try {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (e) {
    console.error("[DB] Failed to initialize Prisma client:", e);
    return null;
  }
}

export const prisma = (globalForPrisma.prisma ?? createPrismaClient()) as PrismaClient;
export const isDbAvailable = !!process.env.DATABASE_URL;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma ?? undefined;
}

export default prisma;
