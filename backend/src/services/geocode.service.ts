type Coordinates = {
  latitude: number;
  longitude: number;
};

const geocodeCache = new Map<string, Coordinates | null>();

const GEOCODER_USER_AGENT =
  process.env.GEOCODER_USER_AGENT ?? 'caritas-backend/1.0';

async function geocodeQuery(query: string): Promise<Coordinates | null> {
  const params = new URLSearchParams({
    format: 'jsonv2',
    limit: '1',
    q: query,
  });

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': GEOCODER_USER_AGENT,
        },
      },
    );

    if (!response.ok) {
      console.error('Geocoding request failed', {
        status: response.status,
        statusText: response.statusText,
        query,
      });
      return null;
    }

    const data = (await response.json()) as Array<{
      lat: string;
      lon: string;
    }>;

    if (!data.length) {
      return null;
    }

    const latitude = Number(data[0].lat);
    const longitude = Number(data[0].lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      console.error('Geocoding returned invalid coordinates', {
        query,
        result: data[0],
      });
      return null;
    }

    return { latitude, longitude };
  } catch (error) {
    console.error('Geocoding request errored', { query, error });
    return null;
  }
}

function buildFallbackQueries(location: string): string[] {
  const fallbacks: string[] = [];

  if (/fraser\s+purchase/i.test(location)) {
    fallbacks.push('Saint Vincent College');
  }

  if (/habitat\s+restore/i.test(location) && /greensburg/i.test(location)) {
    fallbacks.push('Greensburg, PA');
  }

  const cityStateMatch = location.match(
    /,\s*([A-Za-z .'-]+),\s*([A-Z]{2})(?:\s+\d{5}(?:-\d{4})?)?$/,
  );

  if (cityStateMatch) {
    fallbacks.push(`${cityStateMatch[1].trim()}, ${cityStateMatch[2].trim()}`);
  }

  return Array.from(new Set(fallbacks));
}

export async function geocodeAddress(
  rawLocation: string,
): Promise<Coordinates | null> {
  const location = rawLocation.trim();

  if (!location) {
    return null;
  }

  if (geocodeCache.has(location)) {
    return geocodeCache.get(location) ?? null;
  }

  const queries = [location, ...buildFallbackQueries(location)];

  for (const query of queries) {
    const coordinates = await geocodeQuery(query);
    if (coordinates) {
      geocodeCache.set(location, coordinates);
      return coordinates;
    }
  }

  geocodeCache.set(location, null);
  return null;
}
