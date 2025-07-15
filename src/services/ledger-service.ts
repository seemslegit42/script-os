
/**
 * @fileOverview The Sovereign Ledger Service for Obelisk Pay.
 * 
 * This service is the heart of the ΛΞVON OS economy. It provides the core
 * functionalities for managing user wallets (Aether balances) and recording
 * all transactions in an immutable ledger, as per the Obelisk Pay doctrine.
 * All interactions with the UserWallet and Transaction models must go through this service.
 */

import prisma from '@/lib/prisma';
import { User, UserWallet, Transaction } from '@prisma/client';

/**
 * Retrieves a user's wallet by their user ID.
 * If a wallet doesn't exist, it creates one with a starting balance.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<UserWallet>} The user's wallet.
 */
export async function getWalletByUserId(userId: string): Promise<UserWallet> {
  let wallet = await prisma.userWallet.findUnique({
    where: { userId },
  });

  if (!wallet) {
    wallet = await prisma.userWallet.create({
      data: {
        userId,
        balance: BigInt(10000), // Founder's Ξ grant
      },
    });
  }
  return wallet;
}

/**
 * Retrieves all transactions for a given user, ordered by most recent.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Transaction[]>} A list of the user's transactions.
 */
export async function getTransactionsForUser(userId: string): Promise<Transaction[]> {
  return prisma.transaction.findMany({
    where: {
      OR: [
        { fromUserId: userId },
        { toUserId: userId },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50, // Limit to the last 50 transactions for performance
  });
}

/**
 * Creates a new transaction in the immutable ledger.
 * This is a foundational function for all economic activity.
 * @param {string} fromUserId - The ID of the user sending Ξ.
 * @param {string} toUserId - The ID of the user receiving Ξ.
 * @param {bigint} amount - The amount of Ξ being transferred.
 * @param {string} memo - A description of the transaction.
 * @returns {Promise<Transaction>} The newly created transaction record.
 */
export async function createTransaction(fromUserId: string, toUserId: string, amount: bigint, memo: string): Promise<Transaction> {
  // In a real implementation, this would be a database transaction
  // to ensure atomicity of debiting and crediting wallets.
  
  // For now, we just log the transaction.
  const transaction = await prisma.transaction.create({
    data: {
      fromUserId,
      toUserId,
      amount,
      memo,
      aegisSignature: 'unsigned_v1_dev', // Placeholder for Aegis cryptographic signature
    },
  });

  return transaction;
}

/**
 * A comprehensive function to get all usage details for a workspace.
 * In a multi-user workspace, this would aggregate data. For now, it's user-centric.
 * @param {string} userId - The ID of the user whose workspace details are needed.
 * @returns {Promise<object>} An object containing plan details, usage, and transactions.
 */
export async function getUsageDetails(userId: string) {
    const wallet = await getWalletByUserId(userId);
    const transactions = await getTransactionsForUser(userId);

    // Mocking plan and action usage for now
    const usage = {
        planName: 'Artisan',
        actionsUsed: 812, // This would come from a separate tracking service
        actionLimit: 2000,
        aetherBalance: Number(wallet.balance),
        transactions: transactions.map(tx => ({
            id: tx.id,
            // Determine type based on if the user is sender or receiver
            type: tx.fromUserId === userId ? 'DEBIT' : 'CREDIT', 
            description: tx.memo,
            amount: Number(tx.amount),
            timestamp: tx.createdAt.toISOString(),
        })),
    };
    return usage;
}
