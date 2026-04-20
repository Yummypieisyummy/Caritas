import { PostResponse } from '../types/posts';
import * as postsServices from '../services/posts.api';
import { useQuery } from '@tanstack/react-query';

export const usePublicPosts = () => {
  const { data: publicPosts = [], status } = useQuery<PostResponse[]>({
    queryKey: ['publicPosts'],
    queryFn: postsServices.getPublicPostsRequest,
    staleTime: 30 * 60 * 1000, // 30 minutes for public posts to keep directory feeling fast
  });

  return {
    publicPosts,
    status,
  };
};
