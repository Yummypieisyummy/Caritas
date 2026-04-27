import { useQuery } from '@tanstack/react-query';
import * as postsServices from '../services/posts.api';
import { TagResponse } from '../types/posts';

export const useAvailableTags = () => {
  const { data: tags = [], status } = useQuery<TagResponse[]>({
    queryKey: ['availableTags'],
    queryFn: postsServices.getAvailableTagsRequest,
  });

  return {
    tags,
    status,
  };
};
