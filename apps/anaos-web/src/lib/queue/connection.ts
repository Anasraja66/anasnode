import IORedis from "ioredis";

// Reuse the existing Redis connection if possible, or create a new one
export const connection = new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});
