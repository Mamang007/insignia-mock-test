import { Request, Response } from 'express';
import { HealthService } from '../services/HealthService';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  getHealth = async (req: Request, res: Response) => {
    try {
      const healthStatus = await this.healthService.getHealthStatus();
      res.json(healthStatus);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };
}
