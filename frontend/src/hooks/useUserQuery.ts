import { useQuery } from '@tanstack/react-query';
import { refreshRequest } from '../services/auth.api';
import { setAccessToken } from '../services/axios';

export const useUserQuery = () => {
  return useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const data = await refreshRequest();
        setAccessToken(data.accessToken);
        return data;
      } catch (error) {
        setAccessToken(null);
        throw error;
      }
    },

    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
