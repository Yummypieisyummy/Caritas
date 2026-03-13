import { createContext, use, ReactNode, useState, useEffect } from 'react';
import * as authServices from '../services/auth.api';
import { LoginInput, RegisterInput, User, Org } from '../types/auth';
import { setAccessToken } from '../services/axios';

type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

type AuthContextValue = {
  // accessToken: string | null;
  user: User | null;
  org: Org | null;
  status: AuthStatus;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (emailToken: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');
  // const [accessToken, setAccessToken] = useState<string | null>(null);

  // Refresh / initial auth logic
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authServices.refreshRequest();

        setAccessToken(data.accessToken);
        setUser(data.user);
        setOrg(data.org);

        setStatus('authenticated');
      } catch (err) {
        setUser(null);
        setOrg(null);
        setAccessToken(null);

        setStatus('unauthenticated');
      }
    };

    initAuth();
  }, []);

  const register = async (input: RegisterInput) => {
    await authServices.registerRequest(input);
  };

  const login = async (input: LoginInput) => {
    try {
      const data = await authServices.loginRequest(input);

      setUser(data.user);
      setOrg(data.org);
      setAccessToken(data.accessToken);

      setStatus('authenticated');
    } catch (err) {
      throw err; // Send error up the call stack
    }
  };

  const logout = async () => {
    try {
      await authServices.logoutRequest();
    } finally {
      setUser(null);
      setOrg(null);
      setAccessToken(null);

      setStatus('unauthenticated');
    }
  };

  const verifyEmail = async (emailToken: string) => {
    await authServices.verifyEmailRequest(emailToken);
  };

  return (
    <AuthContext
      value={{
        user,
        org,
        status,
        register,
        login,
        logout,
        verifyEmail,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
