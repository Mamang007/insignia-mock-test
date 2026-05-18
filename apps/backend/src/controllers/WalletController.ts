import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { walletService } from '../services/WalletService';
import { TopupSchema, TransferSchema } from '../../../../modules/shared';
import { ZodError } from 'zod';

export const walletController = {
  getBalance: async (req: AuthRequest, res: Response) => {
    try {
      const { userId, role } = req.user!;
      const data = await walletService.getBalance(userId, role);
      res.json({ status: 'success', data });
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
      await walletService.topup(req.user.userId, input);
      res.status(200).json({ status: 'success', message: 'Top up successful' });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ status: 'error', message: error.errors[0].message });
      }
      res.status(400).json({ status: 'error', message: error.message });
    }
  },

  transfer: async (req: AuthRequest, res: Response) => {
    try {
      if (req.user?.role !== 'USER') {
        return res.status(403).json({ status: 'error', message: 'Only users can transfer funds' });
      }
      const input = TransferSchema.parse(req.body);
      await walletService.transfer(req.user.userId, input);
      res.status(200).json({ status: 'success', message: 'Transfer successful' });
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({ status: 'error', message: error.errors[0].message });
      }
      const status = error.status || 400;
      res.status(status).json({ status: 'error', message: error.message });
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
