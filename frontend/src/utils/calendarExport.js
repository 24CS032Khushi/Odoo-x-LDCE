/**
 * Generates an RFC-5545 standard .ics iCalendar file for universal sync with
 * Apple Calendar, Google Calendar, Microsoft Outlook, and mobile calendar apps.
 */
export const generateICSFile = (trip, itineraryDays = {}) => {
  if (!trip) return;

  const formatDateToICS = (dateObj) => {
    const pad = (n) => (n < 10 ? `0${n}` : n);
    return `${dateObj.getUTCFullYear()}${pad(dateObj.getUTCMonth() + 1)}${pad(dateObj.getUTCDate())}T${pad(dateObj.getUTCHours())}${pad(dateObj.getUTCMinutes())}00Z`;
  };

  const escapeICS = (str) => {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/\n/g, '\\n');
  };

  const tripStartDate = trip.start_date ? new Date(trip.start_date) : new Date();

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GlobeTrotter Smart//Trip Itinerary Planner//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeICS(trip.name || trip.trip_name || 'Trip Itinerary')}`,
    'X-WR-TIMEZONE:UTC'
  ];

  const nowString = formatDateToICS(new Date());

  // Loop through all scheduled days and items
  Object.keys(itineraryDays).forEach((dayKey) => {
    const dayNum = parseInt(dayKey, 10);
    const items = itineraryDays[dayKey] || [];

    // Calculate base date for this itinerary day
    const itemDate = new Date(tripStartDate);
    itemDate.setDate(tripStartDate.getDate() + (dayNum - 1));

    items.forEach((item, idx) => {
      const activity = item.activity || {};
      const duration = activity.duration_minutes || 90;
      const startTimeStr = item.start_time || '10:00';
      const [hours, minutes] = startTimeStr.split(':').map(Number);

      const eventStart = new Date(itemDate);
      eventStart.setHours(hours || 10, minutes || 0, 0, 0);

      const eventEnd = new Date(eventStart);
      eventEnd.setMinutes(eventStart.getMinutes() + duration);

      const uid = `gt-${trip.id || trip.trip_id}-${dayNum}-${item.id || idx}-${Date.now()}@globetrotter.com`;
      const summary = `${activity.name || 'Travel Experience'} (${item.stop_name || item.city_name || ''})`;
      const description = `${activity.description || ''}\\nCost: ₹${parseFloat(item.effective_cost || item.cost || 0).toLocaleString('en-IN')}\\nCategory: ${activity.category || 'General'}`;
      const location = `${item.stop_name || item.city_name || 'Destination'}`;

      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${nowString}`,
        `DTSTART:${formatDateToICS(eventStart)}`,
        `DTEND:${formatDateToICS(eventEnd)}`,
        `SUMMARY:${escapeICS(summary)}`,
        `DESCRIPTION:${escapeICS(description)}`,
        `LOCATION:${escapeICS(location)}`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });
  });

  icsContent.push('END:VCALENDAR');

  const icsBlob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(icsBlob);

  const cleanFileName = `${(trip.name || trip.trip_name || 'trip')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')}_itinerary.ics`;

  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', cleanFileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
};
