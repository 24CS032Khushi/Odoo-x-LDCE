import prisma from '../prisma.js';

const CITY_PHOTOS_CATALOG = {
  ahmedabad: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  surat: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  vadodara: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
  rajkot: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  bengaluru: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
  hyderabad: 'https://images.unsplash.com/photo-1572445271230-a78b5944a659?auto=format&fit=crop&w=1200&q=80',
  chennai: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
  kolkata: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=1200&q=80',
  pune: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=1200&q=80',
  amritsar: 'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=80',
  shimla: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  srinagar: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
  rishikesh: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
  mysore: 'https://images.unsplash.com/photo-1600100397608-f010f443834a?auto=format&fit=crop&w=1200&q=80',
  pondicherry: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  jodhpur: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  jaisalmer: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  sydney: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
  cairo: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80',
  bangkok: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
  amsterdam: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80',
};

const DEFAULT_LANDSCAPE_PHOTOS = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
];

/**
 * Searches live destinations worldwide using OpenStreetMap Nominatim Geocoding API.
 * Free, fast, zero API key required, supports fuzzy search and every Indian city.
 */
export const searchLiveDestinations = async (query, countryFilter) => {
  if (!query || query.trim().length < 2) return [];

  // Common spelling corrections (e.g., 'ahemdabad' -> 'ahmedabad')
  let cleanQuery = query.trim().toLowerCase();
  if (cleanQuery === 'ahemdabad') cleanQuery = 'ahmedabad';
  if (cleanQuery === 'banglore') cleanQuery = 'bengaluru';
  if (cleanQuery === 'bombay') cleanQuery = 'mumbai';
  if (cleanQuery === 'calcutta') cleanQuery = 'kolkata';
  if (cleanQuery === 'madras') cleanQuery = 'chennai';

  const searchUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQuery)}&format=json&addressdetails=1&limit=5`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'GlobeTrotter-Smart-Travel-Planner/1.0',
        'Accept-Language': 'en'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return [];

    const results = [];
    const seenNames = new Set();

    for (const item of data) {
      const address = item.address || {};
      const cityName = address.city || address.town || address.municipality || address.village || address.state_district || item.name;
      const countryName = address.country || 'India';
      const stateName = address.state || address.region || '';

      if (!cityName || seenNames.has(cityName.toLowerCase())) continue;
      seenNames.add(cityName.toLowerCase());

      // Region determination
      let region = 'Global';
      if (countryName.toLowerCase() === 'india') {
        region = 'Asia';
      } else if (['france', 'italy', 'spain', 'germany', 'united kingdom', 'greece', 'switzerland', 'netherlands'].includes(countryName.toLowerCase())) {
        region = 'Europe';
      } else if (['japan', 'indonesia', 'thailand', 'singapore', 'china', 'vietnam'].includes(countryName.toLowerCase())) {
        region = 'Asia';
      } else if (['united arab emirates', 'qatar', 'saudi arabia', 'egypt', 'jordan'].includes(countryName.toLowerCase())) {
        region = 'Middle East';
      } else if (['united states', 'canada', 'brazil', 'mexico'].includes(countryName.toLowerCase())) {
        region = 'Americas';
      }

      // Check country filter
      if (countryFilter && countryFilter !== 'all') {
        if (countryFilter.toLowerCase() === 'india' && countryName.toLowerCase() !== 'india') continue;
      }

      // Resolve scenic photo
      const key = cityName.toLowerCase();
      const photoUrl = CITY_PHOTOS_CATALOG[key] || DEFAULT_LANDSCAPE_PHOTOS[Math.floor(Math.random() * DEFAULT_LANDSCAPE_PHOTOS.length)];

      results.push({
        name: cityName,
        country: countryName,
        region,
        state: stateName,
        image_url: photoUrl,
        lat: item.lat,
        lon: item.lon
      });
    }

    return results;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('[Live Places Search] Handled gracefully:', err.message);
    return [];
  }
};

/**
 * Persists dynamically found live destinations into PostgreSQL and generates starter attractions.
 */
export const persistLiveDestinations = async (destinations) => {
  if (!Array.isArray(destinations) || destinations.length === 0) return [];

  const savedCities = [];

  for (const item of destinations) {
    try {
      // Check if already in DB
      let existing = await prisma.city.findFirst({
        where: {
          name: { equals: item.name.trim(), mode: 'insensitive' }
        },
        include: {
          activities: true,
          _count: { select: { activities: true } }
        }
      });

      if (existing) {
        savedCities.push(existing);
        continue;
      }

      const isIndia = item.country.toLowerCase() === 'india';
      const costIndex = isIndia ? 0.70 : 1.50;
      const popScore = isIndia ? 9.5 : 8.8;

      const newCity = await prisma.city.create({
        data: {
          name: item.name.trim(),
          country: item.country.trim(),
          region: item.region || 'Asia',
          cost_index: costIndex,
          popularity_score: popScore,
          image_url: item.image_url,
          activities: {
            create: [
              {
                name: `${item.name} Historic Old Town & Heritage Walking Tour`,
                category: 'culture',
                description: `Discover the iconic landmarks, historic architecture, and rich local heritage of ${item.name}.`,
                image_url: item.image_url,
                cost: 0.00,
                duration_minutes: 120
              },
              {
                name: `Famous Street Food & Culinary Specialties of ${item.name}`,
                category: 'food',
                description: `Sample regional delicacies, traditional recipes, and famous street food stalls in ${item.name}.`,
                image_url: item.image_url,
                cost: isIndia ? 450.00 : 1500.00,
                duration_minutes: 90
              },
              {
                name: `${item.name} Iconic City Panorama & Sunset Viewpoint`,
                category: 'sightseeing',
                description: `Enjoy breathtaking panoramic sunset views and photography spots across ${item.name}.`,
                image_url: item.image_url,
                cost: isIndia ? 200.00 : 800.00,
                duration_minutes: 75
              }
            ]
          }
        },
        include: {
          activities: true,
          _count: { select: { activities: true } }
        }
      });

      console.log(`[Live Places API] Dynamically added new destination: ${newCity.name}, ${newCity.country}`);
      savedCities.push(newCity);
    } catch (err) {
      console.warn(`[Live Places API] Failed to save city ${item.name}:`, err.message);
    }
  }

  return savedCities;
};
