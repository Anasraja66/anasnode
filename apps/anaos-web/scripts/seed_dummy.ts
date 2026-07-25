import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  let account = await prisma.account.findFirst();
  if (!account) {
    account = await prisma.account.create({
      data: {
        id: "dummy-account-id",
        email: "test@example.com",
        name: "Test Account",
      }
    });
    console.log("Created dummy account");
  } else {
    console.log("Account already exists:", account.id);
  }
  
  let workspace = await prisma.workspace.findFirst({ where: { accountId: account.id } });
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        id: "dummy-workspace-id",
        accountId: account.id,
        name: "Test Workspace",
        industry: "general",
        slug: "test-workspace"
      }
    });
    console.log("Created dummy workspace");
  } else {
    console.log("Workspace already exists:", workspace.id);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
