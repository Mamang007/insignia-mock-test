import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email(),
  name: z.string().min(2),
});

export type User = z.infer<typeof UserSchema>;

export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}

export const API_ENDPOINTS = {
  HEALTH: '/health',
};
