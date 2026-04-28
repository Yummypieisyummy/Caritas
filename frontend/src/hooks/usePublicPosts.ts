import { PostResponse } from '../types/posts';
import * as postsServices from '../services/posts.api';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useFilters } from '../contexts/FiltersContext';

const POST_TYPES = [
  'volunteer_request',
  'volunteer_offer',
  'item_request',
  'item_offer',
] as const;

const EVENT_TYPES = ['one-time', 'recurring'] as const;

const getEnumValue = <T extends readonly string[]>(
  value: string,
  allowedValues: T,
): T[number] | undefined => {
  return (allowedValues as readonly string[]).includes(value)
    ? (value as T[number])
    : undefined;
};

const getPositiveNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const usePublicPosts = () => {
  const { filters } = useFilters();
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(
    filters.searchQuery,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(filters.searchQuery.trim());
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [filters.searchQuery]);

  const postFilters = useMemo(
    () => ({
      post_type: getEnumValue(filters.post_type, POST_TYPES),
      event_type: getEnumValue(filters.event_type, EVENT_TYPES),
      daysNeeded: filters.daysNeeded.length ? filters.daysNeeded : undefined,
      requirements: filters.requirements.length
        ? filters.requirements
        : undefined,
      searchQuery: debouncedSearchQuery || undefined,
      userLat: filters.userLat ?? undefined,
      userLng: filters.userLng ?? undefined,
      maxDistanceMiles: getPositiveNumber(filters.maxDistanceMiles),
    }),
    [
      debouncedSearchQuery,
      filters.daysNeeded,
      filters.event_type,
      filters.maxDistanceMiles,
      filters.post_type,
      filters.requirements,
      filters.userLat,
      filters.userLng,
    ],
  );

  const { data: publicPosts = [], status } = useQuery<PostResponse[]>({
    queryKey: ['publicPosts', postFilters],
    queryFn: () => postsServices.getPublicPostsRequest(postFilters),
    staleTime: 30 * 60 * 1000, // 30 minutes for public posts to keep directory feeling fast
  });

  return {
    publicPosts,
    status,
  };
};
