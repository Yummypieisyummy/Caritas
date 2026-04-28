type Coordinates = {
  latitude: number;
  longitude: number;
};

const geocodeCache = new Map<string, Coordinates | null>();

const GEOCODER_USER_AGENT =
  process.env.GEOCODER_USER_AGENT ?? 'caritas-backend/1.0';

type AddressParts = {
  street: string;
  city: string;
  state: string;
  postalcode?: string;
};

function parseAddress(location: string): AddressParts | null {
  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  if (parts.length < 3) {
    return null;
  }

  const street = parts.slice(0, -2).join(', ');
  const city = parts[parts.length - 2];
  const stateZip = parts[parts.length - 1];
  const stateZipMatch = stateZip.match(
    /^([A-Za-z]{2})(?:\s+(\d{5}(?:-\d{4})?))?$/,
  );

  if (!street || !city || !stateZipMatch) {
    return null;
  }

  return {
    street,
    city,
    state: stateZipMatch[1].toUpperCase(),
    postalcode: stateZipMatch[2],
  };
}

function normalizeAddress(location: string) {
  return location.replace(/\s+/g, ' ').trim();
}

function buildSearchParams(location: string): URLSearchParams[] {
  const normalizedLocation = normalizeAddress(location);
  const addressParts = parseAddress(normalizedLocation);
  const queries: URLSearchParams[] = [];

  if (addressParts) {
    const structuredParams = new URLSearchParams({
      format: 'jsonv2',
      limit: '1',
      countrycodes: 'us',
      street: addressParts.street,
      city: addressParts.city,
      state: addressParts.state,
      country: 'United States',
    });

    if (addressParts.postalcode) {
      structuredParams.set('postalcode', addressParts.postalcode);
    }

    queries.push(structuredParams);
  }

  queries.push(
    new URLSearchParams({
      format: 'jsonv2',
      limit: '1',
      countrycodes: 'us',
      q: `${normalizedLocation}, United States`,
    }),
  );

  if (addressParts) {
    queries.push(
      new URLSearchParams({
        format: 'jsonv2',
        limit: '1',
        countrycodes: 'us',
        q: `${addressParts.city}, ${addressParts.state}, United States`,
      }),
    );
  }

  return queries;
}

async function geocodeQuery(
  params: URLSearchParams,
): Promise<Coordinates | null> {
  const queryLabel = params.get('q') ?? params.toString();
  const requestParams = new URLSearchParams(params);

  requestParams.set('addressdetails', '1');

  if (!requestParams.has('format')) {
    requestParams.set('format', 'jsonv2');
  }

  if (!requestParams.has('limit')) {
    requestParams.set('limit', '1');
  }

  if (!requestParams.has('countrycodes')) {
    requestParams.set('countrycodes', 'us');
  }

  const paramsString = requestParams.toString();

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?${paramsString}`,
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
        query: queryLabel,
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
        query: queryLabel,
        result: data[0],
      });
      return null;
    }

    return { latitude, longitude };
  } catch (error) {
    console.error('Geocoding request errored', { query: queryLabel, error });
    return null;
  }
}

export async function geocodeAddress(
  rawLocation: string,
): Promise<Coordinates | null> {
  const location = normalizeAddress(rawLocation);

  if (!location) {
    return null;
  }

  if (geocodeCache.has(location)) {
    return geocodeCache.get(location) ?? null;
  }

  const queries = buildSearchParams(location);

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
