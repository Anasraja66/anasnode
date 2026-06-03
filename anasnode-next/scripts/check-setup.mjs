import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const m = await p.platformMetaSettings.findUnique({ where: { id: "default" } });
const w = await p.integrationCredential.findMany({ where: { type: "whatsapp" } });
console.log(JSON.stringify({ meta: m, whatsapp: w }, null, 2));
await p.$disconnect();
