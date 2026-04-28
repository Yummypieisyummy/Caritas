import { createContext, use, ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as authServices from '../services/auth.api';
import { LoginInput, RegisterInput, User, Org } from '../types/auth';
import { setAccessToken } from '../services/axios';
import { useUserQuery } from '../hooks/useUserQuery';

type AuthStatus = 'authenticated' | 'unauthenticated' | 'loading';

type AuthContextValue = {
  user: User | null;
  org: Org | null;
  status: AuthStatus;
  register: (input: RegisterInput) => Promise<void>;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (emailToken: string) => Promise<void>;
  acceptInvite: (inviteToken: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  // React Query fetches the session automatically
  const { data, status: queryStatus } = useUserQuery();

  const register = async (input: RegisterInput) => {
    await authServices.registerRequest(input);
  };

  // Login updates the DB, Axios, and the React Query Cache
  const login = async (input: LoginInput) => {
    const res = await authServices.loginRequest(input);
    setAccessToken(res.accessToken);
    queryClient.setQueryData(['authUser'], res);
  };

  // Logout clears the DB, Axios, and the React Query Cache
  const logout = async () => {
    try {
      await authServices.logoutRequest();
    } finally {
      setAccessToken(null);
      queryClient.setQueryData(['authUser'], null);
      queryClient.removeQueries({ queryKey: ['authUser'] });
    }
  };

  const verifyEmail = async (emailToken: string) => {
    await authServices.verifyEmailRequest(emailToken);
  };

  const acceptInvite = async (inviteToken: string) => {
    await authServices.acceptInviteRequest(inviteToken);
  };

  // Map the React Query status to your App's AuthStatus
  let appStatus: AuthStatus = 'loading';

  if (queryStatus === 'pending') {
    appStatus = 'loading';
  } else if (queryStatus === 'success' && data) {
    appStatus = 'authenticated';
  } else {
    appStatus = 'unauthenticated';
  }

  return (
    <AuthContext
      value={{
        user: data?.user ?? null,
        org: data?.org ?? null,
        status: appStatus,
        register,
        login,
        logout,
        verifyEmail,
        acceptInvite,
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
