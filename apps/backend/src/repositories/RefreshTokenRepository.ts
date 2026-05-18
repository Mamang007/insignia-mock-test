import prisma from '../lib/prisma';

export const refreshTokenRepository = {
  create: async (userId: string, token: string, expiresAt: Date) => {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  },

  findByToken: async (token: string) => {
    return prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });
  },

  deleteByToken: async (token: string) => {
    return prisma.refreshToken.delete({
      where: { token },
    });
  },

  deleteByUserId: async (userId: string) => {
    return prisma.refreshToken.deleteMany({
      where: { userId },
    });
  },
};
