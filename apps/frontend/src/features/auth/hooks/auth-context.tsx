import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType } from '../types';
import { useMe, useLogin, useRegister, useLogout } from '../api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { data: userResponse, isLoading } = useMe();
  const user = userResponse?.data || null;

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();

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
