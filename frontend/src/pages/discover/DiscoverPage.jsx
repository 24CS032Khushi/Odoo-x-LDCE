import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Heart, Plus, Sparkles, Star, DollarSign, Clock, Layers, Flame, ArrowRight, RotateCcw, Loader2, Globe } from 'lucide-react';
import { PhotoCard } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import CreateTripModal from '../../components/trips/CreateTripModal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const REGIONS = ['all', 'India 🇮🇳', 'Asia', 'Europe', 'Middle East', 'Americas'];

export const DiscoverPage = () => {
  const { success, info, error: toastError } = useToast();

  const [allCities, setAllCities] = useState([]);
  const [displayedCities, setDisplayedCities] = useState([]);
  const [savedCityIds, setSavedCityIds] = useState(new Set());
  const [myTrips, setMyTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchingLive, setIsSearchingLive] = useState(false);

  const [addToTripModalOpen, setAddToTripModalOpen] = useState(false);
  const [targetCity, setTargetCity] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [createTripModalOpen, setCreateTripModalOpen] = useState(false);
  const [isAddingStop, setIsAddingStop] = useState(false);

  const [viewActivitiesModal, setViewActivitiesModal] = useState(false);
  const [activeCityDetails, setActiveCityDetails] = useState(null);

  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [citiesRes, savedRes, tripsRes] = await Promise.all([
        api.get('/cities/recommendations').catch(() => api.get('/cities')),
        api.get('/saved-destinations').catch(() => ({ data: { saved: [] } })),
        api.get('/trips').catch(() => ({ data: { trips: [] } }))
      ]);

      let loaded = [];
      if (citiesRes.data?.recommendations) {
        loaded = citiesRes.data.recommendations;
      } else if (citiesRes.data?.cities) {
        loaded = citiesRes.data.cities;
      }

      setAllCities(loaded);
      setDisplayedCities(loaded);

      if (savedRes.data?.saved) {
        setSavedCityIds(new Set(savedRes.data.saved.map((c) => c.id)));
      }
      if (tripsRes.data?.trips) {
        setMyTrips(tripsRes.data.trips);
      }
    } catch (err) {
      toastError('Failed to load destination catalog');
    } finally {
      setIsLoading(false);
    }
  };

  // Live API Search Debounce
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setIsSearchingLive(false);
      applyRegionFilter(allCities, selectedRegion);
      return;
    }

    setIsSearchingLive(true);
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/cities?search=${encodeURIComponent(trimmed)}`);
        if (res.success && res.data?.cities) {
          const results = res.data.cities;
          applyRegionFilter(results, selectedRegion);
        }
      } catch (err) {
        console.error('Live search error:', err);
        const localMatches = allCities.filter((c) =>
          c.name.toLowerCase().includes(trimmed.toLowerCase()) ||
          c.country.toLowerCase().includes(trimmed.toLowerCase())
        );
        applyRegionFilter(localMatches, selectedRegion);
      } finally {
        setIsSearchingLive(false);
      }
    }, 350);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, selectedRegion, allCities]);

  const applyRegionFilter = (dataset, region) => {
    let filtered = dataset;
    if (region === 'India 🇮🇳') {
      filtered = dataset.filter((c) => c.country?.toLowerCase() === 'india');
    } else if (region !== 'all') {
      filtered = dataset.filter((c) => c.region?.toLowerCase() === region.toLowerCase());
    }
    setDisplayedCities(filtered);
  };

  const handleToggleSave = async (city, e) => {
    e?.stopPropagation?.();
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
    e?.stopPropagation?.();
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
      success(`Added ${targetCity.name} to your itinerary!`);
      setAddToTripModalOpen(false);
      setTargetCity(null);
    } catch (err) {
      toastError(err.message || 'Failed to add stop');
    } finally {
      setIsAddingStop(false);
    }
  };

  const handleOpenActivities = (city, e) => {
    e?.stopPropagation?.();
    setActiveCityDetails(city);
    setViewActivitiesModal(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedRegion('all');
    setDisplayedCities(allCities);
    info('Filters reset — showing all destinations');
  };

  return (
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* Header & Search Bar in High-Contrast Tactile Card */}
      <div className="neu-card p-6 sm:p-8 space-y-6 shadow-neu-extruded">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold text-teal-700 bg-teal-50 border border-teal-200 mb-1">
              <Globe className="w-3.5 h-3.5 text-teal-accent" />
              <span>Live Global & India Destination Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
              <span>Discover Destinations</span>
              <span className="text-amber-primary">.</span>
            </h1>
            <p className="text-sm text-slate-600 mt-1 font-sans">
              Search any city worldwide (e.g. Ahmedabad, Surat, Jaipur, London, Tokyo) to discover attractions, real INR costs, and match ratings.
            </p>
          </div>

          {(searchQuery || selectedRegion !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              icon={RotateCcw}
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          )}
        </div>

        {/* Live Search Input & Region Filter Chips */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          <div className="relative max-w-md w-full">
            {isSearchingLive ? (
              <Loader2 className="w-4 h-4 text-amber-primary animate-spin absolute left-4 top-3.5" />
            ) : (
              <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
            )}
            <input
              type="text"
              placeholder="Search any city or place (e.g. Ahmedabad, Surat, Varanasi, Goa, Paris)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-[#CBD5E1] text-[#0F172A] rounded-2xl neu-input pl-11 pr-4 py-3 outline-none focus:border-amber-primary border border-slate-300 shadow-neu-inset-sm placeholder:text-slate-500 font-sans"
            />
          </div>

          {/* Region Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? 'neu-btn-primary text-white shadow-neu-amber'
                    : 'bg-[#E2E8F0] text-slate-700 hover:text-[#0F172A] border border-black/10 shadow-neu-extruded-sm'
                }`}
              >
                {region === 'all' ? `All Places (${displayedCities.length})` : region}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Grid */}
      {displayedCities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {displayedCities.map((city) => {
            const isSaved = savedCityIds.has(city.id);
            const isIndia = city.country?.toLowerCase() === 'india';

            return (
              <PhotoCard
                key={city.id}
                imageUrl={city.image_url}
                title={city.name}
                subtitle={`${city.country} • ${city.region || 'Global'}`}
                badge={isIndia ? '🇮🇳 India' : `★ ${city.popularity_score}`}
                onClick={(e) => handleOpenActivities(city, e)}
              >
                <div className="space-y-4">
                  {/* Meta Specs */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-[#DFE4EA] border border-slate-300 shadow-neu-inset-sm text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Est. Cost/Day</span>
                      <span className="font-mono font-bold text-amber-primary">
                        ₹{Math.round(city.cost_index * 2500).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">Popularity</span>
                      <span className="font-bold text-[#0F172A] flex items-center gap-1 font-sans">
                        <Star className="w-3 h-3 text-amber-primary fill-amber-primary" />
                        {city.popularity_score}/100
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-300/80 gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(city, e)}
                      className={`p-2 rounded-xl transition-all ${
                        isSaved
                          ? 'text-rose-500 bg-rose-50 border border-rose-200'
                          : 'text-slate-500 hover:text-[#0F172A] hover:bg-[#CBD5E1]'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save to Favorites'}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenActivities(city, e)}
                        className="px-3 py-1.5 rounded-xl text-xs font-display font-bold text-slate-700 bg-[#E2E8F0] hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm transition-all"
                      >
                        Activities
                      </button>

                      <Button
                        variant="primary"
                        size="sm"
                        icon={Plus}
                        onClick={(e) => handleOpenAddToTrip(city, e)}
                      >
                        Add to Trip
                      </Button>
                    </div>
                  </div>
                </div>
              </PhotoCard>
            );
          })}
        </div>
      ) : (
        <div className="neu-card p-14 text-center max-w-md mx-auto space-y-4 shadow-neu-extruded">
          <div className="w-14 h-14 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0F172A]">No destinations found</h3>
          <p className="text-xs text-slate-500">
            No matching destinations found for "{searchQuery}". Try searching for any major city or reset your filters.
          </p>
          <Button
            variant="outline"
            size="md"
            icon={RotateCcw}
            onClick={handleResetFilters}
          >
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Add To Trip Stop Modal */}
      <Modal
        isOpen={addToTripModalOpen}
        onClose={() => setAddToTripModalOpen(false)}
        title={`Add ${targetCity?.name} to Itinerary`}
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-sans">
            Select which travel itinerary you would like to append <strong className="text-[#0F172A]">{targetCity?.name}, {targetCity?.country}</strong> to:
          </p>

          <div className="space-y-2">
            <label className="text-xs font-mono uppercase text-slate-500 font-bold block">
              Destination Itinerary
            </label>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#CBD5E1] text-[#0F172A] neu-input border border-slate-300 shadow-neu-inset-sm outline-none focus:border-amber-primary text-sm font-sans"
            >
              {myTrips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name} ({trip.trip_stops?.length || 0} stops)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-300">
            <Button
              variant="outline"
              size="md"
              onClick={() => setAddToTripModalOpen(false)}
              disabled={isAddingStop}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={handleConfirmAddToTrip}
              isLoading={isAddingStop}
            >
              Confirm & Add Stop
            </Button>
          </div>
        </div>
      </Modal>

      {/* City Activities Overview Modal */}
      <Modal
        isOpen={viewActivitiesModal}
        onClose={() => {
          setViewActivitiesModal(false);
          setActiveCityDetails(null);
        }}
        title={`Explore ${activeCityDetails?.name || 'Destination'}`}
        size="lg"
      >
        {activeCityDetails && (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/8]">
              <img
                src={activeCityDetails.image_url}
                alt={activeCityDetails.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-5">
                <div className="text-white space-y-1">
                  <span className="text-xs font-mono font-bold text-amber-primary uppercase tracking-wider">
                    {activeCityDetails.country} • {activeCityDetails.region || 'Global'}
                  </span>
                  <h3 className="text-2xl font-display font-black">{activeCityDetails.name}</h3>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Curated Highlights & Activities ({activeCityDetails.activities?.length || 0})
              </h4>

              {activeCityDetails.activities && activeCityDetails.activities.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                  {activeCityDetails.activities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-2xl bg-[#DFE4EA] border border-slate-300 shadow-neu-inset-sm space-y-1.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-display font-bold text-sm text-[#0F172A]">{act.name}</h5>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 shrink-0">
                          {act.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 font-sans">{act.description}</p>
                      <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500 font-mono">
                        <span>⏱️ {act.duration_mins}m</span>
                        <span className="font-bold text-amber-primary">₹{parseFloat(act.cost || 0).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No activity highlights configured yet.</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-300">
              <Button
                variant="outline"
                size="md"
                onClick={() => setViewActivitiesModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="md"
                icon={Plus}
                onClick={() => {
                  setViewActivitiesModal(false);
                  handleOpenAddToTrip(activeCityDetails);
                }}
              >
                Add Destination to Trip
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Trip Modal (if user has 0 trips and wants to add) */}
      <CreateTripModal
        isOpen={createTripModalOpen}
        onClose={() => setCreateTripModalOpen(false)}
        onTripCreated={(newTrip) => {
          setMyTrips((prev) => [newTrip, ...prev]);
          if (targetCity) {
            api.post(`/trips/${newTrip.id}/stops`, { city_id: targetCity.id })
              .then(() => success(`Added ${targetCity.name} to "${newTrip.name}"!`));
          }
        }}
      />
    </div>
  );
};

export default DiscoverPage;
