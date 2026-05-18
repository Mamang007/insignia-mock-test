import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']).optional(),
  balance: z.number().optional(),
});

export const RegisterSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof UserSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;

export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export const API_ENDPOINTS = {
  HEALTH: '/health',
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
};
