import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { ApiResponse, TopupInput, User } from 'shared';

export const useBalance = () => {
  return useQuery<ApiResponse<User>>({
    queryKey: ['balance'],
    queryFn: () => apiClient.get('/wallet/balance'),
  });
};

export const useTransactions = () => {
  return useQuery<ApiResponse<any[]>>({
    queryKey: ['transactions'],
    queryFn: () => apiClient.get('/wallet/transactions'),
  });
};

export const useTopup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TopupInput) => apiClient.post<ApiResponse<void>>('/wallet/topup', data),
    onSuccess: () => {
      // Invalidate balance and me queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });
};
