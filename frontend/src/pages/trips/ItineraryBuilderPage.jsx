import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  DollarSign,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Tag,
  Activity,
  Wallet,
  CalendarDays,
  Scale
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardBody } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import AddStopModal from '../../components/trips/AddStopModal';
import AddActivityModal from '../../components/trips/AddActivityModal';
import { FullPageLoader } from '../../components/shared/Loader';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const ItineraryBuilderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { success, info, error: toastError } = useToast();

  const [trip, setTrip] = useState(null);
  const [healthScore, setHealthScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [addStopOpen, setAddStopOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    setIsLoading(true);
    try {
      const [tripRes, healthRes] = await Promise.all([
        api.get(`/trips/${id}`),
        api.get(`/trips/${id}/health-score`).catch(() => ({ success: false }))
      ]);

      if (tripRes.success) {
        setTrip(tripRes.data.trip);
      }
      if (healthRes.success) {
        setHealthScore(healthRes.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load trip');
      navigate('/trips');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoveStop = async (index, direction) => {
    if (!trip?.trip_stops) return;
    const stops = [...trip.trip_stops];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= stops.length) return;

    // Swap
    const temp = stops[index];
    stops[index] = stops[targetIndex];
    stops[targetIndex] = temp;

    // Update order indexes
    const payload = stops.map((s, idx) => ({ id: s.id, order_index: idx }));

    // Optimistic update
    setTrip((prev) => ({ ...prev, trip_stops: stops }));

    try {
      await api.put(`/trips/${id}/stops/reorder`, { stops: payload });
      success('Stop order updated');
      fetchTripDetails();
    } catch (err) {
      toastError('Failed to reorder stops');
      fetchTripDetails();
    }
  };

  const handleDeleteStop = async (stopId) => {
    if (!window.confirm('Remove this destination stop and all its scheduled activities?')) return;

    try {
      await api.delete(`/trips/${id}/stops/${stopId}`);
      setTrip((prev) => ({
        ...prev,
        trip_stops: prev.trip_stops.filter((s) => s.id !== stopId)
      }));
      success('Stop removed');
      fetchTripDetails();
    } catch (err) {
      toastError(err.message || 'Failed to remove stop');
    }
  };

  const handleDeleteActivity = async (itemId) => {
    try {
      await api.delete(`/trips/${id}/itinerary-items/${itemId}`);
      success('Activity removed from schedule');
      fetchTripDetails();
    } catch (err) {
      toastError(err.message || 'Failed to delete activity');
    }
  };

  if (isLoading && !trip) {
    return <FullPageLoader label="Loading itinerary builder & route timeline..." />;
  }

  if (!trip) return null;

  const totalActivitiesCount = trip.trip_stops?.reduce(
    (acc, stop) => acc + (stop.itinerary_items?.length || 0),
    0
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Navigation Shortcuts */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-ocean-teal uppercase tracking-wider mb-1">
            <span>Itinerary Builder</span>
            <span>•</span>
            <span>{trip.trip_stops?.length || 0} Destination Stops</span>
            <span>•</span>
            <span>{totalActivitiesCount} Activities</span>

            {/* Live Mini Health Score Chip */}
            {healthScore && (
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 ${
                healthScore.overall >= 80
                  ? 'bg-ocean-teal/10 text-ocean-teal'
                  : healthScore.overall >= 50
                  ? 'bg-amber-500/10 text-amber-700'
                  : 'bg-red-500/10 text-[#c0392b]'
              }`}>
                <Activity className="w-3 h-3" />
                Score: {healthScore.overall}/100 ({healthScore.label})
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
            {trip.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize destination stops, arrange activity timelines, and customize costs.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link to={`/budget?trip_id=${id}`}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-abyss shadow-xs transition-colors"
            >
              <Wallet className="w-3.5 h-3.5 text-ocean-teal" />
              <span>Budget</span>
            </button>
          </Link>

          <Link to={`/calendar?trip_id=${id}`}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-abyss shadow-xs transition-colors"
            >
              <CalendarDays className="w-3.5 h-3.5 text-ocean-teal" />
              <span>Calendar</span>
            </button>
          </Link>

          <Button
            variant="outline"
            size="md"
            icon={Eye}
            onClick={() => navigate(`/trips/${id}`)}
          >
            View Itinerary
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setAddStopOpen(true)}
          >
            Add Stop
          </Button>
        </div>
      </div>

      {/* Main Builder Stops List with Vertical Connecting Route Timeline Spine */}
      <div className="space-y-6 relative">
        {trip.trip_stops && trip.trip_stops.length > 0 ? (
          trip.trip_stops.map((stop, index) => {
            const activities = stop.itinerary_items || [];
            const isLastStop = index === trip.trip_stops.length - 1;

            return (
              <div key={stop.id} className="relative">
                {/* Visual Route Timeline Connector Line to Next Stop */}
                {!isLastStop && (
                  <div className="hidden sm:block absolute left-8 top-full h-6 w-0.5 bg-slate-300 border-l border-dashed border-slate-400 z-0" />
                )}

                <div className="bg-white border border-slate-200/90 rounded-[20px] shadow-sm overflow-hidden transition-all duration-200 relative z-10">
                  {/* Stop Header Banner */}
                  <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Numbered Transit Stop Node */}
                      <span className="w-8 h-8 rounded-full bg-abyss text-white font-bold text-xs flex items-center justify-center shadow-xs flex-shrink-0">
                        {index + 1}
                      </span>

                      <img
                        src={stop.city.image_url}
                        alt={stop.city.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-xs flex-shrink-0"
                      />

                      <div>
                        <h3 className="font-display font-bold text-lg text-abyss">
                          {stop.city.name}, {stop.city.country}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span>Cost Index: {parseFloat(stop.city.cost_index || 1.0).toFixed(1)}x</span>
                          {stop.arrival_date && (
                            <span>
                              • Dates: {new Date(stop.arrival_date).toLocaleDateString()}
                              {stop.departure_date ? ` – ${new Date(stop.departure_date).toLocaleDateString()}` : ''}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Stop Action Controls (Reorder up/down, add activity, delete stop) */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => handleMoveStop(index, -1)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move stop up in route"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={index === trip.trip_stops.length - 1}
                        onClick={() => handleMoveStop(index, 1)}
                        className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move stop down in route"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Plus}
                        onClick={() => setActiveStopForActivity(stop)}
                      >
                        Add Activity
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStop(stop.id)}
                        className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete destination stop"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scheduled Activities for this stop */}
                  <div className="p-5 sm:p-6 space-y-3">
                    {activities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activities.map((item) => {
                          const cost = item.custom_cost !== null ? item.custom_cost : item.activity.cost;
                          return (
                            <div
                              key={item.id}
                              className="flex items-center justify-between p-3.5 rounded-[16px] bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={item.activity.image_url}
                                  alt={item.activity.name}
                                  className="w-12 h-12 rounded-xl object-cover flex-shrink-0 shadow-2xs"
                                />
                                <div className="min-w-0 space-y-0.5">
                                  <h4 className="font-semibold text-sm text-abyss truncate">
                                    {item.activity.name}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="font-semibold text-ocean-teal bg-ocean-teal/10 px-2 py-0.5 rounded-md">
                                      Day {item.day_number}
                                    </span>
                                    <span>🕒 {item.start_time || '10:00'}</span>
                                    <span>• {parseFloat(cost || 0) === 0 ? 'Free' : `₹${parseFloat(cost || 0).toLocaleString('en-IN')}`}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteActivity(item.id)}
                                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors ml-2"
                                title="Remove activity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 border-dashed border-2 border-slate-200 rounded-[16px] space-y-2">
                        <p className="text-xs text-slate-500">
                          No activities scheduled for {stop.city.name} yet.
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={Plus}
                          onClick={() => setActiveStopForActivity(stop)}
                        >
                          Browse & Schedule Attractions
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          /* Empty stops state */
          <div className="bg-white border border-slate-200 rounded-[20px] p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-abyss">No stops in this trip yet</h3>
            <p className="text-xs text-slate-500">
              Add your first destination city to start building the daily itinerary.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => setAddStopOpen(true)}
            >
              Add First Stop
            </Button>
          </div>
        )}
      </div>

      {/* Add Stop Modal */}
      <AddStopModal
        isOpen={addStopOpen}
        onClose={() => setAddStopOpen(false)}
        tripId={id}
        onStopAdded={() => fetchTripDetails()}
      />

      {/* Add Activity Modal */}
      {activeStopForActivity && (
        <AddActivityModal
          isOpen={!!activeStopForActivity}
          onClose={() => setActiveStopForActivity(null)}
          tripId={id}
          stop={activeStopForActivity}
          onActivityAdded={() => {
            setActiveStopForActivity(null);
            fetchTripDetails();
          }}
        />
      )}
    </div>
  );
};

export default ItineraryBuilderPage;
