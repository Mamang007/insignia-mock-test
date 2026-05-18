import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    username: string;
    role: 'ADMIN' | 'USER';
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Authentication required' });
  }

  try {
    const payload = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

export const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ status: 'error', message: 'Admin access required' });
  }
  next();
};
