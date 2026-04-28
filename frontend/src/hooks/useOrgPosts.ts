import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as postsServices from '../services/posts.api';
import { PostResponse, PostRequest } from '../types/posts';

export const useOrgPosts = () => {
  const queryClient = useQueryClient();

  const refreshPostCaches = () => {
    queryClient.invalidateQueries({ queryKey: ['orgPosts'] });
    queryClient.invalidateQueries({ queryKey: ['publicPosts'] });
    queryClient.invalidateQueries({ queryKey: ['orgProfile'] });
  };

  const { data: orgPosts = [], status } = useQuery<PostResponse[]>({
    queryKey: ['orgPosts'],
    queryFn: () => postsServices.getOrgPostsRequest(),
  });

  const createMutation = useMutation({
    mutationFn: (data: PostRequest) => postsServices.createPostRequest(data),
    onSuccess: () => {
      refreshPostCaches();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({
      postId,
      newStatus,
    }: {
      postId: string;
      newStatus: 'active' | 'closed';
    }) => postsServices.updatePostStatusRequest(postId, newStatus),
    onSuccess: () => {
      refreshPostCaches();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: postsServices.deletePostRequest,
    onSuccess: () => {
      refreshPostCaches();
    },
  });

  return {
    orgPosts,
    status,
    createPost: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updatePostStatus: updateStatusMutation.mutateAsync,
    deletePost: deleteMutation.mutateAsync,
  };
};
