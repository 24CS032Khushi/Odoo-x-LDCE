import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Heart, Plus, Sparkles, Star, DollarSign, Clock, Layers } from 'lucide-react';
import { PhotoCard } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import CreateTripModal from '../../components/trips/CreateTripModal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const REGIONS = ['all', 'Asia', 'Europe', 'Middle East', 'Americas'];

export const DiscoverPage = () => {
  const { success, info, error: toastError } = useToast();

  const [cities, setCities] = useState([]);
  const [savedCityIds, setSavedCityIds] = useState(new Set());
  const [myTrips, setMyTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Add to trip modal state
  const [addToTripModalOpen, setAddToTripModalOpen] = useState(false);
  const [targetCity, setTargetCity] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [createTripModalOpen, setCreateTripModalOpen] = useState(false);
  const [isAddingStop, setIsAddingStop] = useState(false);

  // City details / activities preview modal state
  const [viewActivitiesModal, setViewActivitiesModal] = useState(false);
  const [activeCityDetails, setActiveCityDetails] = useState(null);

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [citiesRes, savedRes, tripsRes] = await Promise.all([
        api.get('/cities'),
        api.get('/saved-destinations').catch(() => ({ data: { saved: [] } })),
        api.get('/trips').catch(() => ({ data: { trips: [] } }))
      ]);

      if (citiesRes.success) {
        setCities(citiesRes.data.cities);
      }
      if (savedRes.data?.saved) {
        setSavedCityIds(new Set(savedRes.data.saved.map((c) => c.id)));
      }
      if (tripsRes.data?.trips) {
        setMyTrips(tripsRes.data.trips);
      }
    } catch (err) {
      toastError('Failed to load destination data');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger backend hybrid search when search query or region changes
  const performSearch = async (query, region) => {
    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      if (query && query.trim()) params.set('search', query.trim());
      if (region && region !== 'all') params.set('region', region);

      const res = await api.get(`/cities?${params.toString()}`);
      if (res.success) {
        setCities(res.data.cities);
      }
    } catch (err) {
      // Fallback silently without breaking UI
      console.warn('Live search fallback:', err.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      performSearch(val, selectedRegion);
    }, 350);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    performSearch(searchQuery, region);
  };

  const handleToggleSave = async (city, e) => {
    e.stopPropagation();
    const isSaved = savedCityIds.has(city.id);

    try {
      if (isSaved) {
        await api.delete(`/saved-destinations/${city.id}`);
        setSavedCityIds((prev) => {
          const next = new Set(prev);
          next.delete(city.id);
          return next;
        });
        info(`Removed ${city.name} from saved destinations`);
      } else {
        await api.post('/saved-destinations', { city_id: city.id });
        setSavedCityIds((prev) => new Set([...prev, city.id]));
        success(`Saved ${city.name} to your favorites!`);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update saved destinations');
    }
  };

  const handleOpenAddToTrip = (city, e) => {
    e.stopPropagation();
    setTargetCity(city);
    if (myTrips.length === 0) {
      setCreateTripModalOpen(true);
    } else {
      setSelectedTripId(myTrips[0].id.toString());
      setAddToTripModalOpen(true);
    }
  };

  const handleConfirmAddToTrip = async () => {
    if (!selectedTripId || !targetCity) return;

    setIsAddingStop(true);
    try {
      await api.post(`/trips/${selectedTripId}/stops`, {
        city_id: targetCity.id
      });
      success(`Added ${targetCity.name} as a stop to your trip!`);
      setAddToTripModalOpen(false);
    } catch (err) {
      toastError(err.message || 'Failed to add stop to trip');
    } finally {
      setIsAddingStop(false);
    }
  };

  const handleViewCityActivities = async (city) => {
    try {
      const res = await api.get(`/cities/${city.id}`);
      if (res.success) {
        setActiveCityDetails(res.data.city);
        setViewActivitiesModal(true);
      }
    } catch (err) {
      toastError('Failed to load city activities');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
            Discover Global Destinations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore world-class cities, curated local activities, and cost ratings to build your dream itinerary.
          </p>
        </div>

        {/* Search Input & Region Filter Chips */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative max-w-md w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by city or country (e.g. Kyoto, Mumbai, Paris)..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full text-sm bg-white text-abyss border border-slate-300 rounded-full pl-10 pr-4 py-2.5 outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 shadow-sm"
            />
            {isSearching && (
              <span className="absolute right-3.5 top-3 text-[10px] font-semibold text-ocean-teal animate-pulse">
                Searching...
              </span>
            )}
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => handleRegionSelect(region)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'bg-abyss text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                {region === 'all' ? 'All Regions' : region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cities Grid */}
      {cities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => {
            const isSaved = savedCityIds.has(city.id);
            const isPendingCost = city.popularity_score === 0 || city.cost_index === null || parseFloat(city.cost_index) === 0;

            const badgeText = isPendingCost ? 'Cost data pending' : `${parseFloat(city.cost_index).toFixed(1)}x Cost Index`;
            const badgeColor = isPendingCost ? 'bg-slate-800/80 text-amber-300' : 'bg-ocean-deep/80 text-white';

            return (
              <div key={city.id} className="relative group cursor-pointer" onClick={() => handleViewCityActivities(city)}>
                {/* Heart Save Button Overlay */}
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(city, e)}
                  className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                    isSaved
                      ? 'bg-rose-500 text-white'
                      : 'bg-black/30 text-white hover:bg-black/60 border border-white/20'
                  }`}
                  aria-label={isSaved ? 'Unsave destination' : 'Save destination'}
                >
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                </button>

                <PhotoCard
                  imageUrl={city.image_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'}
                  title={city.name}
                  subtitle={`${city.country} • ${city.region || 'Global'}`}
                  badge={badgeText}
                  badgeColor={badgeColor}
                  aspectRatio="aspect-[4/3]"
                >
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      {parseFloat(city.popularity_score || 5.0).toFixed(1)} Popularity
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleOpenAddToTrip(city, e)}
                      className="px-3 py-1 rounded-full bg-white text-abyss hover:bg-foam font-bold text-xs shadow-sm transition-transform active:scale-95 flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      Add to Trip
                    </button>
                  </div>
                </PhotoCard>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State on Foam Surface */
        <div className="bg-white border border-slate-200 rounded-[20px] p-16 text-center max-w-md mx-auto space-y-3 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-lg text-abyss">No destinations found</h3>
          <p className="text-xs text-slate-500">
            We couldn't find any cities matching "{searchQuery}". Try searching for another city name or country.
          </p>
        </div>
      )}

      {/* Add To Trip Stop Selector Modal */}
      <Modal
        isOpen={addToTripModalOpen}
        onClose={() => setAddToTripModalOpen(false)}
        title={`Add ${targetCity?.name} to Trip`}
        description="Choose which of your planned itineraries to include this destination in."
        maxWidth="max-w-md"
      >
        <div className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Itinerary</label>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full text-sm bg-white text-abyss border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20"
            >
              {myTrips.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.trip_stops?.length || 0} stops)
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" size="md" onClick={() => setAddToTripModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleConfirmAddToTrip} isLoading={isAddingStop}>
              Confirm Destination
            </Button>
          </div>
        </div>
      </Modal>

      {/* City Activities Detail Modal */}
      <Modal
        isOpen={viewActivitiesModal}
        onClose={() => setViewActivitiesModal(false)}
        title={activeCityDetails?.name || 'City Details'}
        description={`${activeCityDetails?.country} • ${activeCityDetails?.region || 'Global'}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 pt-1">
          {activeCityDetails?.activities && activeCityDetails.activities.length > 0 ? (
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {activeCityDetails.activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors"
                >
                  <img
                    src={act.image_url || activeCityDetails.image_url}
                    alt={act.name}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-sm text-abyss font-display">{act.name}</h5>
                      <span className="font-bold text-xs text-ocean-teal">
                        {parseFloat(act.cost) === 0 ? 'Free' : `₹${parseFloat(act.cost).toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2">{act.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="capitalize">🏷️ {act.category}</span>
                      <span>⏱️ {act.duration_minutes} mins</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No curated activities listed for this destination yet.
            </div>
          )}

          <div className="pt-3 flex items-center justify-between border-t border-slate-100">
            <Button variant="ghost" size="md" onClick={() => setViewActivitiesModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => {
                setViewActivitiesModal(false);
                handleOpenAddToTrip(activeCityDetails, { stopPropagation: () => {} });
              }}
            >
              Add {activeCityDetails?.name} to Trip
            </Button>
          </div>
        </div>
      </Modal>

      {/* Plan New Trip Modal if no trips exist */}
      <CreateTripModal
        isOpen={createTripModalOpen}
        onClose={() => setCreateTripModalOpen(false)}
        onTripCreated={(newTrip) => {
          setMyTrips((prev) => [newTrip, ...prev]);
          if (targetCity) {
            api.post(`/trips/${newTrip.id}/stops`, { city_id: targetCity.id })
              .then(() => success(`Trip created and ${targetCity.name} added as your first stop!`));
          }
        }}
      />
    </div>
  );
};

export default DiscoverPage;
