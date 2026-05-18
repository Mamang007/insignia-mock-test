import { Request, Response } from 'express';
import { healthService } from '../services/HealthService';

export const healthController = {
  getHealth: async (req: Request, res: Response) => {
    try {
      const healthStatus = await healthService.getHealthStatus();
      res.json(healthStatus);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  }
};
