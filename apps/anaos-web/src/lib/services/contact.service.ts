import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export class ContactService {
  static async getById(id: string, accountId: string) {
    logger.info('Fetching contact by ID', { id, accountId });
    
    // In our schema, contacts are stored in InboxConversation
    const contact = await prisma.inboxConversation.findFirst({
      where: { id, accountId }
    });

    if (!contact) {
      throw new NotFoundError('Contact not found');
    }

    return contact;
  }

  static async listByAccount(accountId: string) {
    logger.info('Listing contacts for account', { accountId });
    return prisma.inboxConversation.findMany({
      where: { accountId },
      orderBy: { updatedAt: 'desc' }
    });
  }

  static async update(id: string, accountId: string, data: any) {
    logger.info('Updating contact', { id, accountId, data });
    
    const contact = await this.getById(id, accountId);

    return prisma.inboxConversation.update({
      where: { id: contact.id },
      data
    });
  }

  static async delete(id: string, accountId: string) {
    logger.info('Deleting contact', { id, accountId });
    
    const contact = await this.getById(id, accountId);

    return prisma.inboxConversation.delete({
      where: { id: contact.id }
    });
  }
}
