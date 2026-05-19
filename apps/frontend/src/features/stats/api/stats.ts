import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { ApiResponse } from 'shared';

export const useTopTransactions = () => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['stats', 'top-transactions'],
    queryFn: () => apiClient.get('/stats/top-transactions'),
  });
};

export const useTopUsers = () => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['stats', 'top-users'],
    queryFn: () => apiClient.get('/stats/top-users'),
  });
};
