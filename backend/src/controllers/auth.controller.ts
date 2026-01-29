import * as authServices from '../services/auth.service';

export const register = async (req, res) => {
  const { user, org } = await authServices.register(req.body);
  res.status(201).json({ user, org });
};

export const login = async (req, res) => {
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

export const logout = async (req, res) => {
  // Clear refresh token
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: false, // Use secure in production
    sameSite: 'strict',
  });

  res.status(200).json({ message: 'Successful logout' });
};

export const refresh = async (req, res) => {
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
