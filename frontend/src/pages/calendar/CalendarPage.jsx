import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Move,
  Edit2,
  Trash2,
  Check,
  Sparkles,
  ArrowRight,
  GripVertical
} from 'lucide-react';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { FullPageLoader } from '../../components/shared/Loader';
import HealthScoreGauge from '../../components/analytics/HealthScoreGauge';
import SanityCheckBanner from '../../components/analytics/SanityCheckBanner';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const CalendarPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tripParamId = searchParams.get('trip_id');
  const { success, error: toastError } = useToast();

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripParamId || null);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState(1);
  const [expandedDays, setExpandedDays] = useState({ 1: true });
  const [editingItemId, setEditingItemId] = useState(null);
  const [editTimeVal, setEditTimeVal] = useState('');
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) {
      fetchItinerary(selectedTripId);
    }
  }, [selectedTripId]);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      if (res.success && res.data.trips.length > 0) {
        setTrips(res.data.trips);
        if (!selectedTripId) {
          const initialId = tripParamId ? parseInt(tripParamId, 10) : res.data.trips[0].id;
          setSelectedTripId(initialId);
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      toastError('Failed to load trips');
      setIsLoading(false);
    }
  };

  const fetchItinerary = async (tripId) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/trips/${tripId}/itinerary`);
      if (res.success) {
        setItinerary(res.data);
        const days = Object.keys(res.data.days || {}).map(Number);
        if (days.length > 0) {
          setSelectedDay(days[0]);
          setExpandedDays({ [days[0]]: true });
        }
      }
    } catch (err) {
      toastError('Failed to load itinerary calendar');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDayExpansion = (dayNum) => {
    setExpandedDays((prev) => ({
      ...prev,
      [dayNum]: !prev[dayNum]
    }));
  };

  const handleUpdateItemTime = async (itemId, newTime) => {
    try {
      const res = await api.put(`/trips/${selectedTripId}/itinerary-items/${itemId}`, {
        start_time: newTime
      });
      if (res.success) {
        success('Schedule time updated');
        setEditingItemId(null);
        fetchItinerary(selectedTripId);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update time');
    }
  };

  const handleMoveItemToDay = async (itemId, targetDay) => {
    try {
      const res = await api.put(`/trips/${selectedTripId}/itinerary-items/${itemId}`, {
        day_number: targetDay
      });
      if (res.success) {
        success(`Activity moved to Day ${targetDay}`);
        setExpandedDays((prev) => ({ ...prev, [targetDay]: true }));
        fetchItinerary(selectedTripId);
      }
    } catch (err) {
      toastError(err.message || 'Failed to move activity');
    }
  };

  // Drag and Drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', item.id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDropOnDay = (e, targetDay) => {
    e.preventDefault();
    if (draggedItem && draggedItem.day_number !== targetDay) {
      handleMoveItemToDay(draggedItem.id, targetDay);
    }
    setDraggedItem(null);
  };

  if (isLoading && !itinerary) {
    return <FullPageLoader label="Loading interactive trip calendar & timeline..." />;
  }

  if (trips.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
            Trip Calendar & Timeline
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Interactive multi-day schedule, buffer pacing, and conflict resolution
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[20px] p-16 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-abyss">No itineraries to display</h3>
          <p className="text-sm text-slate-500">
            Create a trip and schedule activities to visualize your journey on the calendar.
          </p>
          <Link to="/trips">
            <Button variant="primary" size="md">
              Plan Your Journey
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const dayNumbers = Object.keys(itinerary?.days || {}).map(Number).sort((a, b) => a - b);
  const flags = itinerary?.sanity_flags || [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Trip Switcher */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ocean-teal uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline Visualizer</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-abyss font-display tracking-tight">
            Trip Calendar & Pacing
          </h1>
          <p className="text-sm text-slate-500">
            Drag-and-drop rescheduling across days with real-time health score calculation
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedTripId || ''}
            onChange={(e) => {
              const id = parseInt(e.target.value, 10);
              setSelectedTripId(id);
              setSearchParams({ trip_id: id });
            }}
            className="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-abyss shadow-xs focus:outline-none focus:border-ocean-teal cursor-pointer"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
                📍 {t.name}
              </option>
            ))}
          </select>

          <Link to={`/trips/${selectedTripId}/builder`}>
            <Button variant="primary" size="md">
              Open Builder
            </Button>
          </Link>
        </div>
      </div>

      {itinerary && (
        <>
          {/* Top Row: Health Score Radial Gauge */}
          <HealthScoreGauge scoreData={itinerary.health_score} />

          {/* Active Sanity Flags Section (if any detected) */}
          {flags.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-display font-bold text-lg text-abyss flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#c0392b]" />
                <span>Active Schedule & Route Flags ({flags.length})</span>
              </h3>
              <div className="space-y-2.5">
                {flags.map((flag) => (
                  <SanityCheckBanner
                    key={flag.id}
                    flag={flag}
                    tripId={selectedTripId}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Interactive Multi-Day Calendar / Timeline Container */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-abyss">
                Day-by-Day Timeline & Rescheduling
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                💡 Drag activities or select a day below to expand
              </span>
            </div>

            {/* Daily Grid Cards on Foam */}
            <div className="space-y-4">
              {dayNumbers.length > 0 ? (
                dayNumbers.map((dayNum) => {
                  const dayItems = itinerary.days[dayNum] || [];
                  const isExpanded = !!expandedDays[dayNum];
                  const isDaySelected = selectedDay === dayNum;
                  const dayFlags = flags.filter((f) => f.day_number === dayNum);
                  const hasAlert = dayFlags.some((f) => f.severity === 'alert');
                  const hasWarning = dayFlags.some((f) => f.severity === 'warning');

                  const dayCost = dayItems.reduce((acc, item) => acc + parseFloat(item.effective_cost || 0), 0);

                  return (
                    <div
                      key={dayNum}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDropOnDay(e, dayNum)}
                      className={`rounded-[20px] bg-white border transition-all overflow-hidden shadow-xs ${
                        hasAlert
                          ? 'border-l-4 border-l-[#c0392b] border-slate-200'
                          : hasWarning
                          ? 'border-l-4 border-l-amber-500 border-slate-200'
                          : 'border-slate-200'
                      } ${isDaySelected ? 'ring-2 ring-ocean-teal/20 bg-ocean-teal/[0.02]' : ''}`}
                    >
                      {/* Day Header Accordion Toggle */}
                      <div
                        onClick={() => {
                          setSelectedDay(dayNum);
                          toggleDayExpansion(dayNum);
                        }}
                        className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors select-none"
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`px-3.5 py-1 rounded-full text-xs font-display font-bold transition-colors ${
                              isDaySelected
                                ? 'bg-ocean-teal text-white shadow-xs'
                                : 'bg-abyss text-white'
                            }`}
                          >
                            Day {dayNum}
                          </span>

                          <span className="text-xs font-semibold text-slate-700">
                            {dayItems.length} {dayItems.length === 1 ? 'Activity' : 'Activities'}
                          </span>

                          {dayFlags.length > 0 && (
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              hasAlert ? 'bg-red-500/10 text-[#c0392b]' : 'bg-amber-500/10 text-amber-700'
                            }`}>
                              <AlertTriangle className="w-3 h-3" />
                              {dayFlags.length} {dayFlags.length === 1 ? 'Flag' : 'Flags'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="text-xs font-bold text-ocean-teal hidden sm:inline">
                            Day Spend: ₹{dayCost.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            className="p-1.5 rounded-full text-slate-400 hover:text-abyss hover:bg-slate-100 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Day Content Area (Accordion) */}
                      {isExpanded && (
                        <div className="p-6 pt-2 border-t border-slate-100 space-y-3 animate-fade-in">
                          {/* Inline Day Flags */}
                          {dayFlags.map((df) => (
                            <SanityCheckBanner key={df.id} flag={df} tripId={selectedTripId} className="mb-2" />
                          ))}

                          {dayItems.length > 0 ? (
                            <div className="space-y-2.5">
                              {dayItems.map((item) => (
                                <div
                                  key={item.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, item)}
                                  className="p-4 rounded-[16px] bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-grab active:cursor-grabbing group"
                                >
                                  <div className="flex items-center gap-3.5 min-w-0">
                                    <div className="text-slate-300 group-hover:text-slate-500 transition-colors flex-shrink-0">
                                      <GripVertical className="w-4 h-4" />
                                    </div>

                                    <img
                                      src={item.activity.image_url}
                                      alt={item.activity.name}
                                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-xs"
                                    />

                                    <div className="min-w-0 space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <h5 className="font-bold text-sm text-abyss font-display truncate">
                                          {item.activity.name}
                                        </h5>
                                        <span className="px-2 py-0.5 rounded-full bg-ocean-teal/10 text-ocean-teal text-[10px] font-semibold flex-shrink-0">
                                          {item.stop_name}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-3 text-xs text-slate-500">
                                        {/* Inline editable time */}
                                        {editingItemId === item.id ? (
                                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                            <input
                                              type="time"
                                              value={editTimeVal}
                                              onChange={(e) => setEditTimeVal(e.target.value)}
                                              className="px-2 py-0.5 rounded-lg border border-ocean-teal text-xs font-semibold text-abyss bg-white"
                                            />
                                            <button
                                              type="button"
                                              onClick={() => handleUpdateItemTime(item.id, editTimeVal)}
                                              className="p-1 rounded-full bg-ocean-teal text-white hover:bg-ocean-deep transition-colors"
                                              title="Save time"
                                            >
                                              <Check className="w-3 h-3" />
                                            </button>
                                          </div>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setEditingItemId(item.id);
                                              setEditTimeVal(item.start_time || '10:00');
                                            }}
                                            className="flex items-center gap-1 font-semibold text-slate-700 hover:text-ocean-teal transition-colors"
                                            title="Click to edit time"
                                          >
                                            <Clock className="w-3 h-3 text-ocean-teal" />
                                            <span>{item.start_time || '10:00'} ({item.activity.duration_minutes}m)</span>
                                            <Edit2 className="w-2.5 h-2.5 opacity-60 ml-0.5" />
                                          </button>
                                        )}

                                        <span className="capitalize text-slate-400">
                                          🏷️ {item.activity.category}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="self-end sm:self-center flex items-center gap-3 flex-shrink-0">
                                    <span className="text-xs font-bold text-abyss">
                                      {parseFloat(item.effective_cost) === 0 ? 'Free' : `₹${parseFloat(item.effective_cost).toLocaleString('en-IN')}`}
                                    </span>

                                    {/* Quick Move Day Dropdown */}
                                    <select
                                      value={dayNum}
                                      onChange={(e) => handleMoveItemToDay(item.id, parseInt(e.target.value, 10))}
                                      onClick={(e) => e.stopPropagation()}
                                      className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-ocean-teal cursor-pointer"
                                      title="Move to another day"
                                    >
                                      {dayNumbers.map((d) => (
                                        <option key={d} value={d}>
                                          Day {d}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 rounded-[16px] bg-slate-50/50 border border-dashed border-slate-200 text-center space-y-1">
                              <p className="text-xs font-semibold text-slate-500">
                                Light Buffer / Rest Day (0 activities scheduled)
                              </p>
                              <p className="text-[11px] text-slate-400">
                                Drag activities here from other days to populate this date.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-12 text-center bg-white rounded-[20px] border border-slate-200">
                  <p className="text-xs text-slate-500">No scheduled days found in itinerary.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CalendarPage;
