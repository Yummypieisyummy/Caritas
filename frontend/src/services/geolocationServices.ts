interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export const getCurrentLocation = async (): Promise<LocationData> => {

  const status = await navigator.permissions.query({ name: "geolocation" });

  if (status.state === "denied") {
    throw new Error("Geolocation permission denied");
  }

  if (!navigator.geolocation) {
    throw new Error("Geolocation not supported");
  }

  return new Promise((resolve, reject) => {

    navigator.geolocation.getCurrentPosition(

      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        resolve({ latitude, longitude, accuracy });
      },
      (error) => reject(new Error(`Geolocation error: ${error.message}`)),
      {
        enableHighAccuracy: true,
        timeout: 10000,
      });

  });
};