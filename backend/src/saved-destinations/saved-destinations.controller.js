import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';

export const getSavedDestinations = async (req, res, next) => {
  try {
    const saved = await prisma.savedDestination.findMany({
      where: { user_id: req.user.id },
      orderBy: { created_at: 'desc' },
      include: {
        city: {
          include: {
            _count: { select: { activities: true } }
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { saved: saved.map((s) => s.city) }
    });
  } catch (error) {
    next(error);
  }
};

export const saveDestination = async (req, res, next) => {
  try {
    const { city_id } = req.body;

    if (!city_id) {
      throw new AppError('City ID is required', 400, 'VALIDATION_ERROR');
    }

    const cityId = parseInt(city_id, 10);
    const city = await prisma.city.findUnique({
      where: { id: cityId }
    });

    if (!city) {
      throw new AppError('City not found', 404, 'NOT_FOUND');
    }

    const saved = await prisma.savedDestination.upsert({
      where: {
        user_id_city_id: {
          user_id: req.user.id,
          city_id: cityId
        }
      },
      update: {},
      create: {
        user_id: req.user.id,
        city_id: cityId
      },
      include: { city: true }
    });

    res.status(201).json({
      success: true,
      data: { destination: saved.city }
    });
  } catch (error) {
    next(error);
  }
};

export const removeSavedDestination = async (req, res, next) => {
  try {
    const cityId = parseInt(req.params.cityId, 10);

    if (isNaN(cityId)) {
      throw new AppError('Invalid city ID', 400, 'VALIDATION_ERROR');
    }

    await prisma.savedDestination.deleteMany({
      where: {
        user_id: req.user.id,
        city_id: cityId
      }
    });

    res.status(200).json({
      success: true,
      data: { message: 'Destination removed from saved list' }
    });
  } catch (error) {
    next(error);
  }
};
