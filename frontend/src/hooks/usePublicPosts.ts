import { PostResponse } from '../types/posts';
import * as postsServices from '../services/posts.api';
import { useQuery } from '@tanstack/react-query';

export const usePublicPosts = () => {
  const {
    data: publicPosts = [],
    isPending,
    isError,
  } = useQuery<PostResponse[]>({
    queryKey: ['publicPosts'],
    queryFn: async () => {
      //  Wait for 2 seconds (2000ms)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return postsServices.getPublicPostsRequest();
    },
  });

  return {
    publicPosts,
    isPending,
    isError,
  };
};
