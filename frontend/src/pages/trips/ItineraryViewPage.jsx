import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Tag,
  Layers,
  Edit2,
  Sparkles,
  List,
  CalendarDays,
  ArrowRight,
  Wallet,
  HeartPulse,
  Share2
} from 'lucide-react';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { FullPageLoader } from '../../components/shared/Loader';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const ItineraryViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [itinerary, setItinerary] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedDayFilter, setSelectedDayFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const fetchItinerary = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/trips/${id}/itinerary`);
      if (res.success) {
        setItinerary(res.data);
      }
    } catch (err) {
      if (toastError) toastError('Failed to load itinerary');
      navigate('/trips');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <FullPageLoader label="Generating day-wise itinerary storyboard..." />;
  }

  if (!itinerary) return null;

  const dayNumbers = Object.keys(itinerary.days || {}).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  const filteredDays = selectedDayFilter === 'all'
    ? dayNumbers
    : dayNumbers.filter((d) => d === selectedDayFilter);

  return (
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* Top Header Summary in High-Contrast Tactile Card */}
      <div className="neu-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-neu-extruded">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-primary uppercase tracking-wider">
            <span>Trip Itinerary</span>
            <span>•</span>
            <span>{itinerary.stops_count} Destinations</span>
            <span>•</span>
            <span>{itinerary.activities_count} Scheduled Experiences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
            <span>{itinerary.trip_name}</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 flex items-center gap-2 font-mono">
            <Calendar className="w-4 h-4 text-amber-primary" />
            {itinerary.start_date
              ? `${new Date(itinerary.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(itinerary.end_date || itinerary.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'Flexible Schedule'}
          </p>
        </div>

        {/* Intelligence Links & Builder Action */}
        <div className="flex flex-wrap items-center gap-3">
          <Link to={`/budget?trip_id=${id}`}>
            <Button variant="secondary" size="md" icon={Wallet}>
              Budget
            </Button>
          </Link>
          <Link to={`/calendar?trip_id=${id}`}>
            <Button variant="secondary" size="md" icon={HeartPulse}>
              Health Audit
            </Button>
          </Link>
          <Link to={`/trips/${id}/builder`}>
            <Button variant="primary" size="md" icon={Edit2}>
              Builder
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial & Route Summary Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="neu-card p-6 space-y-1 shadow-neu-extruded">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Total Budget</span>
          <p className="font-mono font-bold text-2xl text-[#0F172A] mt-1">
            ₹{parseFloat(itinerary.total_budget || 0).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="neu-card p-6 space-y-1 shadow-neu-extruded">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Est. Activities Cost</span>
          <p className="font-mono font-bold text-2xl text-amber-primary mt-1">
            ₹{parseFloat(itinerary.total_estimated_activities_cost || 0).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="neu-card p-6 space-y-1 shadow-neu-extruded">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Destinations</span>
          <p className="font-display font-black text-2xl text-[#0F172A] mt-1">
            {itinerary.stops_count} {itinerary.stops_count === 1 ? 'City' : 'Cities'}
          </p>
        </div>

        <div className="neu-card p-6 space-y-1 shadow-neu-extruded">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500">Scheduled Days</span>
          <p className="font-display font-black text-2xl text-teal-accent mt-1">
            {dayNumbers.length} {dayNumbers.length === 1 ? 'Day' : 'Days'}
          </p>
        </div>
      </div>

      {/* Mode Switch & Day Filter Pills in Tactile Bar */}
      <div className="neu-card p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-neu-extruded">
        {/* Day Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setSelectedDayFilter('all')}
            className={`px-4 py-2 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all ${
              selectedDayFilter === 'all'
                ? 'neu-btn-primary text-white shadow-neu-amber'
                : 'bg-[#E5EAF0] text-slate-600 hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
            }`}
          >
            All Days ({dayNumbers.length})
          </button>
          {dayNumbers.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDayFilter(d)}
              className={`px-4 py-2 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all ${
                selectedDayFilter === d
                  ? 'neu-btn-primary text-white shadow-neu-amber'
                  : 'bg-[#E5EAF0] text-slate-600 hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
              }`}
            >
              Day {d}
            </button>
          ))}
        </div>

        {/* View Mode Switch */}
        <div className="inline-flex p-1 rounded-2xl bg-[#CBD5E1] shadow-neu-inset-sm self-end sm:self-auto border border-slate-300">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
              viewMode === 'list'
                ? 'bg-[#E5EAF0] text-[#0F172A] shadow-neu-extruded-sm border border-slate-300'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Timeline</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-[#E5EAF0] text-[#0F172A] shadow-neu-extruded-sm border border-slate-300'
                : 'text-slate-600 hover:text-[#0F172A]'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Grid View</span>
          </button>
        </div>
      </div>

      {/* Main Storyboard Body */}
      {filteredDays.length > 0 ? (
        <div className="space-y-8">
          {filteredDays.map((dayNum) => {
            const items = itinerary.days[dayNum] || [];

            return (
              <div
                key={dayNum}
                className="neu-card p-6 sm:p-7 space-y-5 transition-all shadow-neu-extruded"
              >
                {/* Day Section Header */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary font-display font-black text-sm flex items-center justify-center shadow-neu-inset-sm">
                      D{dayNum}
                    </span>
                    <div>
                      <h2 className="font-display font-extrabold text-lg text-[#0F172A]">
                        Day {dayNum} Itinerary
                      </h2>
                      <span className="text-xs text-slate-500 font-sans">
                        {items.length} {items.length === 1 ? 'experience' : 'experiences'} scheduled
                      </span>
                    </div>
                  </div>

                  <Link to={`/trips/${id}/builder`}>
                    <Button variant="ghost" size="sm" icon={Edit2}>
                      Edit Schedule
                    </Button>
                  </Link>
                </div>

                {/* Day Activities */}
                {items.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                    {items.map((item, idx) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl bg-[#DFE4EA] border border-slate-300 shadow-neu-inset-sm flex flex-col justify-between gap-3 ${
                          viewMode === 'grid' ? 'h-full' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3.5">
                          {item.activity?.image_url ? (
                            <img
                              src={item.activity.image_url}
                              alt={item.activity.name}
                              className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white shadow-xs"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-xl bg-[#CBD5E1] border border-slate-300 flex items-center justify-center text-amber-primary flex-shrink-0">
                              <Compass className="w-6 h-6" />
                            </div>
                          )}

                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-mono font-bold text-amber-primary flex items-center gap-1">
                                <Clock className="w-3 h-3 text-amber-primary" />
                                {item.start_time || '10:00'} (⏱️ {item.activity?.duration_mins || 60}m)
                              </span>
                              <span className="text-xs font-mono font-bold text-[#0F172A]">
                                ₹{parseFloat(item.custom_cost ?? item.activity?.cost ?? 0).toLocaleString('en-IN')}
                              </span>
                            </div>

                            <h4 className="font-display font-extrabold text-sm text-[#0F172A] leading-tight truncate">
                              {item.activity?.name || 'Custom Activity'}
                            </h4>

                            <p className="text-xs text-slate-600 line-clamp-2 font-sans">
                              {item.activity?.description || 'Curated itinerary destination highlight.'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-300/80 text-[11px] font-mono text-slate-500">
                          <span className="capitalize font-bold text-teal-accent">
                            🏷️ {item.activity?.category || 'General'}
                          </span>
                          <span className="truncate max-w-[150px]">
                            📍 {item.trip_stop?.city?.name || 'Destination'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic py-2">No activities scheduled for Day {dayNum}.</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="neu-card p-14 text-center max-w-md mx-auto space-y-4 shadow-neu-extruded">
          <div className="w-14 h-14 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0F172A]">No activities scheduled</h3>
          <p className="text-xs text-slate-500">
            Open the visual Builder to start adding destination stops and curating attractions.
          </p>
          <Link to={`/trips/${id}/builder`}>
            <Button variant="primary" size="md" icon={Edit2}>
              Open Itinerary Builder
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ItineraryViewPage;
