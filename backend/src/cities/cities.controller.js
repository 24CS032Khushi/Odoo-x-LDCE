import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';
import { fetchGeoDBCities, cacheGeoDBCities } from './geodb.service.js';

export const getCities = async (req, res, next) => {
  try {
    const { search, country, region, min_cost, max_cost, sort } = req.query;

    const where = {};

    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { country: { contains: search.trim(), mode: 'insensitive' } },
        { region: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    if (country && country !== 'all') {
      where.country = { equals: country, mode: 'insensitive' };
    }

    if (region && region !== 'all') {
      where.region = { equals: region, mode: 'insensitive' };
    }

    if (min_cost || max_cost) {
      where.cost_index = {};
      if (min_cost) where.cost_index.gte = parseFloat(min_cost);
      if (max_cost) where.cost_index.lte = parseFloat(max_cost);
    }

    let orderBy = { popularity_score: 'desc' };
    if (sort === 'cost_asc') orderBy = { cost_index: 'asc' };
    if (sort === 'cost_desc') orderBy = { cost_index: 'desc' };
    if (sort === 'name') orderBy = { name: 'asc' };

    // 1. Query Local Seeded / Cached Cities
    let localCities = await prisma.city.findMany({
      where,
      orderBy,
      include: {
        _count: {
          select: { activities: true }
        }
      }
    });

    // 2. Hybrid GeoDB Fallback if local results are fewer than 5 and a search query is given
    if (search && search.trim().length >= 2 && localCities.length < 5) {
      try {
        const geoDBCities = await fetchGeoDBCities(search.trim(), country);
        if (geoDBCities.length > 0) {
          const cached = await cacheGeoDBCities(geoDBCities);

          // Merge any newly cached cities that aren't already in localCities list
          const existingIds = new Set(localCities.map((c) => c.id));
          const newEntries = cached.filter((c) => !existingIds.has(c.id));

          if (newEntries.length > 0) {
            localCities = [...localCities, ...newEntries];
          }
        }
      } catch (err) {
        // Silently handle any GeoDB exception so the user always gets a 200 response with local data
        console.warn('[City Search] GeoDB live search handled gracefully:', err.message);
      }
    }

    res.status(200).json({
      success: true,
      data: { cities: localCities }
    });
  } catch (error) {
    next(error);
  }
};

export const getCityById = async (req, res, next) => {
  try {
    const cityId = parseInt(req.params.id, 10);
    if (isNaN(cityId)) {
      throw new AppError('Invalid city ID', 400, 'INVALID_ID');
    }

    const city = await prisma.city.findUnique({
      where: { id: cityId },
      include: {
        activities: {
          orderBy: { cost: 'asc' }
        }
      }
    });

    if (!city) {
      throw new AppError('City not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: { city }
    });
  } catch (error) {
    next(error);
  }
};
