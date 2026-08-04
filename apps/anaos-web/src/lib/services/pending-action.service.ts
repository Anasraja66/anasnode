import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export class PendingActionService {
    static async list(accountId: string) {
        logger.info("Listing pending actions", { accountId });

        return prisma.pendingAction.findMany({
            where: { accountId, status: "pending" },
            orderBy: { createdAt: "desc" },
        });
    }

    static async getById(accountId: string, id: string) {
        logger.info("Fetching pending action", { accountId, id });

        const action = await prisma.pendingAction.findUnique({ where: { id } });
        if (!action || action.accountId !== accountId) {
            throw new NotFoundError("Pending action not found");
        }

        return action;
    }

    static async approve(id: string) {
        logger.info("Approving pending action", { id });
        return prisma.pendingAction.update({ where: { id }, data: { status: "approved" } });
    }

    static async reject(id: string) {
        logger.info("Rejecting pending action", { id });
        return prisma.pendingAction.update({ where: { id }, data: { status: "rejected" } });
    }
}
