import { GET } from "./src/app/api/dashboard/data/route.ts";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PrismaClient } from "@prisma/client";

// Mock auth
jest.mock("./src/auth", () => ({
  auth: () => Promise.resolve({ user: { accountId: "test" } }),
}));

async function run() {
  const req = new Request("http://localhost/api/dashboard/data");
  const res = await GET(req);
  console.log("Status:", res.status);
  const json = await res.json();
  console.log("Response:", json);
}

run().catch(console.error);
