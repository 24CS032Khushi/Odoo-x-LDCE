import React, { useState, useEffect } from 'react';
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

  // Add to trip modal state
  const [addToTripModalOpen, setAddToTripModalOpen] = useState(false);
  const [targetCity, setTargetCity] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [createTripModalOpen, setCreateTripModalOpen] = useState(false);
  const [isAddingStop, setIsAddingStop] = useState(false);

  // City details / activities preview modal state
  const [viewActivitiesModal, setViewActivitiesModal] = useState(false);
  const [activeCityDetails, setActiveCityDetails] = useState(null);

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

  const filteredCities = cities.filter((city) => {
    if (selectedRegion !== 'all' && city.region?.toLowerCase() !== selectedRegion.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return city.name.toLowerCase().includes(q) || city.country.toLowerCase().includes(q);
    }
    return true;
  });

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
              placeholder="Search by city or country (e.g. Kyoto, Italy, Dubai)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm bg-white text-abyss border border-slate-300 rounded-full pl-10 pr-4 py-2.5 outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 shadow-sm"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
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
      {filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => {
            const isSaved = savedCityIds.has(city.id);
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
                  imageUrl={city.image_url}
                  title={city.name}
                  subtitle={`${city.country} • ${city.region || 'Global'}`}
                  badge={`${city.cost_index}x Cost Index`}
                  badgeColor="bg-ocean-deep/80 text-white"
                  aspectRatio="aspect-[4/3]"
                >
                  <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                    <span className="flex items-center gap-1 text-amber-300 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-300" />
                      {city.popularity_score} Popularity
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleOpenAddToTrip(city, e)}
                      className="px-3 py-1 rounded-full bg-white text-abyss hover:bg-foam font-bold text-xs shadow-sm transition-transform active:scale-95 flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add to Trip
                    </button>
                  </div>
                </PhotoCard>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white border border-slate-200 rounded-[20px] p-12 text-center max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-abyss">No destinations found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search query or switching the region filter.
          </p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(''); setSelectedRegion('all'); }}>
            Reset Filters
          </Button>
        </div>
      )}

      {/* Add To Trip Modal */}
      <Modal
        isOpen={addToTripModalOpen}
        onClose={() => setAddToTripModalOpen(false)}
        title={`Add ${targetCity?.name} to Trip`}
        description="Select which of your itineraries to include this destination in"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Choose Trip</label>
            <select
              value={selectedTripId}
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full text-sm bg-white text-abyss border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 shadow-sm"
            >
              {myTrips.map((trip) => (
                <option key={trip.id} value={trip.id}>
                  {trip.name} ({trip.trip_stops?.length || 0} stops)
                </option>
              ))}
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button variant="ghost" size="md" onClick={() => setAddToTripModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={handleConfirmAddToTrip} isLoading={isAddingStop}>
              Confirm & Add Stop
            </Button>
          </div>
        </div>
      </Modal>

      {/* City Activities Detail Modal */}
      <Modal
        isOpen={viewActivitiesModal}
        onClose={() => setViewActivitiesModal(false)}
        title={`Attractions in ${activeCityDetails?.name || 'City'}, ${activeCityDetails?.country}`}
        description={`Explore curated activities and experiences (Cost Index: ${activeCityDetails?.cost_index}x)`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {activeCityDetails?.activities?.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-4 p-3.5 rounded-[16px] bg-white border border-slate-200 hover:border-slate-300 transition-all shadow-xs"
            >
              <img
                src={act.image_url}
                alt={act.name}
                className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-sm text-abyss truncate">{act.name}</h4>
                  <span className="text-xs font-bold text-ocean-teal">
                    {parseFloat(act.cost) === 0 ? 'Free' : `₹${act.cost}`}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {act.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                  <span className="capitalize font-semibold text-slate-700">🏷️ {act.category}</span>
                  <span>⏱️ {act.duration_minutes} mins</span>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-3 flex justify-end">
            <Button variant="secondary" size="md" onClick={() => setViewActivitiesModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Trip Trigger Modal */}
      <CreateTripModal
        isOpen={createTripModalOpen}
        onClose={() => setCreateTripModalOpen(false)}
        onTripCreated={(newTrip) => {
          setMyTrips((prev) => [newTrip, ...prev]);
          if (targetCity) {
            setSelectedTripId(newTrip.id.toString());
            setAddToTripModalOpen(true);
          }
        }}
      />
    </div>
  );
};

export default DiscoverPage;
