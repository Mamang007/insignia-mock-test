import type { User, LoginInput, RegisterInput, ApiResponse } from 'shared';

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginInput) => Promise<ApiResponse<{ user: User }>>;
  register: (data: RegisterInput) => Promise<ApiResponse<{ username: string }>>;
  logout: () => Promise<void>;
}
