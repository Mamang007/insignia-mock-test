import { Request, Response } from 'express';
import { authService } from '../services/AuthService';
import { RegisterSchema, LoginSchema } from 'shared';

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const input = RegisterSchema.parse(req.body);
      const user = await authService.register(input);
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: { username: user.username }
      });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse(req.body);
      const { accessToken, refreshToken, user } = await authService.login(input);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 // 15 minutes
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        status: 'success',
        message: 'Logged in successfully',
        data: {
          user: {
            id: user.id,
            username: user.username,
            role: user.role
          }
        }
      });
    } catch (error: any) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  },

  refresh: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new Error('Refresh token missing');

      const { accessToken } = await authService.refresh(refreshToken);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });

      res.json({ status: 'success', message: 'Token refreshed' });
    } catch (error: any) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  },

  logout: async (req: Request, res: Response) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
      res.json({ status: 'success', message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  },

  getMe: async (req: Request, res: Response) => {
    // AuthRequest from middleware puts user in req.user
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }
    res.json({
      status: 'success',
      data: user
    });
  }
};
