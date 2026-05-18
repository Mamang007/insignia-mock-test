export const healthRepository = {
  getDbStatus: async (): Promise<string> => {
    // Mocking a database check
    return 'connected';
  }
};
