import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export class AdminService {
    static async listAccounts() {
        logger.info("Admin listing accounts");
        return prisma.account.findMany({ orderBy: { createdAt: "desc" } });
    }

    static async getFailedWorkflows() {
        logger.info("Admin fetching failed workflows");
        return prisma.workflow.findMany({
            where: { stats: { contains: '"failed"' } },
            orderBy: { updatedAt: "desc" },
        });
    }

    static async getAuditLogs(limit = 50) {
        logger.info("Admin fetching audit logs", { limit });
        return prisma.auditLog.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
        });
    }
}
