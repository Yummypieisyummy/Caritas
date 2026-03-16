import api from './axios';
import { PostRequest, PostResponse } from '../types/posts';

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
    contact_email: data.email,
    contact_phone: data.phoneNumber,
  };

  const res = await api.post<PostResponse>('/posts', payload);
  return res.data;
};

export const getOrgPostsRequest = async () => {
  const res = await api.get<PostResponse[]>('/posts');
  return res.data;
};

export const getPublicPostsRequest = async () => {
  const res = await api.get<PostResponse[]>('/posts/public');
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
