import { HealthRepository } from '../repositories/HealthRepository';

export class HealthService {
  private healthRepository: HealthRepository;

  constructor() {
    this.healthRepository = new HealthRepository();
  }

  async getHealthStatus() {
    const dbStatus = await this.healthRepository.getDbStatus();
    return {
      status: 'ok',
      message: 'Backend is running!',
      dbStatus
    };
  }
}
