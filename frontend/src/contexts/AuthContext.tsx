import { createContext, use, ReactNode, useState } from 'react';
import * as authServices from '../services/auth.api';
import { LoginInput, RegisterInput, User } from '../types/auth';

type AuthContextValue = {
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const register = async (input: RegisterInput) => {
    try {
      const data = await authServices.registerRequest(input);
      console.log('register response:', data);
    } catch (err) {
      throw err; // Send error up the call stack
    }
  };

  const login = async (input: LoginInput) => {
    try {
      const data = await authServices.loginRequest(input);
      console.log('login response:', data);

      setUser(data.user);
      setAccessToken(data.accessToken);
      // Set org data from some sort of org context file
    } catch (err) {
      throw err; // Send error up the call stack
    }
  };

  const logout = async () => {
    try {
      await authServices.logoutRequest();
      setUser(null);
      setAccessToken(null);
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext value={{ register, login, logout }}>{children}</AuthContext>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
