import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    console.warn("[DB] DATABASE_URL not set — running in demo mode (no database).");
    return createMockPrismaClient();
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
    return createMockPrismaClient();
  }
}

function createMockPrismaClient(): PrismaClient {
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === '$connect' || prop === '$disconnect') return async () => {};
      if (prop === '$transaction') return async (cb: any) => cb([]);
      
      // For any model (user, account, etc), return another proxy
      return new Proxy({}, {
        get: (t, p) => {
          if (['findUnique', 'findFirst', 'update', 'delete'].includes(p as string)) return async () => null;
          if (['findMany', 'createMany', 'updateMany'].includes(p as string)) return async () => [];
          if (p === 'create') return async (args: any) => ({ id: "mock_id", ...args.data });
          if (p === 'count') return async () => 0;
          return async () => null;
        }
      });
    }
  }) as PrismaClient;
}

export const prisma = (globalForPrisma.prisma ?? createPrismaClient()) as PrismaClient;
export const isDbAvailable = !!process.env.DATABASE_URL;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma ?? undefined;
}

export default prisma;
