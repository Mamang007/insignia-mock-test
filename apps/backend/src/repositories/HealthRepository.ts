export class HealthRepository {
  async getDbStatus(): Promise<string> {
    // Mocking a database check
    return 'connected';
  }
}
