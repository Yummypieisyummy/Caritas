export type FiltersType = {
  category: string[];
  daysNeeded: string[];
  distance: string;
  foodType: string[];
  requirements: string[];
  physicalRequirements: string[];
  orgType: string;
  timeOption: string;
  specialOptions: string[];
  urgency: string;
};

export const defaultFilters: FiltersType = {
  category: [],
  daysNeeded: [],
  distance: '',
  foodType: [],
  requirements: [],
  physicalRequirements: [],
  orgType: '',
  timeOption: '',
  specialOptions: [],
  urgency: '',
};
