import jwt from 'jsonwebtoken';
import { AuthPayload } from '../types/auth';

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export function signAccessToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET!, { expiresIn: '15m' });
}

export function signRefreshToken(payload: Pick<AuthPayload, 'user_id'>) {
  return jwt.sign(payload, JWT_REFRESH_SECRET!, { expiresIn: '30d' });
}

export function verifyRefreshToken(refreshToken: string) {
  try {
    return jwt.verify(refreshToken, JWT_REFRESH_SECRET!) as { user_id: string };
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
}
