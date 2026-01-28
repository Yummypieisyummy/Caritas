import { createContext, use, ReactNode, useReducer } from 'react';
import { FiltersType, defaultFilters } from '../types/filters';

type FiltersAction =
  | {
      type: 'TOGGLE_OPTION'; // Checkboxes
      key: keyof FiltersType;
      value: string;
    }
  | {
      type: 'SET_SELECT'; // Drop-down selections
      key: keyof FiltersType;
      value: string | null;
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
    case 'TOGGLE_OPTION': {
      const current = state[action.key] as string[]; // Current state before change

      return {
        ...state, // Create new copy of prev state
        [action.key]: current.includes(action.value) // Update the correct property
          ? current.filter((v) => v !== action.value) // Remove value if already in current state
          : [...current, action.value],
      };
    }

    case 'SET_SELECT': {
      return {
        ...state,
        [action.key]: action.value,
      };
    }

    case 'CLEAR_FILTERS': {
      return defaultFilters;
    }
  }
};

type FiltersContextValue = {
  filters: FiltersType;
  toggleOption: (key: keyof FiltersType, value: string) => void;
  setSelect: (key: keyof FiltersType, value: string) => void;
  clearFilters: () => void;
};

const FiltersContext = createContext<FiltersContextValue | undefined>(
  undefined,
);

export const FiltersProvider = ({ children }: { children: ReactNode }) => {
  const [filters, dispatch] = useReducer(filtersReducer, defaultFilters);

  const toggleOption = (key: keyof FiltersType, value: string) => {
    dispatch({ type: 'TOGGLE_OPTION', key, value });
  };

  const setSelect = (key: keyof FiltersType, value: string) => {
    dispatch({ type: 'SET_SELECT', key, value });
  };

  const clearFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  return (
    <FiltersContext value={{ filters, toggleOption, setSelect, clearFilters }}>
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
