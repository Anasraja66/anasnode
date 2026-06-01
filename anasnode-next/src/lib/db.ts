import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaInstance: PrismaClient | undefined;

function getPrisma() {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const adapter = new PrismaBetterSqlite3({ url: dbUrl });

  if (process.env.NODE_ENV === "production") {
    if (!prismaInstance) {
      prismaInstance = new PrismaClient({ adapter });
    }
    return prismaInstance;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ["error"],
    });
  }
  return globalForPrisma.prisma;
}

// Use a Proxy to lazily initialize PrismaClient only when a property is accessed
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
