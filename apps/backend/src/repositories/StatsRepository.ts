import prisma from '../lib/prisma';

export const statsRepository = {
  getTopTransactions: async (userId?: string) => {
    return prisma.transaction.findMany({
      where: userId ? {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      } : {},
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } }
      },
      orderBy: { amount: 'desc' },
      take: 10
    });
  },

  getTopUsersByOutboundVolume: async () => {
    const aggregations = await prisma.transaction.groupBy({
      by: ['senderId'],
      where: {
        type: 'TRANSFER',
        senderId: { not: null }
      },
      _sum: {
        amount: true
      },
      orderBy: {
        _sum: {
          amount: 'desc'
        }
      },
      take: 10
    });

    // Fetch usernames for the top users
    const userIds = aggregations.map(a => a.senderId as string);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, username: true }
    });

    return aggregations.map(a => ({
      username: users.find(u => u.id === a.senderId)?.username,
      totalSent: a._sum.amount
    }));
  },

  getAdminTopUsers: async () => {
    // This is more complex, might be better with a raw query or multiple steps
    // For now, let's do it in steps for clarity
    
    const sentAgg = await prisma.transaction.groupBy({
      by: ['senderId'],
      where: { type: 'TRANSFER', senderId: { not: null } },
      _sum: { amount: true }
    });

    const receivedAgg = await prisma.transaction.groupBy({
      by: ['receiverId'],
      where: { type: 'TRANSFER' },
      _sum: { amount: true }
    });

    const allUserIds = new Set([
      ...sentAgg.map(a => a.senderId as string),
      ...receivedAgg.map(a => a.receiverId as string)
    ]);

    const users = await prisma.user.findMany({
      where: { id: { in: Array.from(allUserIds) } },
      select: { id: true, username: true }
    });

    const result = Array.from(allUserIds).map(id => {
      const sent = sentAgg.find(a => a.senderId === id)?._sum.amount?.toNumber() || 0;
      const received = receivedAgg.find(a => a.receiverId === id)?._sum.amount?.toNumber() || 0;
      return {
        username: users.find(u => u.id === id)?.username,
        sent,
        received,
        total: sent + received
      };
    });

    return result.sort((a, b) => b.total - a.total).slice(0, 10);
  }
};
