import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';

export const addTripStop = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const { city_id, arrival_date, departure_date, order_index } = req.body;

    if (isNaN(tripId) || !city_id) {
      throw new AppError('Valid trip ID and city ID are required', 400, 'VALIDATION_ERROR');
    }

    // Verify trip ownership/editor access
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { user_id: req.user.id },
          { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
        ]
      },
      include: {
        _count: { select: { trip_stops: true } }
      }
    });

    if (!trip) {
      throw new AppError('Trip not found or unauthorized', 403, 'FORBIDDEN');
    }

    const city = await prisma.city.findUnique({
      where: { id: parseInt(city_id, 10) }
    });

    if (!city) {
      throw new AppError('City not found', 404, 'NOT_FOUND');
    }

    const calculatedOrderIndex = order_index !== undefined ? parseInt(order_index, 10) : trip._count.trip_stops;

    const newStop = await prisma.tripStop.create({
      data: {
        trip_id: tripId,
        city_id: parseInt(city_id, 10),
        order_index: calculatedOrderIndex,
        arrival_date: arrival_date ? new Date(arrival_date) : null,
        departure_date: departure_date ? new Date(departure_date) : null
      },
      include: {
        city: true,
        itinerary_items: {
          include: { activity: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: { stop: newStop }
    });
  } catch (error) {
    next(error);
  }
};

export const reorderTripStops = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const { stops } = req.body; // Array of { id, order_index }

    if (isNaN(tripId) || !Array.isArray(stops)) {
      throw new AppError('Invalid request format. Expected stops array.', 400, 'VALIDATION_ERROR');
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        OR: [
          { user_id: req.user.id },
          { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
        ]
      }
    });

    if (!trip) {
      throw new AppError('Trip not found or unauthorized', 403, 'FORBIDDEN');
    }

    // Execute bulk updates in transaction
    await prisma.$transaction(
      stops.map((stop) =>
        prisma.tripStop.update({
          where: { id: parseInt(stop.id, 10) },
          data: { order_index: parseInt(stop.order_index, 10) }
        })
      )
    );

    const updatedStops = await prisma.tripStop.findMany({
      where: { trip_id: tripId },
      orderBy: { order_index: 'asc' },
      include: {
        city: true,
        itinerary_items: {
          include: { activity: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { stops: updatedStops }
    });
  } catch (error) {
    next(error);
  }
};

export const updateTripStop = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const stopId = parseInt(req.params.stopId, 10);
    const { arrival_date, departure_date, order_index } = req.body;

    if (isNaN(tripId) || isNaN(stopId)) {
      throw new AppError('Invalid trip ID or stop ID', 400, 'VALIDATION_ERROR');
    }

    const stop = await prisma.tripStop.findFirst({
      where: {
        id: stopId,
        trip_id: tripId,
        trip: {
          OR: [
            { user_id: req.user.id },
            { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
          ]
        }
      }
    });

    if (!stop) {
      throw new AppError('Stop not found or unauthorized', 404, 'NOT_FOUND');
    }

    const updateData = {};
    if (arrival_date !== undefined) updateData.arrival_date = arrival_date ? new Date(arrival_date) : null;
    if (departure_date !== undefined) updateData.departure_date = departure_date ? new Date(departure_date) : null;
    if (order_index !== undefined) updateData.order_index = parseInt(order_index, 10);

    const updatedStop = await prisma.tripStop.update({
      where: { id: stopId },
      data: updateData,
      include: {
        city: true,
        itinerary_items: {
          include: { activity: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { stop: updatedStop }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTripStop = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const stopId = parseInt(req.params.stopId, 10);

    if (isNaN(tripId) || isNaN(stopId)) {
      throw new AppError('Invalid trip ID or stop ID', 400, 'VALIDATION_ERROR');
    }

    const stop = await prisma.tripStop.findFirst({
      where: {
        id: stopId,
        trip_id: tripId,
        trip: {
          OR: [
            { user_id: req.user.id },
            { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
          ]
        }
      }
    });

    if (!stop) {
      throw new AppError('Stop not found or unauthorized', 404, 'NOT_FOUND');
    }

    await prisma.tripStop.delete({
      where: { id: stopId }
    });

    res.status(200).json({
      success: true,
      data: { message: 'Stop removed from trip' }
    });
  } catch (error) {
    next(error);
  }
};
