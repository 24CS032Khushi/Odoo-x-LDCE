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
  ArrowRight
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardBody } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { FullPageLoader } from '../../components/shared/Loader';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const ItineraryViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toastError } = useToast();

  const [itinerary, setItinerary] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
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
    return <FullPageLoader label="Generating day-wise itinerary..." />;
  }

  if (!itinerary) return null;

  const dayNumbers = Object.keys(itinerary.days || {}).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ocean-teal uppercase tracking-wider">
            <span>Trip Itinerary</span>
            <span>•</span>
            <span>{itinerary.stops_count} Cities</span>
            <span>•</span>
            <span>{itinerary.activities_count} Experiences</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-abyss font-display tracking-tight">
            {itinerary.trip_name}
          </h1>
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            {itinerary.start_date
              ? `${new Date(itinerary.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(itinerary.end_date || itinerary.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
              : 'Flexible Schedule'}
          </p>
        </div>

        {/* View Mode Switch & Builder Action */}
        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
          {/* List vs Calendar Toggle */}
          <div className="inline-flex p-1 rounded-full bg-slate-200/80 border border-slate-300 shadow-inner">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-abyss shadow-sm'
                  : 'text-slate-600 hover:text-abyss'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Timeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'calendar'
                  ? 'bg-white text-abyss shadow-sm'
                  : 'text-slate-600 hover:text-abyss'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Calendar
            </button>
          </div>

          <Link to={`/trips/${id}/builder`}>
            <Button variant="primary" size="md" icon={Edit2}>
              Edit in Builder
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial & Route Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-[16px] bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Budget</span>
          <p className="font-display font-bold text-lg text-abyss mt-0.5">
            ₹{parseFloat(itinerary.total_budget || 0).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Est. Activities Cost</span>
          <p className="font-display font-bold text-lg text-ocean-teal mt-0.5">
            ₹{parseFloat(itinerary.total_estimated_activities_cost || 0).toLocaleString('en-IN')}
          </p>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Destinations</span>
          <p className="font-display font-bold text-lg text-abyss mt-0.5">
            {itinerary.stops_count} {itinerary.stops_count === 1 ? 'City' : 'Cities'}
          </p>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Scheduled Days</span>
          <p className="font-display font-bold text-lg text-abyss mt-0.5">
            {dayNumbers.length} {dayNumbers.length === 1 ? 'Day' : 'Days'}
          </p>
        </div>
      </div>

      {/* Main Schedule Container: List Timeline View */}
      {viewMode === 'list' && (
        <div className="space-y-8">
          {dayNumbers.length > 0 ? (
            dayNumbers.map((dayNum) => {
              const dayItems = itinerary.days[dayNum] || [];
              const dayCost = dayItems.reduce((acc, item) => acc + parseFloat(item.effective_cost || 0), 0);

              return (
                <div
                  key={dayNum}
                  className="bg-white border border-slate-200 rounded-[20px] shadow-sm overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1 rounded-full bg-abyss text-white font-display font-bold text-sm shadow-xs">
                        Day {dayNum}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {dayItems.length} {dayItems.length === 1 ? 'Experience' : 'Experiences'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-ocean-teal">
                      Day Total: ₹{dayCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {/* Day Activities Timeline */}
                  <div className="p-6 space-y-4">
                    {dayItems.map((item, idx) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[16px] bg-slate-50/50 border border-slate-200/80 hover:border-slate-300 transition-colors"
                      >
                        <div className="flex items-start sm:items-center gap-4 min-w-0">
                          <img
                            src={item.activity.image_url}
                            alt={item.activity.name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-xs"
                          />

                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-base text-abyss font-display">
                                {item.activity.name}
                              </h4>
                              <span className="px-2.5 py-0.5 rounded-full bg-ocean-teal/10 text-ocean-teal text-[11px] font-semibold">
                                {item.stop_name}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 line-clamp-1">
                              {item.activity.description}
                            </p>

                            <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-ocean-teal" />
                                {item.start_time || '10:00'} ({item.activity.duration_minutes}m)
                              </span>
                              <span className="capitalize text-slate-400">
                                🏷️ {item.activity.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="self-end sm:self-center text-right flex-shrink-0">
                          <span className="text-sm font-bold text-abyss">
                            {parseFloat(item.effective_cost) === 0 ? 'Free' : `₹${parseFloat(item.effective_cost).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white border border-slate-200 rounded-[20px] p-12 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-abyss">No activities scheduled</h3>
              <p className="text-xs text-slate-500">
                Switch to the Itinerary Builder to add activities and set up your daily timeline.
              </p>
              <Link to={`/trips/${id}/builder`}>
                <Button variant="primary" size="md" icon={Edit2}>
                  Open Itinerary Builder
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Calendar View Mode */}
      {viewMode === 'calendar' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dayNumbers.map((dayNum) => {
              const dayItems = itinerary.days[dayNum] || [];
              return (
                <div
                  key={dayNum}
                  className="bg-white border border-slate-200 rounded-[20px] shadow-sm p-5 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-display font-bold text-base text-abyss">
                      Day {dayNum}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {dayItems.length} events
                    </span>
                  </div>

                  <div className="space-y-3">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-ocean-teal flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.start_time || '10:00'}
                          </span>
                          <span className="font-semibold text-slate-700">
                            {parseFloat(item.effective_cost) === 0 ? 'Free' : `₹${item.effective_cost}`}
                          </span>
                        </div>
                        <h5 className="font-semibold text-xs text-abyss truncate">
                          {item.activity.name}
                        </h5>
                        <p className="text-[11px] text-slate-400 truncate">
                          📍 {item.stop_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItineraryViewPage;
