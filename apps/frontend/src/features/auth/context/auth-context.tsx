import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';
import type { AuthContextType } from '../types';
import type { User, ApiResponse } from 'shared';
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

  const logoutMutation = useMutation({
    mutationFn: () => apiClient.post('/auth/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['me'], null);
      queryClient.clear(); // Clear everything including cache
      navigate({ to: '/login' });
    },
  });

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
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
