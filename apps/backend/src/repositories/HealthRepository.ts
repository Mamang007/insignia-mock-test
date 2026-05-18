import prisma from '../lib/prisma';

export const healthRepository = {
  getDbStatus: async (): Promise<string> => {
    try {
      // Perform a simple raw query to check connectivity
      await prisma.$queryRaw`SELECT 1`;
      return 'connected';
    } catch (error) {
      console.error('Database connection error:', error);
      return 'disconnected';
    }
  }
};
