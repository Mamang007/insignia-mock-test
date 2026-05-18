export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export const API_ENDPOINTS = {
  HEALTH: '/health',
};
