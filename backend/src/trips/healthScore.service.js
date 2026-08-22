import prisma from '../prisma.js';

/**
 * Calculates time in minutes from a string "HH:MM" (24-hour format).
 */
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 600; // Default 10:00 AM = 600 mins
  const [hours, minutes] = timeStr.split(':').map((num) => parseInt(num, 10) || 0);
  return hours * 60 + minutes;
};

/**
 * Computes the Trip Health Score based on 4 pillars:
 * 1. Budget Score (weight 0.35)
 * 2. Load Balance Score (weight 0.25)
 * 3. Conflict Score (weight 0.25)
 * 4. Buffer / Rest Score (weight 0.15)
 */
export const calculateTripHealthScore = async (tripId) => {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
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
      },
      expenses: true
    }
  });

  if (!trip) return null;

  const totalBudget = parseFloat(trip.total_budget || 0);

  // 1. Calculate Total Costs (Itinerary items + manual expenses)
  let activitiesCost = 0;
  const allItems = [];
  const dayItemsMap = {};

  trip.trip_stops.forEach((stop) => {
    stop.itinerary_items.forEach((item) => {
      const itemCost = item.custom_cost !== null ? parseFloat(item.custom_cost) : parseFloat(item.activity.cost || 0);
      activitiesCost += itemCost;
      const enhancedItem = {
        ...item,
        effective_cost: itemCost,
        city_name: stop.city?.name || 'City',
        city_cost_index: parseFloat(stop.city?.cost_index || 1.0)
      };
      allItems.push(enhancedItem);

      const day = item.day_number || 1;
      if (!dayItemsMap[day]) dayItemsMap[day] = [];
      dayItemsMap[day].push(enhancedItem);
    });
  });

  let manualExpensesCost = 0;
  trip.expenses.forEach((exp) => {
    manualExpensesCost += parseFloat(exp.amount || 0);
  });

  const totalSpent = activitiesCost + manualExpensesCost;

  // --- PILLAR 1: BUDGET SCORE (0 - 100) ---
  let budgetScore = 100;
  let budgetExplanation = '';

  if (totalBudget > 0) {
    if (totalSpent <= totalBudget) {
      budgetScore = 100;
      const remaining = totalBudget - totalSpent;
      budgetExplanation = `Well within budget! ₹${remaining.toLocaleString('en-IN')} remaining of ₹${totalBudget.toLocaleString('en-IN')}`;
    } else {
      const overAmount = totalSpent - totalBudget;
      const overPercent = (overAmount / totalBudget) * 100;
      budgetScore = Math.max(0, Math.round(100 - overPercent * 1.5));
      budgetExplanation = `Over budget by ₹${overAmount.toLocaleString('en-IN')} (${Math.round(overPercent)}% over total ₹${totalBudget.toLocaleString('en-IN')})`;
    }
  } else {
    if (totalSpent === 0) {
      budgetScore = 100;
      budgetExplanation = 'Budget not set; no expenses logged yet.';
    } else {
      budgetScore = 50;
      budgetExplanation = `Total expenses ₹${totalSpent.toLocaleString('en-IN')} with no target budget specified.`;
    }
  }

  // --- PILLAR 2: LOAD BALANCE SCORE (0 - 100) ---
  const dayNumbers = Object.keys(dayItemsMap).map(Number).sort((a, b) => a - b);
  let loadBalanceScore = 100;
  const loadIssues = [];

  if (allItems.length === 0) {
    loadBalanceScore = 80;
    loadIssues.push('No activities scheduled yet');
  } else {
    const minDay = dayNumbers.length > 0 ? Math.min(...dayNumbers) : 1;
    const maxDay = dayNumbers.length > 0 ? Math.max(...dayNumbers) : 1;
    const totalSpan = maxDay - minDay + 1;

    let overloadedDaysCount = 0;
    let emptyDaysCount = 0;

    for (let d = minDay; d <= maxDay; d++) {
      const count = dayItemsMap[d]?.length || 0;
      if (count >= 5) {
        overloadedDaysCount++;
        loadIssues.push(`Day ${d} is heavily packed with ${count} activities (ideal: 1–4)`);
      } else if (count === 0 && totalSpan > 2) {
        emptyDaysCount++;
      }
    }

    loadBalanceScore -= overloadedDaysCount * 25;
    loadBalanceScore -= emptyDaysCount * 15;
    loadBalanceScore = Math.max(0, Math.min(100, loadBalanceScore));
  }

  const loadBalanceExplanation =
    loadIssues.length > 0
      ? loadIssues.slice(0, 2).join('. ')
      : `Evenly paced: average ${(allItems.length / Math.max(1, dayNumbers.length)).toFixed(1)} activities/day`;

  // --- PILLAR 3: CONFLICT SCORE (0 - 100) ---
  let conflictScore = 100;
  const conflictsDetected = [];

  dayNumbers.forEach((day) => {
    const items = dayItemsMap[day] || [];
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const itemA = items[i];
        const itemB = items[j];

        const startA = timeToMinutes(itemA.start_time);
        const endA = startA + (itemA.activity?.duration_minutes || 60);

        const startB = timeToMinutes(itemB.start_time);
        const endB = startB + (itemB.activity?.duration_minutes || 60);

        // Check if intervals overlap
        if (startA < endB && startB < endA) {
          conflictsDetected.push(
            `Day ${day}: "${itemA.activity?.name}" overlaps with "${itemB.activity?.name}"`
          );
        }
      }
    }
  });

  // Also check if multiple stops have identical arrival/departure on the exact same date
  const stops = trip.trip_stops || [];
  for (let i = 0; i < stops.length; i++) {
    for (let j = i + 1; j < stops.length; j++) {
      if (
        stops[i].arrival_date &&
        stops[j].arrival_date &&
        new Date(stops[i].arrival_date).toISOString().split('T')[0] ===
          new Date(stops[j].arrival_date).toISOString().split('T')[0]
      ) {
        conflictsDetected.push(
          `Tight schedule: ${stops[i].city.name} and ${stops[j].city.name} scheduled on the same arrival date`
        );
      }
    }
  }

  conflictScore -= conflictsDetected.length * 30;
  conflictScore = Math.max(0, Math.min(100, conflictScore));

  const conflictExplanation =
    conflictsDetected.length > 0
      ? `${conflictsDetected.length} schedule ${conflictsDetected.length === 1 ? 'conflict' : 'conflicts'}: ${conflictsDetected[0]}`
      : 'Zero timing overlaps across all scheduled days.';

  // --- PILLAR 4: BUFFER / REST SCORE (0 - 100) ---
  let bufferScore = 100;
  let bufferExplanation = 'Great rest pacing with restorative breaks.';

  if (dayNumbers.length >= 4) {
    let consecutivePackedDays = 0;
    let maxPackedStreak = 0;

    dayNumbers.forEach((day) => {
      const count = dayItemsMap[day]?.length || 0;
      if (count >= 3) {
        consecutivePackedDays++;
        if (consecutivePackedDays > maxPackedStreak) {
          maxPackedStreak = consecutivePackedDays;
        }
      } else {
        consecutivePackedDays = 0;
      }
    });

    if (maxPackedStreak >= 4) {
      bufferScore = 50;
      bufferExplanation = `Fatigue warning: ${maxPackedStreak} consecutive packed days without a dedicated light rest day.`;
    } else if (maxPackedStreak === 3) {
      bufferScore = 85;
      bufferExplanation = 'Moderate pacing: consider scheduling a light afternoon after 3 busy days.';
    } else {
      bufferScore = 100;
      bufferExplanation = 'Well-balanced itinerary with adequate buffer days and downtime.';
    }
  } else {
    bufferScore = 100;
    bufferExplanation = 'Compact trip duration with balanced daily buffers.';
  }

  // --- OVERALL HEALTH SCORE ---
  const overallScore = Math.round(
    0.35 * budgetScore +
    0.25 * loadBalanceScore +
    0.25 * conflictScore +
    0.15 * bufferScore
  );

  let band = 'healthy';
  if (overallScore < 50) band = 'alert';
  else if (overallScore < 80) band = 'warning';

  // Save / Upsert to Database
  const savedHealthScore = await prisma.tripHealthScore.upsert({
    where: { trip_id: tripId },
    update: {
      budget_score: budgetScore,
      load_balance_score: loadBalanceScore,
      conflict_score: conflictScore,
      buffer_score: bufferScore,
      overall_score: overallScore,
      computed_at: new Date()
    },
    create: {
      trip_id: tripId,
      budget_score: budgetScore,
      load_balance_score: loadBalanceScore,
      conflict_score: conflictScore,
      buffer_score: bufferScore,
      overall_score: overallScore
    }
  });

  return {
    trip_id: tripId,
    overall_score: overallScore,
    budget_score: budgetScore,
    load_balance_score: loadBalanceScore,
    conflict_score: conflictScore,
    buffer_score: bufferScore,
    band,
    explanations: {
      budget: budgetExplanation,
      load_balance: loadBalanceExplanation,
      conflict: conflictExplanation,
      buffer: bufferExplanation
    },
    metrics: {
      total_budget: totalBudget,
      total_spent: totalSpent,
      over_budget: totalSpent > totalBudget && totalBudget > 0,
      activities_count: allItems.length,
      conflicts_count: conflictsDetected.length,
      days_count: dayNumbers.length
    },
    computed_at: savedHealthScore.computed_at
  };
};
