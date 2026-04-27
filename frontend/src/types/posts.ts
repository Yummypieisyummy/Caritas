// export type PostRequest = {
//   title: string;
//   description: string;
//   postType:
//     | 'Volunteer Request'
//     | 'Volunteer Offer'
//     | 'Item Request'
//     | 'Item Offer';
//   eventType: 'one-time' | 'recurring';
//   startDate: string;
//   address: string;
//   email: string;
//   phoneNumber: string;
//   endDate?: string;
//   recurringDays?: string[];
//   additionalDetails?: string;
// };

// export interface PostResponse {
//   id: string;
//   org_id: string;
//   postType:
//     | 'volunteer_request'
//     | 'volunteer_offer'
//     | 'item_request'
//     | 'item_offer';
//   eventType: 'one-time' | 'recurring';
//   title: string;
//   description: string;
//   additionalDetails: string;
//   location: string;
//   latitude: number | null;
//   longitude: number | null;
//   date_start: string;
//   date_end: string | null;
//   days_of_week: string[] | null;
//   contact_email: string;
//   interested: number;
//   status: 'active' | 'closed';
//   contact_phone: string;
//   created_at: string;
// }

export type PostRequest = {
  title: string;
  description: string;
  postType:
    | 'Volunteer Request'
    | 'Volunteer Offer'
    | 'Item Request'
    | 'Item Offer';
  eventType: 'one-time' | 'recurring';
  startDate: string;
  address: string;
  email: string;
  phoneNumber: string;
  endDate?: string;
  recurringDays?: string[];
  additionalDetails?: string;
  tagIds?: number[];
};

export type PostFilters = {
  post_type?: PostResponse['post_type'];
  event_type?: PostResponse['event_type'];
  daysNeeded?: string[];
  requirements?: string[];
  userLat?: number;
  userLng?: number;
  maxDistanceMiles?: number;
};

export type TagResponse = {
  id: number;
  name: string;
  color: string | null;
  display: boolean;
};

export type PostTag = TagResponse;

export interface PostResponse {
  id: string;
  org_id: string;
  org_name?: string; // Add this line
  post_type:
    | 'volunteer_request'
    | 'volunteer_offer'
    | 'item_request'
    | 'item_offer';
  event_type: 'one-time' | 'recurring';
  title: string;
  description: string;
  additional_details: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  distance_miles?: number | string | null;
  tags?: PostTag[];
  date_start: string;
  date_end: string | null;
  days_of_week: string[] | null;
  contact_email: string;
  interested: number;
  status: 'active' | 'closed';
  contact_phone: string;
  created_at: string;
}
