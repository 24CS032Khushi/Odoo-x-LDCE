import prisma from '../prisma.js';

const timeToMinutes = (timeStr) => {
  if (!timeStr) return 600;
  const [hours, minutes] = timeStr.split(':').map((num) => parseInt(num, 10) || 0);
  return hours * 60 + minutes;
};

const minutesToTime = (mins) => {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * Evaluates route and day sanity checks for a trip.
 * Returns array of flag objects, each with day_number, type, severity, message, suggested_fix, and action_type.
 */
export const evaluateTripSanityChecks = async (tripId) => {
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
      }
    }
  });

  if (!trip) return [];

  const flags = [];
  const dayItemsMap = {};

  // Group items by day
  trip.trip_stops.forEach((stop) => {
    stop.itinerary_items.forEach((item) => {
      const day = item.day_number || 1;
      if (!dayItemsMap[day]) dayItemsMap[day] = [];
      dayItemsMap[day].push({
        ...item,
        stop_city: stop.city.name
      });
    });
  });

  const dayNumbers = Object.keys(dayItemsMap).map(Number).sort((a, b) => a - b);

  // 1. Time Overlaps between activities on the same day
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

        if (startA < endB && startB < endA) {
          const suggestedStart = minutesToTime(Math.max(endA, endB) + 15);
          flags.push({
            id: `conflict-${itemA.id}-${itemB.id}`,
            day_number: day,
            type: 'time_conflict',
            severity: 'alert',
            icon: 'clock',
            title: 'Schedule Timing Conflict',
            message: `"${itemA.activity?.name}" (${itemA.start_time || '10:00'}–${minutesToTime(endA)}) overlaps with "${itemB.activity?.name}" (${itemB.start_time || '10:00'}–${minutesToTime(endB)}).`,
            suggested_fix: `Reschedule "${itemB.activity?.name}" to start at ${suggestedStart} after "${itemA.activity?.name}" concludes.`,
            action_type: 'reschedule_item',
            action_data: { item_id: itemB.id, suggested_time: suggestedStart }
          });
        }
      }
    }
  });

  // 2. Overloaded Days (>= 5 activities)
  dayNumbers.forEach((day) => {
    const items = dayItemsMap[day] || [];
    if (items.length >= 5) {
      const highestCostItem = [...items].sort(
        (a, b) => (parseFloat(b.custom_cost || b.activity?.cost || 0)) - (parseFloat(a.custom_cost || a.activity?.cost || 0))
      )[0];

      flags.push({
        id: `overloaded-day-${day}`,
        day_number: day,
        type: 'overloaded_day',
        severity: 'warning',
        icon: 'zap',
        title: `Day ${day} Overloaded (${items.length} Experiences)`,
        message: `Scheduling ${items.length} activities on Day ${day} exceeds the recommended limit of 4 activities/day.`,
        suggested_fix: `Move "${highestCostItem?.activity?.name || 'an activity'}" to Day ${day + 1} or spread experiences evenly.`,
        action_type: 'move_item',
        action_data: { item_id: highestCostItem?.id, target_day: day + 1 }
      });
    }
  });

  // 3. Consecutive Packed Days without Rest
  if (dayNumbers.length >= 4) {
    let streak = 0;
    let streakDays = [];

    dayNumbers.forEach((day) => {
      const count = dayItemsMap[day]?.length || 0;
      if (count >= 3) {
        streak++;
        streakDays.push(day);
        if (streak >= 4) {
          flags.push({
            id: `streak-no-rest-${day}`,
            day_number: day,
            type: 'packed_streak',
            severity: 'warning',
            icon: 'battery-charging',
            title: 'Fatigue Risk: 4 Consecutive Packed Days',
            message: `Days ${streakDays.slice(-4).join(', ')} each have 3+ intense activities without a recovery period.`,
            suggested_fix: `Designate Day ${day} or Day ${day + 1} as a light exploration/rest day (≤1 activity).`,
            action_type: 'insert_buffer',
            action_data: { recommended_rest_day: day }
          });
        }
      } else {
        streak = 0;
        streakDays = [];
      }
    });
  }

  // 4. City Overlap / Tight Travel Windows
  const stops = trip.trip_stops || [];
  for (let i = 0; i < stops.length; i++) {
    for (let j = i + 1; j < stops.length; j++) {
      const stopA = stops[i];
      const stopB = stops[j];

      if (stopA.arrival_date && stopB.arrival_date) {
        const dateA = new Date(stopA.arrival_date).toISOString().split('T')[0];
        const dateB = new Date(stopB.arrival_date).toISOString().split('T')[0];

        if (dateA === dateB) {
          flags.push({
            id: `city-overlap-${stopA.id}-${stopB.id}`,
            day_number: 1,
            type: 'city_overlap',
            severity: 'alert',
            icon: 'compass',
            title: 'Multiple Destinations on Same Date',
            message: `${stopA.city.name} and ${stopB.city.name} are both scheduled with arrival date ${dateA}.`,
            suggested_fix: `Extend stay by at least 1 day or resequence stops in the Itinerary Builder.`,
            action_type: 'reorder_stops',
            action_data: { stop_a_id: stopA.id, stop_b_id: stopB.id }
          });
        }
      }
    }
  }

  return flags;
};
