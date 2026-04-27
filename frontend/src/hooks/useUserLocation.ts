import { useCallback, useState } from 'react';

type UserLocationState = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
  requestLocation: () => void;
};

export const useUserLocation = () => {
  const [location, setLocation] = useState<UserLocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: false,
    requestLocation: () => {},
  });

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation((current) => ({
        ...current,
        error: 'Geolocation is not supported by this browser.',
        isLoading: false,
      }));
      return;
    }

    setLocation((current) => ({
      ...current,
      error: null,
      isLoading: true,
    }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation((current) => ({
          ...current,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        }));
      },
      (error) => {
        setLocation((current) => ({
          ...current,
          latitude: null,
          longitude: null,
          error: error.message || 'Unable to access your location.',
          isLoading: false,
        }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 5 * 60 * 1000,
      },
    );
  }, []);

  return {
    ...location,
    requestLocation,
  };
};
