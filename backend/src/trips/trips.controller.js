import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';

const generateSlug = (name) => {
  const cleanName = (name || 'trip')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanName}-${randomSuffix}`;
};

export const createTrip = async (req, res, next) => {
  try {
    const { name, description, start_date, end_date, cover_photo_url, total_budget, is_public } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw new AppError('Trip name is required', 400, 'VALIDATION_ERROR');
    }

    const share_slug = generateSlug(name);

    const newTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          user_id: req.user.id,
          name: name.trim(),
          description: description ? description.trim() : null,
          start_date: start_date ? new Date(start_date) : null,
          end_date: end_date ? new Date(end_date) : null,
          cover_photo_url: cover_photo_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
          total_budget: total_budget ? parseFloat(total_budget) : 0.00,
          is_public: !!is_public,
          share_slug,
          status: 'planning'
        }
      });

      // Add owner to collaborators
      await tx.collaborator.create({
        data: {
          trip_id: trip.id,
          user_id: req.user.id,
          role: 'owner',
          accepted_at: new Date()
        }
      });

      return trip;
    });

    res.status(201).json({
      success: true,
      data: { trip: newTrip }
    });
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        OR: [
          { user_id: req.user.id },
          { collaborators: { some: { user_id: req.user.id } } }
        ]
      },
      orderBy: { created_at: 'desc' },
      include: {
        trip_stops: {
          orderBy: { order_index: 'asc' },
          include: {
            city: {
              select: { id: true, name: true, country: true, image_url: true }
            }
          }
        },
        _count: {
          select: {
            trip_stops: true,
            expenses: true
          }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { trips }
    });
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      throw new AppError('Invalid trip ID', 400, 'INVALID_ID');
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { user_id: req.user.id },
          { is_public: true },
          { collaborators: { some: { user_id: req.user.id } } }
        ]
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, photo_url: true }
        },
        trip_stops: {
          orderBy: { order_index: 'asc' },
          include: {
            city: true,
            itinerary_items: {
              orderBy: { order_index: 'asc' },
              include: { activity: true }
            }
          }
        },
        collaborators: {
          include: {
            user: {
              select: { id: true, name: true, email: true, photo_url: true }
            }
          }
        },
        trip_health_score: true
      }
    });

    if (!trip) {
      throw new AppError('Trip not found or you do not have permission to view it', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: { trip }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      throw new AppError('Invalid trip ID', 400, 'INVALID_ID');
    }

    // Verify ownership or editor role
    const existing = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { user_id: req.user.id },
          { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
        ]
      }
    });

    if (!existing) {
      throw new AppError('Trip not found or unauthorized to edit', 403, 'FORBIDDEN');
    }

    const { name, description, start_date, end_date, cover_photo_url, total_budget, is_public, status } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description;
    if (start_date !== undefined) updateData.start_date = start_date ? new Date(start_date) : null;
    if (end_date !== undefined) updateData.end_date = end_date ? new Date(end_date) : null;
    if (cover_photo_url !== undefined) updateData.cover_photo_url = cover_photo_url;
    if (total_budget !== undefined) updateData.total_budget = parseFloat(total_budget);
    if (is_public !== undefined) updateData.is_public = !!is_public;
    if (status !== undefined) updateData.status = status;

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: { trip: updatedTrip }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      throw new AppError('Invalid trip ID', 400, 'INVALID_ID');
    }

    const existing = await prisma.trip.findFirst({
      where: {
        id: tripId,
        user_id: req.user.id
      }
    });

    if (!existing) {
      throw new AppError('Trip not found or unauthorized to delete', 403, 'FORBIDDEN');
    }

    await prisma.trip.delete({
      where: { id: tripId }
    });

    res.status(200).json({
      success: true,
      data: { message: 'Trip deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};
