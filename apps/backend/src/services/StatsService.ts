import { statsRepository } from '../repositories/StatsRepository';

export const statsService = {
  getTopTransactions: async (userId: string, role: string) => {
    if (role === 'ADMIN') {
      return statsRepository.getTopTransactions();
    }
    return statsRepository.getTopTransactions(userId);
  },

  getTopUsers: async (role: string) => {
    if (role === 'ADMIN') {
      return statsRepository.getAdminTopUsers();
    }
    return statsRepository.getTopUsersByOutboundVolume();
  }
};
