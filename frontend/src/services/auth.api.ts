import api from './axios';
import {
  RegisterInput,
  LoginInput,
  RegisterResponse,
  LoginResponse,
} from '../types/auth';

export const registerRequest = async (
  input: RegisterInput,
): Promise<RegisterResponse> => {
  try {
    const res = await api.post<RegisterResponse>('/auth/register', input);
    return res.data; // return only the data
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const loginRequest = async (
  input: LoginInput,
): Promise<LoginResponse> => {
  try {
    const res = await api.post<LoginResponse>('/auth/login', input);
    return res.data;
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const logoutRequest = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (err: any) {
    throw err.response?.data || err;
  }
};

export const verifyEmailRequest = async (emailToken: string): Promise<void> => {
  try {
    await api.get('/auth/verify-email', { params: { emailToken } });
  } catch (err: any) {
    throw err.response?.data || err;
  }
};
