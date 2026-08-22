import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';

export const getTripItinerary = async (req, res, next) => {
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
        trip_stops: {
          orderBy: { order_index: 'asc' },
          include: {
            city: true,
            itinerary_items: {
              orderBy: [{ day_number: 'asc' }, { order_index: 'asc' }, { start_time: 'asc' }],
              include: { activity: true }
            }
          }
        }
      }
    });

    if (!trip) {
      throw new AppError('Trip not found or unauthorized', 404, 'NOT_FOUND');
    }

    // Structure day-wise itinerary
    const allItems = [];
    let totalEstimatedCost = 0;

    trip.trip_stops.forEach((stop) => {
      stop.itinerary_items.forEach((item) => {
        const itemCost = item.custom_cost !== null ? parseFloat(item.custom_cost) : parseFloat(item.activity.cost || 0);
        totalEstimatedCost += itemCost;

        allItems.push({
          ...item,
          effective_cost: itemCost,
          stop_name: stop.city.name,
          stop_country: stop.city.country,
          city_id: stop.city_id
        });
      });
    });

    // Group by day_number
    const dayGroups = {};
    allItems.forEach((item) => {
      const day = item.day_number || 1;
      if (!dayGroups[day]) {
        dayGroups[day] = [];
      }
      dayGroups[day].push(item);
    });

    res.status(200).json({
      success: true,
      data: {
        trip_id: trip.id,
        trip_name: trip.name,
        start_date: trip.start_date,
        end_date: trip.end_date,
        total_budget: trip.total_budget,
        total_estimated_activities_cost: totalEstimatedCost,
        stops_count: trip.trip_stops.length,
        activities_count: allItems.length,
        stops: trip.trip_stops,
        days: dayGroups,
        items: allItems
      }
    });
  } catch (error) {
    next(error);
  }
};

export const addItineraryItem = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const { trip_stop_id, activity_id, day_number, start_time, order_index, custom_cost } = req.body;

    if (isNaN(tripId) || !trip_stop_id || !activity_id) {
      throw new AppError('Trip ID, stop ID, and activity ID are required', 400, 'VALIDATION_ERROR');
    }

    // Verify stop belongs to user's trip
    const stop = await prisma.tripStop.findFirst({
      where: {
        id: parseInt(trip_stop_id, 10),
        trip_id: tripId,
        trip: {
          OR: [
            { user_id: req.user.id },
            { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
          ]
        }
      },
      include: {
        _count: { select: { itinerary_items: true } }
      }
    });

    if (!stop) {
      throw new AppError('Stop not found or unauthorized', 403, 'FORBIDDEN');
    }

    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(activity_id, 10) }
    });

    if (!activity) {
      throw new AppError('Activity not found', 404, 'NOT_FOUND');
    }

    const calculatedOrder = order_index !== undefined ? parseInt(order_index, 10) : stop._count.itinerary_items;

    const newItem = await prisma.itineraryItem.create({
      data: {
        trip_stop_id: parseInt(trip_stop_id, 10),
        activity_id: parseInt(activity_id, 10),
        day_number: day_number ? parseInt(day_number, 10) : 1,
        start_time: start_time || '10:00',
        order_index: calculatedOrder,
        custom_cost: custom_cost !== undefined && custom_cost !== null ? parseFloat(custom_cost) : null
      },
      include: {
        activity: true,
        trip_stop: {
          include: { city: true }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: { item: newItem }
    });
  } catch (error) {
    next(error);
  }
};

export const updateItineraryItem = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const itemId = parseInt(req.params.itemId, 10);

    if (isNaN(tripId) || isNaN(itemId)) {
      throw new AppError('Invalid trip ID or item ID', 400, 'VALIDATION_ERROR');
    }

    const existing = await prisma.itineraryItem.findFirst({
      where: {
        id: itemId,
        trip_stop: {
          trip_id: tripId,
          trip: {
            OR: [
              { user_id: req.user.id },
              { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
            ]
          }
        }
      }
    });

    if (!existing) {
      throw new AppError('Itinerary item not found or unauthorized', 404, 'NOT_FOUND');
    }

    const { day_number, start_time, order_index, custom_cost } = req.body;
    const updateData = {};

    if (day_number !== undefined) updateData.day_number = parseInt(day_number, 10);
    if (start_time !== undefined) updateData.start_time = start_time;
    if (order_index !== undefined) updateData.order_index = parseInt(order_index, 10);
    if (custom_cost !== undefined) {
      updateData.custom_cost = custom_cost !== null ? parseFloat(custom_cost) : null;
    }

    const updatedItem = await prisma.itineraryItem.update({
      where: { id: itemId },
      data: updateData,
      include: {
        activity: true,
        trip_stop: {
          include: { city: true }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: { item: updatedItem }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteItineraryItem = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const itemId = parseInt(req.params.itemId, 10);

    if (isNaN(tripId) || isNaN(itemId)) {
      throw new AppError('Invalid trip ID or item ID', 400, 'VALIDATION_ERROR');
    }

    const existing = await prisma.itineraryItem.findFirst({
      where: {
        id: itemId,
        trip_stop: {
          trip_id: tripId,
          trip: {
            OR: [
              { user_id: req.user.id },
              { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
            ]
          }
        }
      }
    });

    if (!existing) {
      throw new AppError('Itinerary item not found or unauthorized', 404, 'NOT_FOUND');
    }

    await prisma.itineraryItem.delete({
      where: { id: itemId }
    });

    res.status(200).json({
      success: true,
      data: { message: 'Item removed from itinerary' }
    });
  } catch (error) {
    next(error);
  }
};
