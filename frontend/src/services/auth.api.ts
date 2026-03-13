import api from './axios';
import {
  RegisterInput,
  LoginInput,
  RegisterResponse,
  LoginResponse,
} from '../types/auth';

export const registerRequest = async (input: RegisterInput) => {
  const res = await api.post<RegisterResponse>('/auth/register', input);
  return res.data; // return only the data
};

export const loginRequest = async (input: LoginInput) => {
  try {
    const res = await api.post<LoginResponse>('/auth/login', input);
    return res.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Login failed');
  }
};

export const logoutRequest = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const refreshRequest = async () => {
  const res = await api.post<LoginResponse>('/auth/refresh');
  return res.data;
};

export const verifyEmailRequest = async (emailToken: string): Promise<void> => {
  await api.get('/auth/verify-email', { params: { emailToken } });
};
