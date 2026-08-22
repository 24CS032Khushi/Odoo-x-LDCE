import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';

export const getActivities = async (req, res, next) => {
  try {
    const { city_id, category, max_cost, max_duration, search } = req.query;

    const where = {};

    if (city_id) {
      const parsedCityId = parseInt(city_id, 10);
      if (!isNaN(parsedCityId)) {
        where.city_id = parsedCityId;
      }
    }

    if (category && category !== 'all') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (max_cost) {
      const parsedMaxCost = parseFloat(max_cost);
      if (!isNaN(parsedMaxCost)) {
        where.cost = { lte: parsedMaxCost };
      }
    }

    if (max_duration) {
      const parsedDuration = parseInt(max_duration, 10);
      if (!isNaN(parsedDuration)) {
        where.duration_minutes = { lte: parsedDuration };
      }
    }

    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const activities = await prisma.activity.findMany({
      where,
      orderBy: [{ cost: 'asc' }, { name: 'asc' }],
      include: {
        city: {
          select: { id: true, name: true, country: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { activities }
    });
  } catch (error) {
    next(error);
  }
};
