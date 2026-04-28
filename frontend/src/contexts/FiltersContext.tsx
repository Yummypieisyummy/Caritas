import { createContext, use, ReactNode, useCallback, useReducer } from 'react';
import { FiltersType, defaultFilters } from '../types/filters';

type FiltersAction =
  | {
      type: 'SET_SELECT'; // Drop-down selections
      key: 'post_type' | 'event_type' | 'maxDistanceMiles';
      value: string | null;
    }
  | {
      type: 'SET_SEARCH_QUERY';
      value: string;
    }
  | {
      type: 'TOGGLE_OPTION';
      key: 'daysNeeded' | 'requirements';
      value: string;
    }
  | {
      type: 'SET_LOCATION';
      latitude: number;
      longitude: number;
    }
  | {
      type: 'CLEAR_FILTERS';
    };

// Takes current state, takes an action, returns new state
const filtersReducer = (
  state: FiltersType,
  action: FiltersAction,
): FiltersType => {
  // Function must always return a value exactly like FiltersType

  switch (action.type) {
    case 'SET_SELECT': {
      return {
        ...state,
        [action.key]: action.value ?? '',
      };
    }

    case 'SET_SEARCH_QUERY': {
      return {
        ...state,
        searchQuery: action.value,
      };
    }

    case 'TOGGLE_OPTION': {
      const currentValues = state[action.key];

      return {
        ...state,
        [action.key]: currentValues.includes(action.value)
          ? currentValues.filter((value) => value !== action.value)
          : [...currentValues, action.value],
      };
    }

    case 'SET_LOCATION': {
      return {
        ...state,
        userLat: action.latitude,
        userLng: action.longitude,
      };
    }

    case 'CLEAR_FILTERS': {
      return defaultFilters;
    }
  }
};

type FiltersContextValue = {
  filters: FiltersType;
  setSelect: (
    key: 'post_type' | 'event_type' | 'maxDistanceMiles',
    value: string | null,
  ) => void;
  setSearchQuery: (value: string) => void;
  toggleOption: (key: 'daysNeeded' | 'requirements', value: string) => void;
  setLocation: (latitude: number, longitude: number) => void;
  clearFilters: () => void;
};

const FiltersContext = createContext<FiltersContextValue | undefined>(
  undefined,
);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, dispatch] = useReducer(filtersReducer, defaultFilters);

  const setSelect = useCallback((
    key: 'post_type' | 'event_type' | 'maxDistanceMiles',
    value: string | null,
  ) => {
    dispatch({ type: 'SET_SELECT', key, value });
  }, []);

  const setSearchQuery = useCallback((value: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', value });
  }, []);

  const toggleOption = useCallback(
    (key: 'daysNeeded' | 'requirements', value: string) => {
      dispatch({ type: 'TOGGLE_OPTION', key, value });
    },
    [],
  );

  const setLocation = useCallback((latitude: number, longitude: number) => {
    dispatch({ type: 'SET_LOCATION', latitude, longitude });
  }, []);

  const clearFilters = useCallback(() => {
    dispatch({ type: 'CLEAR_FILTERS' });
  }, []);

  return (
    <FiltersContext
      value={{
        filters,
        setSelect,
        setSearchQuery,
        toggleOption,
        setLocation,
        clearFilters,
      }}
    >
      {children}
    </FiltersContext>
  );
};

export const useFilters = () => {
  const context = use(FiltersContext);

  if (!context) {
    throw new Error('useFilter must be used within FiltersProvider');
  }

  return context;
};
