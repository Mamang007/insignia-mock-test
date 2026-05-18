import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { statsService } from '../services/StatsService';

export const statsController = {
  getTopTransactions: async (req: AuthRequest, res: Response) => {
    try {
      const { userId, role } = req.user!;
      const data = await statsService.getTopTransactions(userId, role);
      res.json({ status: 'success', data });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  getTopUsers: async (req: AuthRequest, res: Response) => {
    try {
      const { role } = req.user!;
      const data = await statsService.getTopUsers(role);
      res.json({ status: 'success', data });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};
