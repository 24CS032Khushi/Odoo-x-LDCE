import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';
import { calculateTripHealthScore } from './healthScore.service.js';

const generateSlug = (name) => {
  const cleanName = (name || 'trip')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .substring(0, 30);
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanName}-${randomSuffix}`;
};

/**
 * Public route (No Auth required): GET /api/v1/share/:share_slug
 */
export const getPublicTripBySlug = async (req, res, next) => {
  try {
    const { share_slug } = req.params;

    if (!share_slug) {
      throw new AppError('Share slug is required', 400, 'VALIDATION_ERROR');
    }

    const trip = await prisma.trip.findFirst({
      where: {
        share_slug: share_slug.trim()
      },
      include: {
        user: {
          select: {
            name: true,
            photo_url: true
          }
        },
        trip_stops: {
          orderBy: { order_index: 'asc' },
          include: {
            city: {
              select: {
                id: true,
                name: true,
                country: true,
                region: true,
                image_url: true,
                cost_index: true
              }
            },
            itinerary_items: {
              orderBy: [{ day_number: 'asc' }, { order_index: 'asc' }, { start_time: 'asc' }],
              include: {
                activity: {
                  select: {
                    id: true,
                    name: true,
                    category: true,
                    description: true,
                    image_url: true,
                    cost: true,
                    duration_minutes: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!trip) {
      throw new AppError('Shared trip not found or link has expired', 404, 'NOT_FOUND');
    }

    // Structure day groups
    const dayGroups = {};
    let totalEstimatedCost = 0;
    let activitiesCount = 0;

    trip.trip_stops.forEach((stop) => {
      stop.itinerary_items.forEach((item) => {
        activitiesCount++;
        const cost = item.custom_cost !== null ? parseFloat(item.custom_cost) : parseFloat(item.activity.cost || 0);
        totalEstimatedCost += cost;

        const day = item.day_number || 1;
        if (!dayGroups[day]) dayGroups[day] = [];
        dayGroups[day].push({
          id: item.id,
          day_number: day,
          start_time: item.start_time,
          order_index: item.order_index,
          cost,
          city_name: stop.city.name,
          city_country: stop.city.country,
          activity: item.activity
        });
      });
    });

    const dayNumbers = Object.keys(dayGroups).map(Number).sort((a, b) => a - b);

    res.status(200).json({
      success: true,
      data: {
        trip: {
          id: trip.id,
          name: trip.name,
          description: trip.description,
          start_date: trip.start_date,
          end_date: trip.end_date,
          cover_photo_url: trip.cover_photo_url,
          total_budget: trip.total_budget,
          is_public: trip.is_public,
          share_slug: trip.share_slug,
          created_at: trip.created_at,
          creator: {
            name: trip.user.name,
            photo_url: trip.user.photo_url
          },
          stops_count: trip.trip_stops.length,
          activities_count: activitiesCount,
          days_count: dayNumbers.length,
          total_estimated_activities_cost: totalEstimatedCost,
          stops: trip.trip_stops,
          days: dayGroups
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Toggles is_public and returns share link: PUT /api/v1/trips/:id/publish
 */
export const toggleTripPublish = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      throw new AppError('Invalid trip ID', 400, 'VALIDATION_ERROR');
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        user_id: req.user.id
      }
    });

    if (!trip) {
      throw new AppError('Trip not found or unauthorized to change visibility', 403, 'FORBIDDEN');
    }

    const nextPublicState = req.body.is_public !== undefined ? !!req.body.is_public : !trip.is_public;
    const share_slug = trip.share_slug || generateSlug(trip.name);

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        is_public: nextPublicState,
        share_slug
      }
    });

    res.status(200).json({
      success: true,
      data: {
        trip_id: updatedTrip.id,
        is_public: updatedTrip.is_public,
        share_slug: updatedTrip.share_slug,
        share_path: `/share/${updatedTrip.share_slug}`
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Copies a trip into current user's library: POST /api/v1/trips/:id/copy or POST /api/v1/share/:share_slug/copy
 */
export const copyTrip = async (req, res, next) => {
  try {
    const { id, share_slug } = req.params;
    let sourceTrip = null;

    if (id) {
      const tripId = parseInt(id, 10);
      sourceTrip = await prisma.trip.findFirst({
        where: {
          id: tripId,
          OR: [
            { is_public: true },
            { user_id: req.user.id },
            { collaborators: { some: { user_id: req.user.id } } }
          ]
        },
        include: {
          trip_stops: {
            orderBy: { order_index: 'asc' },
            include: {
              itinerary_items: {
                orderBy: { order_index: 'asc' }
              }
            }
          }
        }
      });
    } else if (share_slug) {
      sourceTrip = await prisma.trip.findFirst({
        where: { share_slug },
        include: {
          trip_stops: {
            orderBy: { order_index: 'asc' },
            include: {
              itinerary_items: {
                orderBy: { order_index: 'asc' }
              }
            }
          }
        }
      });
    }

    if (!sourceTrip) {
      throw new AppError('Source trip not found or not available to copy', 404, 'NOT_FOUND');
    }

    const newSlug = generateSlug(sourceTrip.name);

    // Deep clone trip, stops, and itinerary items inside a database transaction
    const clonedTrip = await prisma.$transaction(async (tx) => {
      const trip = await tx.trip.create({
        data: {
          user_id: req.user.id,
          name: `Copy of ${sourceTrip.name}`,
          description: sourceTrip.description,
          start_date: sourceTrip.start_date,
          end_date: sourceTrip.end_date,
          cover_photo_url: sourceTrip.cover_photo_url,
          total_budget: sourceTrip.total_budget,
          status: 'planning',
          is_public: false,
          share_slug: newSlug
        }
      });

      // Add owner collaborator
      await tx.collaborator.create({
        data: {
          trip_id: trip.id,
          user_id: req.user.id,
          role: 'owner',
          accepted_at: new Date()
        }
      });

      // Clone stops and items
      for (const stop of sourceTrip.trip_stops) {
        const clonedStop = await tx.tripStop.create({
          data: {
            trip_id: trip.id,
            city_id: stop.city_id,
            order_index: stop.order_index,
            arrival_date: stop.arrival_date,
            departure_date: stop.departure_date
          }
        });

        for (const item of stop.itinerary_items) {
          await tx.itineraryItem.create({
            data: {
              trip_stop_id: clonedStop.id,
              activity_id: item.activity_id,
              day_number: item.day_number,
              start_time: item.start_time,
              order_index: item.order_index,
              custom_cost: item.custom_cost
            }
          });
        }
      }

      return trip;
    });

    // Compute health score for new clone
    await calculateTripHealthScore(clonedTrip.id);

    res.status(201).json({
      success: true,
      data: {
        message: 'Trip copied successfully to your personal library!',
        trip: clonedTrip
      }
    });
  } catch (error) {
    next(error);
  }
};
