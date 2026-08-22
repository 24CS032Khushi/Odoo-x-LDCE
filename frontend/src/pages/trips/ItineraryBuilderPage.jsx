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
  AlertTriangle,
  CheckCircle2,
  Info,
  ShieldCheck,
  Tag
} from 'lucide-react';
import Card from '../../components/shared/Card';
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
  const [sanityStatus, setSanityStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [addStopOpen, setAddStopOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState(null);

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    setIsLoading(true);
    try {
      const [tripRes, sanityRes] = await Promise.all([
        api.get(`/trips/${id}`),
        api.get(`/trips/${id}/route-sanity`).catch(() => ({ data: { checks: [] } }))
      ]);

      if (tripRes.success) {
        setTrip(tripRes.data.trip);
      }
      if (sanityRes.data) {
        setSanityStatus(sanityRes.data);
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

    const temp = stops[index];
    stops[index] = stops[targetIndex];
    stops[targetIndex] = temp;

    const payload = stops.map((s, idx) => ({ id: s.id, order_index: idx }));
    setTrip((prev) => ({ ...prev, trip_stops: stops }));

    try {
      await api.put(`/trips/${id}/stops/reorder`, { stops: payload });
      success('Stop order updated');
      const sanityRes = await api.get(`/trips/${id}/route-sanity`);
      if (sanityRes.data) setSanityStatus(sanityRes.data);
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
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* Top Header in High-Contrast Tactile Card */}
      <div className="neu-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-neu-extruded">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-primary uppercase tracking-wider mb-1">
            <span>Itinerary Builder</span>
            <span>•</span>
            <span>{trip.trip_stops?.length || 0} Destination Stops</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
            <span>{trip.name}</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-sans">
            Organize destination milestones, arrange daily activity sequences, and validate travel route continuity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            icon={Eye}
            onClick={() => navigate(`/trips/${id}`)}
          >
            View Storyboard
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

      {/* Live Route Sanity Inspector */}
      {sanityStatus?.checks && sanityStatus.checks.length > 0 && (
        <div className="space-y-2.5">
          {sanityStatus.checks.map((check) => (
            <div
              key={check.id}
              className={`p-4 rounded-2xl border flex items-start gap-3 text-xs shadow-neu-extruded-sm ${
                check.severity === 'error'
                  ? 'bg-rose-50/90 border-rose-200 text-rose-800'
                  : check.severity === 'warning'
                  ? 'bg-amber-50/90 border-amber-200 text-amber-800'
                  : 'bg-teal-50/90 border-teal-200 text-teal-800'
              }`}
            >
              {check.severity === 'error' ? (
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              ) : check.severity === 'warning' ? (
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 font-sans">
                <span className="font-display font-bold text-sm block text-[#0F172A]">{check.title}</span>
                <span className="text-slate-600">{check.message}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Builder Stops List */}
      <div className="space-y-7">
        {trip.trip_stops && trip.trip_stops.length > 0 ? (
          trip.trip_stops.map((stop, index) => {
            const activities = stop.itinerary_items || [];

            return (
              <div
                key={stop.id}
                className="neu-card overflow-hidden transition-all duration-200 shadow-neu-extruded"
              >
                {/* Stop Header Banner */}
                <div className="p-6 sm:p-7 bg-[#DFE4EA]/80 border-b border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary font-mono font-bold text-sm flex items-center justify-center shadow-neu-inset-sm">
                      #{index + 1}
                    </span>

                    <img
                      src={stop.city.image_url}
                      alt={stop.city.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white shadow-md"
                    />

                    <div>
                      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] flex items-center gap-1">
                        <span>{stop.city.name}</span>
                        <span className="text-amber-primary">,</span>
                        <span className="text-slate-500 font-normal text-lg">{stop.city.country}</span>
                      </h3>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">
                        {stop.arrival_date
                          ? `${new Date(stop.arrival_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(stop.departure_date || stop.arrival_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : 'Flexible Stop Dates'}
                      </p>
                    </div>
                  </div>

                  {/* Actions Bar for this Stop */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveStop(index, -1)}
                      className="p-2 rounded-xl text-slate-600 hover:text-[#0F172A] hover:bg-[#CBD5E1] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Move stop earlier"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      disabled={index === (trip.trip_stops?.length || 0) - 1}
                      onClick={() => handleMoveStop(index, 1)}
                      className="p-2 rounded-xl text-slate-600 hover:text-[#0F172A] hover:bg-[#CBD5E1] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Move stop later"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={Plus}
                      onClick={() => setActiveStopForActivity(stop)}
                    >
                      Add Activity
                    </Button>

                    <button
                      type="button"
                      onClick={() => handleDeleteStop(stop.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                      title="Delete Stop"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Scheduled Activities Inside this Stop */}
                <div className="p-6 sm:p-7 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono uppercase font-bold text-slate-500 tracking-wider">
                      Scheduled Daily Activities ({activities.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveStopForActivity(stop)}
                      className="font-display font-bold text-amber-primary hover:underline flex items-center gap-1"
                    >
                      <span>+ Add Activity</span>
                    </button>
                  </div>

                  {activities.length > 0 ? (
                    <div className="space-y-3">
                      {activities.map((item, actIndex) => (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-[#DFE4EA] border border-slate-300 shadow-neu-inset-sm flex items-center justify-between gap-4 transition-all"
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-8 h-8 rounded-xl bg-[#CBD5E1] border border-slate-300 text-slate-700 flex items-center justify-center font-mono text-xs font-bold">
                              D{item.day_number || 1}
                            </span>

                            {item.activity?.image_url && (
                              <img
                                src={item.activity.image_url}
                                alt={item.activity.name}
                                className="w-12 h-12 rounded-xl object-cover border border-white shadow-xs"
                              />
                            )}

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <h4 className="font-display font-bold text-sm text-[#0F172A]">
                                  {item.activity?.name || 'Custom Activity'}
                                </h4>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                                  {item.activity?.category || 'Activity'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 line-clamp-1 font-sans">
                                {item.activity?.description}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                <span>⏱️ {item.start_time || '10:00'}</span>
                                <span>•</span>
                                <span className="font-bold text-[#0F172A]">
                                  ₹{parseFloat(item.custom_cost ?? item.activity?.cost ?? 0).toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteActivity(item.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove activity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl bg-[#DFE4EA] border border-dashed border-slate-300 text-center space-y-2">
                      <p className="text-xs text-slate-500 font-sans">
                        No activities scheduled in {stop.city.name} yet.
                      </p>
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Plus}
                        onClick={() => setActiveStopForActivity(stop)}
                      >
                        Choose Attractions
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="neu-card p-14 text-center max-w-md mx-auto space-y-4 shadow-neu-extruded">
            <div className="w-14 h-14 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#0F172A]">No destinations added</h3>
            <p className="text-xs text-slate-500 font-sans">
              Add your first destination city to start arranging the daily timeline.
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

      {/* Add Stop Modal (z-[100]) */}
      <AddStopModal
        isOpen={addStopOpen}
        onClose={() => setAddStopOpen(false)}
        tripId={id}
        trip={trip}
        onStopAdded={() => fetchTripDetails()}
      />

      {/* Add Activity Modal (z-[100]) */}
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
