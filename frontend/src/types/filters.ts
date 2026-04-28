export type FiltersType = {
  post_type: string;
  event_type: string;
  searchQuery: string;
  daysNeeded: string[];
  requirements: string[];
  maxDistanceMiles: string;
  userLat: number | null;
  userLng: number | null;
};

export const defaultFilters: FiltersType = {
  post_type: '',
  event_type: '',
  searchQuery: '',
  daysNeeded: [],
  requirements: [],
  maxDistanceMiles: '',
  userLat: null,
  userLng: null,
};
