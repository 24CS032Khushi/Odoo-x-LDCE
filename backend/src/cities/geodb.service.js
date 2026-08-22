import prisma from '../prisma.js';

const GEODB_HOST = 'wft-geo-db.p.rapidapi.com';

// Map common country names to ISO country codes
const COUNTRY_NAME_TO_CODE = {
  india: 'IN',
  japan: 'JP',
  france: 'FR',
  italy: 'IT',
  spain: 'ES',
  greece: 'GR',
  'united arab emirates': 'AE',
  uae: 'AE',
  indonesia: 'ID',
  'united states': 'US',
  usa: 'US',
  switzerland: 'CH',
  'united kingdom': 'GB',
  uk: 'GB',
  germany: 'DE',
  thailand: 'TH',
  australia: 'AU'
};

const DEFAULT_LANDSCAPE_PHOTOS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
];

/**
 * Calls GeoDB Cities API with a fast timeout (2.5 seconds).
 * Silently falls back if API key is missing or call fails/times out.
 */
export const fetchGeoDBCities = async (searchPrefix, countryFilter) => {
  const apiKey = process.env.GEODB_API_KEY;

  if (!apiKey || !apiKey.trim() || !searchPrefix || searchPrefix.trim().length < 2) {
    return [];
  }

  const queryParams = new URLSearchParams({
    namePrefix: searchPrefix.trim(),
    limit: '5',
    sort: '-population'
  });

  if (countryFilter && countryFilter !== 'all') {
    const cleanCountry = countryFilter.trim().toLowerCase();
    const code = COUNTRY_NAME_TO_CODE[cleanCountry] || (cleanCountry.length === 2 ? cleanCountry.toUpperCase() : null);
    if (code) {
      queryParams.set('countryIds', code);
    }
  }

  const url = `https://${GEODB_HOST}/v1/geo/cities?${queryParams.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey.trim(),
        'X-RapidAPI-Host': GEODB_HOST
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[GeoDB API] Non-200 response (${response.status}): ${response.statusText}`);
      return [];
    }

    const payload = await response.json();
    if (!payload || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data.map((item) => ({
      name: item.city || item.name,
      country: item.country,
      region: item.region || item.country,
      countryCode: item.countryCode,
      latitude: item.latitude,
      longitude: item.longitude,
      population: item.population
    }));
  } catch (err) {
    clearTimeout(timeoutId);
    // Silent catch so search never fails or hangs for the user
    console.warn(`[GeoDB API] Silently skipped live fetch (${err.name === 'AbortError' ? 'Timeout 2.5s' : err.message})`);
    return [];
  }
};

/**
 * Caches newly fetched cities from GeoDB into the local PostgreSQL cities table.
 * Generates starter sightseeing activities for each new city so travelers can build itineraries immediately.
 */
export const cacheGeoDBCities = async (geoDBCities) => {
  if (!Array.isArray(geoDBCities) || geoDBCities.length === 0) {
    return [];
  }

  const cachedCities = [];

  for (const item of geoDBCities) {
    try {
      if (!item.name || !item.country) continue;

      // Check if city already exists in local DB
      const existing = await prisma.city.findFirst({
        where: {
          name: { equals: item.name.trim(), mode: 'insensitive' },
          country: { equals: item.country.trim(), mode: 'insensitive' }
        }
      });

      if (existing) {
        cachedCities.push(existing);
        continue;
      }

      // Pick a clean landscape placeholder
      const randomPhoto = DEFAULT_LANDSCAPE_PHOTOS[Math.floor(Math.random() * DEFAULT_LANDSCAPE_PHOTOS.length)];

      const newCity = await prisma.city.create({
        data: {
          name: item.name.trim(),
          country: item.country.trim(),
          region: item.region || (item.country === 'India' ? 'Asia' : 'Global'),
          cost_index: 1.00,
          popularity_score: 5.0,
          image_url: randomPhoto,
          activities: {
            create: [
              {
                name: `${item.name} Historic Center & Heritage Walking Tour`,
                category: 'sightseeing',
                description: `Explore the vibrant streets, architecture, and local culture of ${item.name}.`,
                image_url: randomPhoto,
                cost: 0.00,
                duration_minutes: 90
              },
              {
                name: `Traditional Culinary & Street Food Tasting in ${item.name}`,
                category: 'food',
                description: `Sample regional delicacies, street food, and authentic specialties of ${item.name}.`,
                image_url: randomPhoto,
                cost: 1200.00,
                duration_minutes: 75
              }
            ]
          }
        },
        include: {
          _count: { select: { activities: true } }
        }
      });

      console.log(`[GeoDB Cache] Cached new city into DB: ${newCity.name}, ${newCity.country}`);
      cachedCities.push(newCity);
    } catch (err) {
      console.warn(`[GeoDB Cache] Failed to cache city ${item.name}:`, err.message);
    }
  }

  return cachedCities;
};
