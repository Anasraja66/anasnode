import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import Database from "better-sqlite3";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL || "file:./dev.db";
  const relativePath = rawUrl.startsWith("file:") ? rawUrl.substring(5) : rawUrl;
  const dbPath = path.resolve(process.cwd(), relativePath);
  
  const db = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3(db);

  return new PrismaClient({
    adapter,
  });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
