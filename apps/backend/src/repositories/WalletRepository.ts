import prisma from '../lib/prisma';
import { TransactionType } from '@prisma/client';

export const walletRepository = {
  getUserBalance: async (userId: string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true, username: true }
    });
    return user;
  },

  getAllBalances: async () => {
    return prisma.user.findMany({
      select: { id: true, username: true, balance: true, role: true },
      orderBy: { username: 'asc' }
    });
  },

  topup: async (userId: string, amount: number) => {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } }
      });

      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.TOPUP,
          amount,
          receiverId: userId
        }
      });

      return { user, transaction };
    });
  },

  transfer: async (senderId: string, receiverId: string, amount: number) => {
    return prisma.$transaction(async (tx) => {
      // 1. Deduct from sender
      const sender = await tx.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } }
      });

      // 2. Add to receiver
      const receiver = await tx.user.update({
        where: { id: receiverId },
        data: { balance: { increment: amount } }
      });

      // 3. Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          type: TransactionType.TRANSFER,
          amount,
          senderId,
          receiverId
        }
      });

      return { sender, receiver, transaction };
    });
  },

  getTransactionsByUserId: async (userId: string) => {
    return prisma.transaction.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  getAllTransactions: async () => {
    return prisma.transaction.findMany({
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
};
