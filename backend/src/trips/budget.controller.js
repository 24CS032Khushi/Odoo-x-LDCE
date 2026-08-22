import prisma from '../prisma.js';
import { AppError } from '../shared/error-handler.js';
import { calculateTripHealthScore } from './healthScore.service.js';
import { evaluateTripSanityChecks } from './sanityChecker.service.js';

export const getTripBudget = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      throw new AppError('Invalid trip ID', 400, 'VALIDATION_ERROR');
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
              include: { activity: true }
            }
          }
        },
        expenses: {
          include: {
            trip_stop: {
              include: { city: true }
            }
          }
        },
        trip_health_score: true
      }
    });

    if (!trip) {
      throw new AppError('Trip not found or unauthorized', 404, 'NOT_FOUND');
    }

    const totalBudget = parseFloat(trip.total_budget || 0);

    // 1. Calculate Categories Breakdown
    const categories = {
      transport: 0,
      stay: 0,
      activities: 0,
      meals: 0,
      other: 0
    };

    const scheduledActivities = [];

    // Sum scheduled activities from itinerary
    trip.trip_stops.forEach((stop) => {
      stop.itinerary_items.forEach((item) => {
        const cost = item.custom_cost !== null ? parseFloat(item.custom_cost) : parseFloat(item.activity.cost || 0);
        categories.activities += cost;
        scheduledActivities.push({
          item_id: item.id,
          activity_id: item.activity_id,
          name: item.activity.name,
          category: item.activity.category,
          cost,
          city_id: stop.city_id,
          city_name: stop.city.name,
          city_cost_index: parseFloat(stop.city.cost_index || 1.0)
        });
      });
    });

    // Sum logged manual expenses
    trip.expenses.forEach((exp) => {
      const cat = exp.category?.toLowerCase() || 'other';
      if (categories[cat] !== undefined) {
        categories[cat] += parseFloat(exp.amount || 0);
      } else {
        categories.other += parseFloat(exp.amount || 0);
      }
    });

    const totalSpent =
      categories.transport +
      categories.stay +
      categories.activities +
      categories.meals +
      categories.other;

    const overBudget = totalBudget > 0 && totalSpent > totalBudget;
    const overAmount = Math.max(0, totalSpent - totalBudget);
    const savingsHeadroom = Math.max(0, totalBudget - totalSpent);

    // Calculate Trip Duration & Average Daily Cost
    let totalDays = 1;
    if (trip.start_date && trip.end_date) {
      const start = new Date(trip.start_date);
      const end = new Date(trip.end_date);
      const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      totalDays = Math.max(1, diffDays);
    } else {
      const maxScheduledDay = Math.max(
        1,
        ...trip.trip_stops.flatMap((s) => s.itinerary_items.map((i) => i.day_number || 1))
      );
      totalDays = maxScheduledDay;
    }

    const averageDailyCost = Math.round(totalSpent / totalDays);
    const averageDailyBudget = totalBudget > 0 ? Math.round(totalBudget / totalDays) : 0;

    // 2. Generate Real Ranked Alternatives / Over-budget Suggestions
    const suggestions = [];

    if (overBudget || totalSpent > 0) {
      // Suggestion 1: Drop highest cost activity
      const sortedActivities = [...scheduledActivities].sort((a, b) => b.cost - a.cost);
      if (sortedActivities.length > 0 && sortedActivities[0].cost > 0) {
        const topItem = sortedActivities[0];
        suggestions.push({
          id: `cut-${topItem.item_id}`,
          type: 'activity_cut',
          icon: 'scissors',
          title: `Drop ${topItem.name}`,
          description: `Removing this optional activity in ${topItem.city_name} immediately brings your spending closer to target.`,
          estimated_savings: topItem.cost,
          city_name: topItem.city_name,
          action_data: { item_id: topItem.item_id, activity_name: topItem.name }
        });
      }

      // Suggestion 2: Find cheaper alternative activity in the same city
      if (sortedActivities.length > 0 && sortedActivities[0].cost > 1000) {
        const expensiveItem = sortedActivities[0];
        const alternativeActivities = await prisma.activity.findMany({
          where: {
            city_id: expensiveItem.city_id,
            id: { not: expensiveItem.activity_id },
            cost: { lt: expensiveItem.cost }
          },
          orderBy: { cost: 'asc' },
          take: 3
        });

        if (alternativeActivities.length > 0) {
          const alt = alternativeActivities[0];
          const savingsDiff = expensiveItem.cost - parseFloat(alt.cost || 0);
          if (savingsDiff > 0) {
            suggestions.push({
              id: `swap-${expensiveItem.item_id}-${alt.id}`,
              type: 'activity_swap',
              icon: 'refresh-cw',
              title: `Switch to ${alt.name}`,
              description: `Replace "${expensiveItem.name}" (₹${expensiveItem.cost.toLocaleString('en-IN')}) with "${alt.name}" (₹${parseFloat(alt.cost).toLocaleString('en-IN')}) in ${expensiveItem.city_name}.`,
              estimated_savings: savingsDiff,
              city_name: expensiveItem.city_name,
              action_data: {
                current_item_id: expensiveItem.item_id,
                replacement_activity_id: alt.id,
                replacement_name: alt.name
              }
            });
          }
        }
      }

      // Suggestion 3: City Cost Index duration adjustment
      const highCostStop = trip.trip_stops.find(
        (s) => parseFloat(s.city.cost_index || 1.0) >= 1.2
      ) || trip.trip_stops[0];

      if (highCostStop) {
        const cityActivities = scheduledActivities.filter(
          (a) => a.city_id === highCostStop.city_id
        );
        const citySpend = cityActivities.reduce((acc, a) => acc + a.cost, 0);
        const cityAvgDailySpend = Math.round(citySpend / Math.max(1, cityActivities.length));
        const estimatedCitySavings = Math.max(3000, cityAvgDailySpend);

        suggestions.push({
          id: `city-cost-${highCostStop.city_id}`,
          type: 'city_swap',
          icon: 'map-pin',
          title: `Optimize duration in ${highCostStop.city.name}`,
          description: `${highCostStop.city.name} has a premium cost index (${highCostStop.city.cost_index}x). Shortening stay by 1 night saves approx ₹${estimatedCitySavings.toLocaleString('en-IN')}.`,
          estimated_savings: estimatedCitySavings,
          city_name: highCostStop.city.name,
          action_data: { stop_id: highCostStop.id, city_id: highCostStop.city_id }
        });
      }
    }

    // Category chart payload
    const categoryBreakdown = [
      {
        category: 'transport',
        name: 'Transport',
        amount: categories.transport,
        percentage: totalSpent > 0 ? Math.round((categories.transport / totalSpent) * 100) : 0,
        color: '#3b82f6'
      },
      {
        category: 'stay',
        name: 'Stay & Accommodation',
        amount: categories.stay,
        percentage: totalSpent > 0 ? Math.round((categories.stay / totalSpent) * 100) : 0,
        color: '#8b5cf6'
      },
      {
        category: 'activities',
        name: 'Activities & Tours',
        amount: categories.activities,
        percentage: totalSpent > 0 ? Math.round((categories.activities / totalSpent) * 100) : 0,
        color: '#14554f'
      },
      {
        category: 'meals',
        name: 'Meals & Dining',
        amount: categories.meals,
        percentage: totalSpent > 0 ? Math.round((categories.meals / totalSpent) * 100) : 0,
        color: '#f59e0b'
      },
      {
        category: 'other',
        name: 'Miscellaneous / Other',
        amount: categories.other,
        percentage: totalSpent > 0 ? Math.round((categories.other / totalSpent) * 100) : 0,
        color: '#64748b'
      }
    ];

    res.status(200).json({
      success: true,
      data: {
        trip_id: trip.id,
        trip_name: trip.name,
        total_budget: totalBudget,
        total_spent: totalSpent,
        over_budget: overBudget,
        over_amount: overAmount,
        savings_headroom: savingsHeadroom,
        total_days: totalDays,
        average_daily_cost: averageDailyCost,
        average_daily_budget: averageDailyBudget,
        categories: categoryBreakdown,
        suggestions: overBudget ? suggestions : [],
        under_budget_message: !overBudget
          ? `Your itinerary is comfortably within budget with ₹${savingsHeadroom.toLocaleString('en-IN')} headroom.`
          : null,
        expenses: trip.expenses,
        health_score: trip.trip_health_score
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTripExpenses = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      throw new AppError('Invalid trip ID', 400, 'VALIDATION_ERROR');
    }

    const expenses = await prisma.expense.findMany({
      where: { trip_id: tripId },
      include: {
        trip_stop: {
          include: { city: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({
      success: true,
      data: { expenses }
    });
  } catch (error) {
    next(error);
  }
};

export const addTripExpense = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const { category, amount, note, trip_stop_id } = req.body;

    if (isNaN(tripId) || !category || amount === undefined || isNaN(parseFloat(amount))) {
      throw new AppError('Trip ID, category, and valid amount are required', 400, 'VALIDATION_ERROR');
    }

    const validCategories = ['transport', 'stay', 'activities', 'meals', 'other'];
    if (!validCategories.includes(category.toLowerCase())) {
      throw new AppError(`Invalid category. Must be one of: ${validCategories.join(', ')}`, 400, 'VALIDATION_ERROR');
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
      throw new AppError('Trip not found or unauthorized to add expenses', 403, 'FORBIDDEN');
    }

    const newExpense = await prisma.expense.create({
      data: {
        trip_id: tripId,
        category: category.toLowerCase(),
        amount: parseFloat(amount),
        note: note ? note.trim() : null,
        trip_stop_id: trip_stop_id ? parseInt(trip_stop_id, 10) : null
      },
      include: {
        trip_stop: {
          include: { city: true }
        }
      }
    });

    // Recompute health score in background
    await calculateTripHealthScore(tripId);

    res.status(201).json({
      success: true,
      data: { expense: newExpense }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTripExpense = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    const expenseId = parseInt(req.params.expenseId, 10);

    if (isNaN(tripId) || isNaN(expenseId)) {
      throw new AppError('Invalid trip ID or expense ID', 400, 'VALIDATION_ERROR');
    }

    const existing = await prisma.expense.findFirst({
      where: {
        id: expenseId,
        trip_id: tripId,
        trip: {
          OR: [
            { user_id: req.user.id },
            { collaborators: { some: { user_id: req.user.id, role: { in: ['owner', 'editor'] } } } }
          ]
        }
      }
    });

    if (!existing) {
      throw new AppError('Expense not found or unauthorized to delete', 404, 'NOT_FOUND');
    }

    await prisma.expense.delete({
      where: { id: expenseId }
    });

    // Recompute health score in background
    await calculateTripHealthScore(tripId);

    res.status(200).json({
      success: true,
      data: { message: 'Expense deleted successfully' }
    });
  } catch (error) {
    next(error);
  }
};

export const getTripHealthScore = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      throw new AppError('Invalid trip ID', 400, 'VALIDATION_ERROR');
    }

    const scoreData = await calculateTripHealthScore(tripId);
    if (!scoreData) {
      throw new AppError('Trip not found', 404, 'NOT_FOUND');
    }

    res.status(200).json({
      success: true,
      data: { health_score: scoreData }
    });
  } catch (error) {
    next(error);
  }
};

export const getTripSanityChecks = async (req, res, next) => {
  try {
    const tripId = parseInt(req.params.id, 10);
    if (isNaN(tripId)) {
      throw new AppError('Invalid trip ID', 400, 'VALIDATION_ERROR');
    }

    const flags = await evaluateTripSanityChecks(tripId);

    res.status(200).json({
      success: true,
      data: { flags }
    });
  } catch (error) {
    next(error);
  }
};
