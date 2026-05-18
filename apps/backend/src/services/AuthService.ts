import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { userRepository } from '../repositories/UserRepository';
import { refreshTokenRepository } from '../repositories/RefreshTokenRepository';
import { RegisterInput, LoginInput } from '../../../../modules/shared';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET || 'access_secret';
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret';

export const authService = {
  register: async (input: RegisterInput) => {
    const existingUser = await userRepository.findByUsername(input.username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);
    return userRepository.create({
      ...input,
      password: hashedPassword,
    });
  },

  login: async (input: LoginInput) => {
    const user = await userRepository.findByUsername(input.username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      REFRESH_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await refreshTokenRepository.create(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken, user };
  },

  refresh: async (token: string) => {
    const storedToken = await refreshTokenRepository.findByToken(token);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) await refreshTokenRepository.deleteByToken(token);
      throw new Error('Invalid or expired refresh token');
    }

    const payload = jwt.verify(token, REFRESH_TOKEN_SECRET) as { userId: string };
    const user = storedToken.user;

    const accessToken = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    return { accessToken };
  },

  logout: async (token: string) => {
    await refreshTokenRepository.deleteByToken(token);
  },
};
