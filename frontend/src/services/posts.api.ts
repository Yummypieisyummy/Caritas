import api from './axios';
import { PostFilters, PostRequest, PostResponse } from '../types/posts';

// map frontend labels to DB enums
const POST_TYPE_MAP = {
  'Volunteer Request': 'volunteer_request',
  'Volunteer Offer': 'volunteer_offer',
  'Item Request': 'item_request',
  'Item Offer': 'item_offer',
};

export const createPostRequest = async (data: PostRequest) => {
  const payload = {
    title: data.title,
    description: data.description,
    post_type: POST_TYPE_MAP[data.postType],
    event_type: data.eventType,
    additional_details: data.additionalDetails ?? null,
    location: data.address,
    date_start: data.startDate,
    date_end: data.endDate ?? null,
    days_of_week:
      data.eventType === 'recurring' ? (data.recurringDays ?? []) : null,
    requirements: data.requirements ?? [],
    contact_email: data.email,
    contact_phone: data.phoneNumber,
  };

  const res = await api.post<PostResponse>('/posts', payload);
  return res.data;
};

const buildPostParams = (filters?: PostFilters) => ({
  post_type: filters?.post_type,
  event_type: filters?.event_type,
  daysNeeded: filters?.daysNeeded?.length
    ? filters.daysNeeded.join(',')
    : undefined,
  requirements: filters?.requirements?.length
    ? filters.requirements.join(',')
    : undefined,
  userLat: filters?.userLat,
  userLng: filters?.userLng,
  maxDistanceMiles: filters?.maxDistanceMiles,
});

export const getOrgPostsRequest = async (filters?: PostFilters) => {
  const res = await api.get<PostResponse[]>('/posts', {
    params: buildPostParams(filters),
  });
  return res.data;
};

export const getPublicPostsRequest = async (filters?: PostFilters) => {
  const res = await api.get<PostResponse[]>('/posts/public', {
    params: buildPostParams(filters),
  });
  return res.data;
};

export const updatePostStatusRequest = async (
  postId: string,
  newStatus: 'active' | 'closed',
) => {
  const res = await api.patch<PostResponse>(`/posts/update/status/${postId}`, {
    status: newStatus,
  });
  return res.data;
};

export const deletePostRequest = async (postId: string) => {
  await api.delete(`/posts/${postId}`);
};
