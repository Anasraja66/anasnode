import { prisma } from "../db";

/**
 * Grants initial trial credits to a new account.
 * Default is 500 Credits.
 */
export async function grantTrialCredits(accountId: string, amount: number = 500) {
  // Check if balance already exists
  const existing = await prisma.creditBalance.findUnique({
    where: { accountId },
  });

  if (existing) {
    return existing;
  }

  // Create balance and transaction
  const balance = await prisma.creditBalance.create({
    data: {
      accountId,
      balance: amount,
    },
  });

  await prisma.creditTransaction.create({
    data: {
      accountId,
      amount: amount,
      type: "trial_bonus",
      description: "Initial signup trial credits",
    },
  });

  return balance;
}

/**
 * Checks if an account has at least the required amount of credits.
 */
export async function hasEnoughCredits(accountId: string, requiredAmount: number): Promise<boolean> {
  const balance = await prisma.creditBalance.findUnique({
    where: { accountId },
  });

  if (!balance) return false;
  return balance.balance >= requiredAmount;
}

/**
 * Deducts credits for a specific action and logs the usage.
 * @param actionType e.g., 'voice_call_minute', 'workflow_execution'
 * @param relatedEntityId e.g., the execution ID or call ID for transparency
 */
export async function deductCredits(
  accountId: string,
  amount: number,
  actionType: string,
  description: string,
  relatedEntityId?: string
) {
  // We use a transaction to ensure balance and logs stay in sync
  return await prisma.$transaction(async (tx) => {
    // 1. Get current balance
    const balance = await tx.creditBalance.findUnique({
      where: { accountId },
    });

    if (!balance || balance.balance < amount) {
      throw new Error(`Insufficient credits. Required: ${amount}, Available: ${balance?.balance || 0}`);
    }

    // 2. Deduct from balance
    const updatedBalance = await tx.creditBalance.update({
      where: { accountId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // 3. Log the negative transaction (for the ledger)
    await tx.creditTransaction.create({
      data: {
        accountId,
        amount: -amount,
        type: "usage",
        description,
      },
    });

    // 4. Log the usage (for detailed metric reporting)
    await tx.usageLog.create({
      data: {
        accountId,
        actionType,
        creditCost: amount,
        relatedEntityId,
      },
    });

    return updatedBalance;
  });
}
