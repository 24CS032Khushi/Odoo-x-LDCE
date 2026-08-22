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
  Tag
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
      const res = await api.get(`/trips/${id}`);
      if (res.success) {
        setTrip(res.data.trip);
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

  if (isLoading) {
    return <FullPageLoader label="Loading itinerary builder..." />;
  }

  if (!trip) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-ocean-teal uppercase tracking-wider mb-1">
            <span>Itinerary Builder</span>
            <span>•</span>
            <span>{trip.trip_stops?.length || 0} Destination Stops</span>
          </div>
          <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
            {trip.name}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Organize destination stops, arrange activity timelines, and customize costs.
          </p>
        </div>

        <div className="flex items-center gap-3">
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

      {/* Main Builder Stops List */}
      <div className="space-y-6">
        {trip.trip_stops && trip.trip_stops.length > 0 ? (
          trip.trip_stops.map((stop, index) => {
            const activities = stop.itinerary_items || [];

            return (
              <div
                key={stop.id}
                className="bg-white border border-slate-200/90 rounded-[20px] shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Stop Header Banner */}
                <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-abyss text-white font-bold text-xs flex items-center justify-center shadow-xs">
                      {index + 1}
                    </span>

                    <img
                      src={stop.city.image_url}
                      alt={stop.city.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-xs"
                    />

                    <div>
                      <h3 className="font-display font-bold text-lg text-abyss">
                        {stop.city.name}, {stop.city.country}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <span>Cost Index: {stop.city.cost_index}x</span>
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
                      title="Move stop up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === trip.trip_stops.length - 1}
                      onClick={() => handleMoveStop(index, 1)}
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-200/70 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move stop down"
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
                      title="Delete stop"
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
                                  <span>• ₹{parseFloat(cost || 0).toLocaleString('en-IN')}</span>
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
