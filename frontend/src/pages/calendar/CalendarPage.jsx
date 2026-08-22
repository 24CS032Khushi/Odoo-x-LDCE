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
      const res = await api.get(`/trips/${tripId}`);
      if (res.success) {
        setItinerary(res.data.trip);
      }
    } catch (err) {
      toastError('Failed to load itinerary schedule');
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
      await api.put(`/trips/${selectedTripId}/itinerary-items/${itemId}`, {
        start_time: newTime
      });
      success('Schedule updated');
      setEditingItemId(null);
      fetchItinerary(selectedTripId);
    } catch (err) {
      toastError(err.message || 'Failed to update time');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await api.delete(`/trips/${selectedTripId}/itinerary-items/${itemId}`);
      success('Activity removed from schedule');
      fetchItinerary(selectedTripId);
    } catch (err) {
      toastError('Failed to remove item');
    }
  };

  const handleMoveItemToDay = async (itemId, targetDay) => {
    try {
      await api.put(`/trips/${selectedTripId}/itinerary-items/${itemId}`, {
        day_number: targetDay
      });
      success(`Moved activity to Day ${targetDay}`);
      fetchItinerary(selectedTripId);
    } catch (err) {
      toastError(err.message || 'Failed to move activity');
    }
  };

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
    return <FullPageLoader label="Calculating schedule timeline & pacing..." />;
  }

  if (trips.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in text-[#0F172A] font-sans">
        <div className="neu-card p-6 sm:p-8 shadow-neu-extruded">
          <h1 className="text-3xl sm:text-4xl font-black font-display text-[#0F172A] tracking-tight flex items-center gap-1">
            <span>Trip Calendar & Timeline</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-sans">
            Interactive multi-day schedule, buffer pacing, and conflict resolution.
          </p>
        </div>
        <div className="neu-card p-14 text-center max-w-md mx-auto space-y-4 shadow-neu-extruded">
          <div className="w-14 h-14 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0F172A]">No itineraries to display</h3>
          <p className="text-xs text-slate-500">
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

  // Calculate total days from items
  const allItems = itinerary?.itinerary_items || [];
  const maxDay = allItems.reduce((max, item) => Math.max(max, item.day_number || 1), 1);
  const totalDays = Math.max(maxDay, 3); // minimum 3 day slots

  // Group items by day
  const itemsByDay = {};
  for (let d = 1; d <= totalDays; d++) {
    itemsByDay[d] = allItems.filter((i) => i.day_number === d).sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
  }

  return (
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* Top Header & Trip Selector in High-Contrast Tactile Card */}
      <div className="neu-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-neu-extruded">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-primary uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5" />
            <span>Interactive Pacing Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
            <span>Trip Schedule & Timeline</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 font-sans">
            Chronological multi-day timeline, activity rescheduling, and pacing diagnostics.
          </p>
        </div>

        {/* Trip Switcher & Quick Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedTripId || ''}
            onChange={(e) => {
              const id = parseInt(e.target.value, 10);
              setSelectedTripId(id);
              setSearchParams({ trip_id: id });
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-xs font-mono font-bold text-[#0F172A] shadow-neu-inset-sm focus:outline-none focus:border-amber-primary cursor-pointer"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#E5EAF0] text-[#0F172A]">
                📍 {t.name}
              </option>
            ))}
          </select>

          <Link to={`/trips/${selectedTripId}`}>
            <Button variant="secondary" size="md">
              Full Itinerary
            </Button>
          </Link>
        </div>
      </div>

      {/* Sanity Check Alerts Banner for this trip */}
      {selectedTripId && <SanityCheckBanner tripId={selectedTripId} />}

      {/* Day Selector Pills Bar */}
      <div className="neu-card p-3 flex items-center gap-2 overflow-x-auto shadow-neu-extruded">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((dayNum) => {
          const itemCount = itemsByDay[dayNum]?.length || 0;
          const isSelected = selectedDay === dayNum;

          return (
            <button
              key={dayNum}
              type="button"
              onClick={() => setSelectedDay(dayNum)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-display font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? 'neu-btn-primary text-white shadow-neu-amber'
                  : 'bg-[#DFE4EA] text-slate-600 hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
              }`}
            >
              <span>Day {dayNum}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-white/20 text-white' : 'bg-[#CBD5E1] text-slate-700'
              }`}>
                {itemCount}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Timeline View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left 2 Cols: Active Day Activities List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="neu-card p-6 flex items-center justify-between shadow-neu-extruded">
            <div>
              <h2 className="font-display font-black text-xl text-[#0F172A] flex items-center gap-2">
                <span>Day {selectedDay} Schedule</span>
                <span className="text-amber-primary">.</span>
              </h2>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                {itemsByDay[selectedDay]?.length || 0} activities scheduled for this day
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-amber-primary bg-[#DFE4EA] px-3 py-1.5 rounded-xl border border-slate-300 shadow-neu-inset-sm">
              Day {selectedDay} of {totalDays}
            </span>
          </div>

          {itemsByDay[selectedDay] && itemsByDay[selectedDay].length > 0 ? (
            <div className="space-y-3">
              {itemsByDay[selectedDay].map((item, idx) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="neu-card p-5 flex items-center justify-between gap-4 group cursor-grab active:cursor-grabbing hover:border-amber-primary/40 transition-all shadow-neu-extruded"
                >
                  <div className="flex items-center gap-3.5">
                    <GripVertical className="w-4 h-4 text-slate-400 group-hover:text-amber-primary transition-colors" />

                    <div className="w-8 h-8 rounded-xl bg-[#DFE4EA] border border-slate-300 text-slate-700 flex items-center justify-center font-mono text-xs font-bold shadow-neu-inset-sm">
                      {idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display font-bold text-base text-[#0F172A]">
                          {item.activity?.name || 'Custom Activity'}
                        </h4>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {item.activity?.category || 'Activity'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-primary" />
                          {item.start_time || '09:00'} (⏱️ {item.activity?.duration_mins || 60}m)
                        </span>
                        <span>•</span>
                        <span className="font-bold text-[#0F172A]">
                          ₹{parseFloat(item.activity?.cost || 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Reschedule Dropdown */}
                    <select
                      value={item.day_number}
                      onChange={(e) => handleMoveItemToDay(item.id, parseInt(e.target.value, 10))}
                      className="px-2.5 py-1 rounded-xl bg-[#DFE4EA] border border-slate-300 text-xs font-mono font-bold text-[#0F172A] shadow-neu-inset-sm cursor-pointer outline-none"
                    >
                      {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          Move to Day {d}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              onDragOver={handleDragOver}
              onDrop={(e) => handleDropOnDay(e, selectedDay)}
              className="neu-card p-12 text-center space-y-3 border-dashed border-2 border-slate-300 shadow-neu-extruded"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-[#0F172A]">No activities on Day {selectedDay}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
                Drag an activity from another day here or open the Itinerary Builder to add items from the catalog.
              </p>
              <Link to={`/trips/${selectedTripId}`}>
                <Button variant="outline" size="sm">
                  Add Activities from Itinerary
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right 1 Col: All Days Summary & Drag Targets */}
        <div className="space-y-4">
          <div className="neu-card p-6 space-y-4 shadow-neu-extruded">
            <h3 className="font-display font-extrabold text-base text-[#0F172A]">
              Itinerary Overview ({totalDays} Days)
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Drag any activity and drop it onto a day card below to reschedule.
            </p>

            <div className="space-y-2.5">
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => {
                const count = itemsByDay[d]?.length || 0;
                const isCurrent = selectedDay === d;

                return (
                  <div
                    key={d}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnDay(e, d)}
                    onClick={() => setSelectedDay(d)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isCurrent
                        ? 'bg-[#CBD5E1] border-amber-primary shadow-neu-inset-sm'
                        : 'bg-[#DFE4EA] border-slate-300 hover:border-slate-400 shadow-neu-extruded-sm'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-primary" />
                      <span className="font-display font-bold text-xs text-[#0F172A]">
                        Day {d}
                      </span>
                    </div>

                    <span className="text-[11px] font-mono text-slate-600">
                      {count} {count === 1 ? 'activity' : 'activities'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
