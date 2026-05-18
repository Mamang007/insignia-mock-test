import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { walletService } from '../services/WalletService';
import { TopupSchema, TransferSchema } from '../../../../modules/shared';

export const walletController = {
  getBalance: async (req: AuthRequest, res: Response) => {
    try {
      const { userId, role } = req.user!;
      const balance = await walletService.getBalance(userId, role);
      res.json({ status: 'success', data: balance });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  topup: async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== 'USER') {
        return res.status(403).json({ status: 'error', message: 'Only users can top up' });
      }
      const input = TopupSchema.parse(req.body);
      const result = await walletService.topup(req.user.userId, input);
      res.json({ status: 'success', message: 'Top up successful', data: result });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  },

  transfer: async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== 'USER') {
        return res.status(403).json({ status: 'error', message: 'Only users can transfer funds' });
      }
      const input = TransferSchema.parse(req.body);
      const result = await walletService.transfer(req.user.userId, input);
      res.json({ status: 'success', message: 'Transfer successful', data: result });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  },

  getTransactions: async (req: AuthRequest, res: Response) => {
    try {
      const { userId, role } = req.user!;
      const transactions = await walletService.getTransactions(userId, role);
      res.json({ status: 'success', data: transactions });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
};
