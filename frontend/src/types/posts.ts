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
};

export interface PostResponse {
  id: string;
  org_id: string;
  postType:
    | 'volunteer_request'
    | 'volunteer_offer'
    | 'item_request'
    | 'item_offer';
  eventType: 'one-time' | 'recurring';
  title: string;
  description: string;
  additionalDetails: string;
  location: string;
  date_start: string;
  date_end: string | null;
  days_of_week: string[] | null;
  contact_email: string;
  interested: number;
  status: 'active' | 'closed';
  contact_phone: string;
  created_at: string;
}
