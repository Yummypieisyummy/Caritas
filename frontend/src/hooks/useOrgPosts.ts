import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as postsServices from '../services/posts.api';
import { PostResponse, PostRequest } from '../types/posts';

export const useOrgPosts = () => {
  const queryClient = useQueryClient();

  const { data: orgPosts = [], status } = useQuery<PostResponse[]>({
    queryKey: ['orgPosts'],
    queryFn: () => postsServices.getOrgPostsRequest(),
  });

  const createMutation = useMutation({
    mutationFn: (data: PostRequest) => postsServices.createPostRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgPosts'] });
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
      queryClient.invalidateQueries({ queryKey: ['orgPosts'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: postsServices.deletePostRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orgPosts'] });
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
