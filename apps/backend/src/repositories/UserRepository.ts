import prisma from '../lib/prisma';
import { RegisterInput } from '../../../../modules/shared';

export const userRepository = {
  findByUsername: async (username: string) => {
    return prisma.user.findUnique({
      where: { username },
    });
  },

  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  create: async (data: RegisterInput) => {
    return prisma.user.create({
      data: {
        username: data.username,
        password: data.password,
        role: 'USER', // Default role for registration
        balance: 0,
      },
    });
  },
};
