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

export const getPostsRequest = async () => {
  const res = await api.get<PostResponse[]>('/posts');
  console.log(res);
  return res.data;
};
