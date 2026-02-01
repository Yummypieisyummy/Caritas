import { createContext, use, ReactNode, useState, useEffect } from 'react';
import * as authServices from '../services/auth.api';
import { LoginInput, RegisterInput, User, Org } from '../types/auth';

type AuthContextValue = {
  accessToken: string | null;
  user: User | null;
  org: Org | null;
  isLoading: boolean;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (emailToken: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [org, setOrg] = useState<Org | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refresh / initial auth logic
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authServices.refreshRequest();
        setAccessToken(data.accessToken);
        setUser(data.user);
        setOrg(data.org);
      } catch (err) {
        setUser(null);
        setOrg(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const register = async (input: RegisterInput) => {
    try {
      const data = await authServices.registerRequest(input);
    } catch (err) {
      throw err; // Send error up the call stack
    }
  };

  const login = async (input: LoginInput) => {
    try {
      const data = await authServices.loginRequest(input);
      console.log('login data:', data);
      setUser(data.user);
      setOrg(data.org);
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
      setOrg(null);
      setAccessToken(null);
    } catch (err) {
      throw err;
    }
  };

  const verifyEmail = async (emailToken: string) => {
    try {
      await authServices.verifyEmailRequest(emailToken);
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext
      value={{
        accessToken,
        user,
        org,
        isLoading,
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
