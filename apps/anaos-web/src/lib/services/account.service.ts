import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export class AccountService {
    static async getAccount(accountId: string) {
        logger.info("Loading account", { accountId });

        const account = await prisma.account.findUnique({
            where: { id: accountId },
            include: {
                workspaces: true,
            },
        });

        if (!account) {
            throw new NotFoundError("Account not found");
        }

        return account;
    }

    static async listAccounts() {
        logger.info("Listing platform accounts");
        return prisma.account.findMany({
            orderBy: { createdAt: "desc" },
        });
    }
}
