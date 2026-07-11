import { prisma } from "./src/lib/db";

async function run() {
  try {
    await prisma.platformMetaSettings.deleteMany({
      where: { id: "default" }
    });
    console.log("Deleted default row successfully.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}
run();
