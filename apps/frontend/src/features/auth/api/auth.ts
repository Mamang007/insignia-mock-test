import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import { useNavigate } from '@tanstack/react-router';
import type { User, ApiResponse, LoginInput, RegisterInput } from 'shared';

export const useMe = () => {
  return useQuery<ApiResponse<User>>({
    queryKey: ['me'],
    queryFn: () => apiClient.get('/auth/me'),
    retry: false,
    staleTime: Infinity,
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      const response = await apiClient.post<ApiResponse<{ user: User }>>('/auth/login', data);
      return response as unknown as ApiResponse<{ user: User }>;
    },
    onSuccess: (response) => {
      if (response.data) {
        queryClient.setQueryData(['me'], { 
          data: response.data.user, 
          status: 'success', 
          message: 'Logged in' 
        });
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

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
      localStorage.removeItem('insignia_recipients');
      navigate({ to: '/login' });
    },
  });
};
