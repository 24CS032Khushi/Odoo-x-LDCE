import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';
import { searchLiveDestinations, persistLiveDestinations } from './places.service.js';

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

    // 2. Live Global & Indian Places Search (OpenStreetMap + Geo Database)
    // If local results are fewer than 3 and search query is at least 2 characters:
    if (search && search.trim().length >= 2) {
      try {
        const liveDestinations = await searchLiveDestinations(search.trim(), country);
        if (liveDestinations.length > 0) {
          const cached = await persistLiveDestinations(liveDestinations);

          const existingIds = new Set(localCities.map((c) => c.id));
          const newEntries = cached.filter((c) => !existingIds.has(c.id));

          if (newEntries.length > 0) {
            localCities = [...localCities, ...newEntries];
          }
        }
      } catch (liveErr) {
        console.warn('[Places Search API] Skipped live fetch:', liveErr.message);
      }
    }

    // 3. Incredible India Focus Priority: Place Indian destinations at the top by default
    if (!search && !country && !sort) {
      localCities.sort((a, b) => {
        const aIndia = a.country?.toLowerCase() === 'india' ? 1 : 0;
        const bIndia = b.country?.toLowerCase() === 'india' ? 1 : 0;
        if (aIndia !== bIndia) return bIndia - aIndia;
        return (b.popularity_score || 0) - (a.popularity_score || 0);
      });
    }

    res.status(200).json({
      success: true,
      data: {
        cities: localCities,
        count: localCities.length,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getCityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const city = await prisma.city.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        activities: true,
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

export const getRecommendations = async (req, res, next) => {
  try {
    const { interests } = req.query;

    let userInterests = [];
    if (interests) {
      userInterests = interests.split(',').map((i) => i.trim().toLowerCase());
    } else if (req.user?.interests) {
      userInterests = req.user.interests.split(',').map((i) => i.trim().toLowerCase());
    }

    const cities = await prisma.city.findMany({
      include: {
        activities: true,
        _count: { select: { activities: true } }
      }
    });

    const scored = cities.map((city) => {
      let score = 50; // base score
      let matchReason = 'Popular global destination';

      // 1. Incredible India Priority Boost (+10 points to prioritize Indian destinations)
      const isIndia = city.country?.toLowerCase() === 'india';
      if (isIndia) {
        score += 10;
        matchReason = 'Incredible India • Top cultural & heritage hotspot';
      }

      // 2. Activity / Category Matching with User Passions
      const cityCategories = city.activities.map((a) => a.category.toLowerCase());
      const matchingInterests = userInterests.filter((interest) =>
        cityCategories.includes(interest)
      );

      if (matchingInterests.length > 0) {
        score += matchingInterests.length * 15;
        if (isIndia) {
          matchReason = `Incredible India • Top match for ${matchingInterests.join(' & ')}`;
        } else {
          matchReason = `Matches your passion for ${matchingInterests.join(' & ')}`;
        }
      }

      // 3. Popularity score influence
      score += Math.round(parseFloat(city.popularity_score || 5) * 4);

      // Cap score at 99
      const finalScore = Math.min(99, Math.max(65, score));

      return {
        ...city,
        match_score: finalScore,
        match_reason: matchReason,
      };
    });

    // Sort descending by match score
    scored.sort((a, b) => b.match_score - a.match_score);

    res.status(200).json({
      success: true,
      data: {
        recommendations: scored,
        count: scored.length,
      }
    });
  } catch (error) {
    next(error);
  }
};
