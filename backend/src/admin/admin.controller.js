import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';

export const getAdminAnalytics = async (req, res, next) => {
  try {
    // 1. Basic Counts
    const totalUsers = await prisma.user.count();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          { last_active: { gte: sevenDaysAgo } },
          { created_at: { gte: sevenDaysAgo } }
        ]
      }
    });

    const totalTrips = await prisma.trip.count();
    const sharedTripsCount = await prisma.trip.count({
      where: { is_public: true }
    });

    // 2. Average Duration & Budget
    const allTrips = await prisma.trip.findMany({
      select: {
        id: true,
        start_date: true,
        end_date: true,
        total_budget: true,
        created_at: true,
        trip_stops: {
          select: {
            itinerary_items: {
              select: { day_number: true }
            }
          }
        }
      }
    });

    let totalBudgetSum = 0;
    let totalDurationDays = 0;
    const tripsWithBudget = allTrips.filter((t) => parseFloat(t.total_budget || 0) > 0);

    allTrips.forEach((t) => {
      totalBudgetSum += parseFloat(t.total_budget || 0);

      if (t.start_date && t.end_date) {
        const days = Math.ceil((new Date(t.end_date) - new Date(t.start_date)) / (1000 * 60 * 60 * 24)) + 1;
        totalDurationDays += Math.max(1, days);
      } else {
        const maxDay = Math.max(1, ...t.trip_stops.flatMap((s) => s.itinerary_items.map((i) => i.day_number || 1)));
        totalDurationDays += maxDay;
      }
    });

    const averageBudget = allTrips.length > 0 ? Math.round(totalBudgetSum / allTrips.length) : 0;
    const averageDuration = allTrips.length > 0 ? (totalDurationDays / allTrips.length).toFixed(1) : '0';

    // 3. Most Popular Cities (by count of trip stops)
    const cityStopsCount = await prisma.tripStop.groupBy({
      by: ['city_id'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 6
    });

    const cityIds = cityStopsCount.map((c) => c.city_id);
    const cities = await prisma.city.findMany({
      where: { id: { in: cityIds } },
      select: { id: true, name: true, country: true }
    });

    const popularCities = cityStopsCount.map((sc) => {
      const city = cities.find((c) => c.id === sc.city_id);
      return {
        id: sc.city_id,
        name: city ? `${city.name}, ${city.country}` : `City #${sc.city_id}`,
        trip_count: sc._count.id
      };
    });

    // 4. Most Popular Activities (by count in itinerary items)
    const activityItemsCount = await prisma.itineraryItem.groupBy({
      by: ['activity_id'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 6
    });

    const activityIds = activityItemsCount.map((a) => a.activity_id);
    const activities = await prisma.activity.findMany({
      where: { id: { in: activityIds } },
      select: { id: true, name: true, category: true, cost: true }
    });

    const popularActivities = activityItemsCount.map((ai) => {
      const act = activities.find((a) => a.id === ai.activity_id);
      return {
        id: ai.activity_id,
        name: act?.name || `Activity #${ai.activity_id}`,
        category: act?.category || 'General',
        cost: act ? parseFloat(act.cost) : 0,
        booked_count: ai._count.id
      };
    });

    // 5. Trips Created Over Time (Daily / Monthly buckets)
    const tripsByDateMap = {};
    allTrips.forEach((t) => {
      const dateStr = new Date(t.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      tripsByDateMap[dateStr] = (tripsByDateMap[dateStr] || 0) + 1;
    });

    const tripsTimeline = Object.keys(tripsByDateMap).slice(-7).map((d) => ({
      date: d,
      trips: tripsByDateMap[d]
    }));

    // If few records, supply current date bucket
    if (tripsTimeline.length === 0) {
      tripsTimeline.push({
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        trips: totalTrips
      });
    }

    // 6. Budget Distribution Buckets (Histogram)
    const budgetBuckets = [
      { range: 'Under ₹50k', count: 0, color: '#3b82f6' },
      { range: '₹50k – ₹100k', count: 0, color: '#8b5cf6' },
      { range: '₹100k – ₹200k', count: 0, color: '#14554f' },
      { range: '₹200k+', count: 0, color: '#f59e0b' }
    ];

    allTrips.forEach((t) => {
      const budget = parseFloat(t.total_budget || 0);
      if (budget < 50000) budgetBuckets[0].count++;
      else if (budget < 100000) budgetBuckets[1].count++;
      else if (budget < 200000) budgetBuckets[2].count++;
      else budgetBuckets[3].count++;
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          total_users: totalUsers,
          active_users_7d: Math.max(1, activeUsers),
          total_trips: totalTrips,
          shared_trips: sharedTripsCount,
          average_duration_days: parseFloat(averageDuration),
          average_budget: averageBudget
        },
        charts: {
          popular_cities: popularCities,
          popular_activities: popularActivities,
          trips_timeline: tripsTimeline,
          budget_distribution: budgetBuckets
        }
      }
    });
  } catch (error) {
    next(error);
  }
};
