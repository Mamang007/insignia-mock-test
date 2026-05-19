import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { LoginInput, RegisterInput, ApiResponse, User } from '../../../../../../modules/shared';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await apiClient.post<ApiResponse<{ user: User }>>('/auth/login', data);
      return response as unknown as ApiResponse<{ user: User }>; // Casting because of interceptor
    },
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(['me'], { data: response.data.user });
      }
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await apiClient.post<ApiResponse<{ username: string }>>('/auth/register', data);
      return response as unknown as ApiResponse<{ username: string }>;
    },
  });
};
