import { healthRepository } from '../repositories/HealthRepository';

export const healthService = {
  getHealthStatus: async () => {
    const dbStatus = await healthRepository.getDbStatus();
    return {
      status: 'ok',
      message: 'Backend is running!',
      dbStatus
    };
  }
};
