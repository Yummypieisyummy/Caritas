import jwt from 'jsonwebtoken';
import { AuthPayload, TokenType } from '../types/auth';

const JWT_ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const JWT_EMAIL_SECRET = process.env.VERIFICATION_TOKEN_SECRET;

export function signAccessToken(payload: AuthPayload) {
  return jwt.sign(payload, JWT_ACCESS_SECRET!, { expiresIn: '15m' });
}

export function signRefreshToken(payload: Pick<AuthPayload, 'user_id'>) {
  return jwt.sign(payload, JWT_REFRESH_SECRET!, { expiresIn: '30d' });
}

export function signEmailToken(payload: Pick<AuthPayload, 'user_id'>) {
  return jwt.sign(payload, JWT_EMAIL_SECRET!, { expiresIn: '10m' });
}

export function verifyToken(token: string, type: TokenType) {
  const secret = type === 'REFRESH' ? JWT_REFRESH_SECRET : JWT_EMAIL_SECRET;

  if (!secret) {
    throw new Error(`Missing secret for ${type}`);
  }

  try {
    return jwt.verify(token, secret) as { user_id: string };
  } catch (err) {
    throw new Error('Invalid or expired refresh token');
  }
}
