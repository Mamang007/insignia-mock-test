import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { AuthContextType } from '../types';
import type { User, ApiResponse, LoginInput, RegisterInput } from 'shared';
import { useNavigate } from '@tanstack/react-router';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: userResponse, isLoading } = useQuery<ApiResponse<User>>({
    queryKey: ['me'],
    queryFn: () => apiClient.get('/auth/me'),
    retry: false,
    staleTime: Infinity,
  });

  const user = userResponse?.data || null;

  const loginMutation = useMutation({
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

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterInput) => {
      const response = await apiClient.post<ApiResponse<{ username: string }>>('/auth/register', data);
      return response as unknown as ApiResponse<{ username: string }>;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.clear();
      navigate({ to: '/login' });
    },
  });

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login: async (data) => loginMutation.mutateAsync(data),
    register: async (data) => registerMutation.mutateAsync(data),
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
