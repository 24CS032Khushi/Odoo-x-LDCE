import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, Calendar, Plus, MapPin, Trash2, Edit2, ArrowRight, Eye, Layers, Share2, HeartPulse, Check, Scale } from 'lucide-react';
import { PhotoCard } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import CreateTripModal from '../../components/trips/CreateTripModal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const TripsPage = () => {
  const { success, info, error: toastError } = useToast();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [sharedTrip, setSharedTrip] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/trips');
      if (res.success) {
        setTrips(res.data.trips);
      }
    } catch (err) {
      toastError('Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTrip = async () => {
    if (!tripToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/trips/${tripToDelete.id}`);
      setTrips((prev) => prev.filter((t) => t.id !== tripToDelete.id));
      success(`Deleted "${tripToDelete.name}"`);
      setDeleteModalOpen(false);
      setTripToDelete(null);
    } catch (err) {
      toastError(err.message || 'Failed to delete trip');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenShare = (trip, e) => {
    e?.stopPropagation?.();
    setSharedTrip(trip);
    setCopied(false);
    setShareModalOpen(true);
  };

  const copyShareLink = () => {
    if (!sharedTrip) return;
    const url = `${window.location.origin}/share/${sharedTrip.share_slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    success('Public share link copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  const formatDateRange = (start, end) => {
    if (!start && !end) return 'Flexible dates';
    if (start && !end) return `Starts ${new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    return `${new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* Page Header in High-Contrast Tactile Card */}
      <div className="neu-card p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-neu-extruded">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
            <span>My Travel Itineraries</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-sans">
            Manage, schedule, budget, and share all your multi-destination journeys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/trips/compare">
            <Button variant="secondary" size="md" icon={Scale}>
              Compare Drafts
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingTrip(null);
              setCreateModalOpen(true);
            }}
          >
            Plan New Trip
          </Button>
        </div>
      </div>

      {/* Trips Grid with Photographic Cards */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {trips.map((trip) => {
            const stopCount = trip.trip_stops?.length || 0;
            const stopCities = trip.trip_stops?.map((s) => s.city.name).join(' → ') || 'No destination stops yet';

            return (
              <PhotoCard
                key={trip.id}
                imageUrl={trip.cover_image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
                title={trip.name}
                subtitle={formatDateRange(trip.start_date, trip.end_date)}
                badge={trip.status.toUpperCase()}
                onClick={() => navigate(`/trips/${trip.id}`)}
              >
                <div className="space-y-4">
                  {/* Route Breadcrumb */}
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <MapPin className="w-3.5 h-3.5 text-amber-primary shrink-0" />
                    <span className="truncate font-sans font-medium">{stopCities}</span>
                  </div>

                  {/* Quick Metric Bar */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#DFE4EA] border border-slate-300 shadow-neu-inset-sm text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Stops</span>
                      <span className="font-bold text-[#0F172A] font-sans">{stopCount} cities</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Budget</span>
                      <span className="font-mono font-bold text-amber-primary">
                        ₹{parseFloat(trip.total_budget || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-300/80 gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTrip(trip);
                          setCreateModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-slate-600 hover:text-[#0F172A] hover:bg-[#CBD5E1] transition-colors"
                        title="Edit Trip Settings"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleOpenShare(trip, e)}
                        className="p-2 rounded-xl text-slate-600 hover:text-teal-accent hover:bg-[#CBD5E1] transition-colors"
                        title="Share Public Link"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setTripToDelete(trip);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Trip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/trips/${trip.id}`)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-display font-extrabold text-amber-primary hover:text-white hover:bg-amber-primary transition-all flex items-center gap-1 shadow-neu-extruded-sm"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </PhotoCard>
            );
          })}
        </div>
      ) : (
        <div className="neu-card p-14 text-center max-w-md mx-auto space-y-4 shadow-neu-extruded">
          <div className="w-14 h-14 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0F172A]">No Trips Planned Yet</h3>
          <p className="text-xs text-slate-500">
            Start creating your first multi-city trip with intelligent scheduling, budget optimization, and health scores.
          </p>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => {
              setEditingTrip(null);
              setCreateModalOpen(true);
            }}
          >
            Create First Journey
          </Button>
        </div>
      )}

      {/* Create / Edit Trip Modal */}
      <CreateTripModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingTrip(null);
        }}
        initialData={editingTrip}
        onTripCreated={(newTrip) => {
          if (editingTrip) {
            setTrips((prev) => prev.map((t) => (t.id === newTrip.id ? newTrip : t)));
            success(`Updated "${newTrip.name}"`);
          } else {
            setTrips((prev) => [newTrip, ...prev]);
            navigate(`/trips/${newTrip.id}`);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Travel Itinerary"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-sans">
            Are you sure you want to delete <strong className="text-[#0F172A]">"{tripToDelete?.name}"</strong>? This will remove all associated stops, scheduled activities, and logged expenses.
          </p>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300">
            <Button
              variant="outline"
              size="md"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleDeleteTrip}
              isLoading={isDeleting}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Public Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share Itinerary"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-sans">
            Anyone with this link can view the read-only itinerary schedule and route without needing an account.
          </p>
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-[#DFE4EA] border border-slate-300 shadow-neu-inset-sm">
            <input
              type="text"
              readOnly
              value={sharedTrip ? `${window.location.origin}/share/${sharedTrip.share_slug}` : ''}
              className="bg-transparent text-xs font-mono text-[#0F172A] w-full outline-none"
            />
            <button
              type="button"
              onClick={copyShareLink}
              className="px-3 py-1.5 rounded-xl bg-amber-primary text-white text-xs font-display font-bold whitespace-nowrap shadow-neu-amber hover:bg-amber-600 transition-all flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TripsPage;
