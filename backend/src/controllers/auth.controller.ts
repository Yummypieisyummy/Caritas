import { Request, Response } from 'express';
import * as authServices from '../services/auth.service';
import * as teamServices from '../services/team.service';

export const register = async (req: Request, res: Response) => {
  const { user, org } = await authServices.register(req.body);
  res.status(201).json({ user, org });
};

export const login = async (req: Request, res: Response) => {
  const { tokens, user, org } = await authServices.login(req.body);

  // Store refresh token in http-only cookie
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: false, // Only send over HTTPS in production
    sameSite: 'strict', // Helps prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration
  });

  const accessToken = tokens.accessToken;

  res.status(200).json({ accessToken, user, org });
};

export const logout = async (_req: Request, res: Response) => {
  // Clear refresh token
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false, // Use secure in production
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Successful logout' });
};

export const refresh = async (req: Request, res: Response) => {
  const { tokens, user, org } = await authServices.refresh(
    req.cookies.refreshToken,
  );

  // Store refresh token in http-only cookie
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: false, // Only send over HTTPS in production
    sameSite: 'strict', // Helps prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiration
  });

  const accessToken = tokens.accessToken;

  res.status(200).json({ accessToken, user, org });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const emailToken = String(req.query.emailToken || '');
  await authServices.verifyEmail(emailToken);

  res.status(200).json({ message: 'Email verfied successfully' });
};

export const acceptInvite = async (req: Request, res: Response) => {
  const inviteToken = String(req.body?.token || req.query?.token || '');
  const invite = await teamServices.acceptInvite(inviteToken);

  res.status(200).json({
    message: 'Invite accepted successfully',
    invite,
  });
};
