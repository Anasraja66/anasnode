import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export class TemplateService {
    static async list(category?: string) {
        logger.info("Listing templates", { category });

        const where = category ? { category } : {};
        return prisma.template.findMany({
            where,
            orderBy: { updatedAt: "desc" },
        });
    }

    static async getById(id: string) {
        logger.info("Fetching template", { id });
        return prisma.template.findUnique({ where: { id } });
    }
}
