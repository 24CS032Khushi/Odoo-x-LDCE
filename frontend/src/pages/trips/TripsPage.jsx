import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Calendar,
  Plus,
  MapPin,
  Trash2,
  Edit2,
  ArrowRight,
  Eye,
  Layers,
  Wallet,
  Share2,
  Activity,
  Scale
} from 'lucide-react';
import { PhotoCard } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import CreateTripModal from '../../components/trips/CreateTripModal';
import ShareTripModal from '../../components/trips/ShareTripModal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const TripsPage = () => {
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [sharingTrip, setSharingTrip] = useState(null);

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tripToDelete, setTripToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const formatDateRange = (start, end) => {
    if (!start && !end) return 'Flexible Schedule';
    if (start && !end) return `Starts ${new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    return `${new Date(start).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(end).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
            My Travel Itineraries
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage, schedule, budget, and share all your multi-destination journeys.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/trips/compare">
            <Button
              variant="secondary"
              size="md"
              icon={Scale}
            >
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

      {/* Trips Grid */}
      {trips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => {
            const stopCount = trip.trip_stops?.length || 0;
            const stopCities = trip.trip_stops?.map((s) => s.city.name).join(' → ') || 'No stops added';

            return (
              <div key={trip.id} className="relative group">
                <PhotoCard
                  imageUrl={trip.cover_photo_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'}
                  title={trip.name}
                  subtitle={formatDateRange(trip.start_date, trip.end_date)}
                  badge={`${stopCount} ${stopCount === 1 ? 'Stop' : 'Stops'}`}
                  badgeColor="bg-ocean-deep/80 text-white"
                  aspectRatio="aspect-[4/3]"
                >
                  <div className="space-y-2 pt-1 border-t border-white/10 text-xs text-white">
                    <p className="truncate font-medium text-white/80">
                      📍 {stopCities}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-white">
                      <span className="font-bold">
                        Budget: ₹{parseFloat(trip.total_budget || 0).toLocaleString('en-IN')}
                      </span>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSharingTrip(trip);
                          }}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                          title="Share Trip"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTrip(trip);
                            setCreateModalOpen(true);
                          }}
                          className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
                          title="Edit Trip Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setTripToDelete(trip);
                            setDeleteModalOpen(true);
                          }}
                          className="p-1.5 rounded-full bg-rose-500/30 hover:bg-rose-500 text-white transition-colors"
                          title="Delete Trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Navigation buttons to Builder, Itinerary, and Budget */}
                    <div className="pt-2 grid grid-cols-3 gap-1.5 text-center">
                      <Link
                        to={`/trips/${trip.id}/builder`}
                        className="py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold backdrop-blur-xs transition-colors truncate"
                      >
                        Builder
                      </Link>
                      <Link
                        to={`/budget?trip_id=${trip.id}`}
                        className="py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-[11px] font-semibold backdrop-blur-xs transition-colors truncate"
                      >
                        Budget
                      </Link>
                      <Link
                        to={`/trips/${trip.id}`}
                        className="py-1.5 rounded-full bg-white text-abyss hover:bg-foam text-[11px] font-bold shadow-sm transition-colors truncate"
                      >
                        Schedule
                      </Link>
                    </div>
                  </div>
                </PhotoCard>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State on Foam Surface */
        <div className="bg-white border border-slate-200 rounded-[20px] p-16 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl text-abyss">No trips created yet</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Start planning your next multi-destination adventure by creating your first trip itinerary.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => {
                setEditingTrip(null);
                setCreateModalOpen(true);
              }}
            >
              Plan Your First Trip
            </Button>
          </div>
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
        onTripCreated={(savedTrip) => {
          if (editingTrip) {
            setTrips((prev) => prev.map((t) => (t.id === savedTrip.id ? savedTrip : t)));
          } else {
            setTrips((prev) => [savedTrip, ...prev]);
            navigate(`/trips/${savedTrip.id}/builder`);
          }
        }}
      />

      {/* Share Trip Modal */}
      {sharingTrip && (
        <ShareTripModal
          isOpen={!!sharingTrip}
          onClose={() => setSharingTrip(null)}
          trip={sharingTrip}
          onTripUpdated={(updatedData) => {
            setTrips((prev) =>
              prev.map((t) =>
                t.id === updatedData.trip_id
                  ? { ...t, is_public: updatedData.is_public, share_slug: updatedData.share_slug }
                  : t
              )
            );
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Trip?"
        description={`Are you sure you want to delete "${tripToDelete?.name}"? All stops, expenses, and itinerary schedules within it will be permanently removed.`}
        maxWidth="max-w-md"
      >
        <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={handleDeleteTrip} isLoading={isDeleting}>
            Delete Trip
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TripsPage;
