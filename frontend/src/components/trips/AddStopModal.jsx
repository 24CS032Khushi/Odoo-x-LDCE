import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Search, Check, Plus, Loader2, Sparkles, Globe } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const REGION_FILTERS = ['all', 'India 🇮🇳', 'Asia', 'Europe', 'Americas'];

export const AddStopModal = ({ isOpen, onClose, tripId, trip, onStopAdded }) => {
  const { success, error: toastError } = useToast();

  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCity, setSelectedCity] = useState(null);
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingLive, setIsSearchingLive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchTimerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchCities();
    }
  }, [isOpen]);

  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/cities');
      if (res.success && res.data?.cities) {
        setCities(res.data.cities);
      }
    } catch (err) {
      toastError('Failed to load cities list');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced Live Places Search
  useEffect(() => {
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    const query = searchQuery.trim();
    if (!query) {
      setIsSearchingLive(false);
      return;
    }

    setIsSearchingLive(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const res = await api.get(`/cities?search=${encodeURIComponent(query)}`);
        if (res.success && res.data?.cities) {
          // Merge newly fetched cities into current list without duplicates
          setCities((prev) => {
            const existingIds = new Set(prev.map((c) => c.id));
            const newOnes = res.data.cities.filter((c) => !existingIds.has(c.id));
            return [...res.data.cities, ...prev.filter((c) => !res.data.cities.some((rc) => rc.id === c.id))];
          });
        }
      } catch (err) {
        console.error('Live search stop error:', err);
      } finally {
        setIsSearchingLive(false);
      }
    }, 350);

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Identify Trip Context: If trip already has stops or mentions Indian cities, prioritize them
  const existingCountries = new Set(
    trip?.trip_stops?.map((s) => s.city?.country?.toLowerCase()).filter(Boolean) || []
  );
  const isTripIndian =
    existingCountries.has('india') ||
    trip?.name?.toLowerCase().includes('india') ||
    trip?.name?.toLowerCase().includes('goa') ||
    trip?.name?.toLowerCase().includes('rajasthan') ||
    trip?.name?.toLowerCase().includes('gujarat') ||
    trip?.name?.toLowerCase().includes('kerala') ||
    trip?.name?.toLowerCase().includes('ladakh') ||
    existingCountries.size === 0; // Default to India focus

  // Filter and Sort Cities intelligently
  let displayedCities = cities.filter((c) => {
    // 1. Search Query Filter
    const matchesSearch =
      !searchQuery ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.region && c.region.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 2. Region Filter
    if (selectedRegion === 'India 🇮🇳') {
      return c.country?.toLowerCase() === 'india';
    }
    if (selectedRegion !== 'all') {
      return c.region?.toLowerCase() === selectedRegion.toLowerCase();
    }
    return true;
  });

  // Sort by relatedness to chosen trip / country
  displayedCities.sort((a, b) => {
    const aIsIndia = a.country?.toLowerCase() === 'india';
    const bIsIndia = b.country?.toLowerCase() === 'india';

    if (isTripIndian) {
      if (aIsIndia && !bIsIndia) return -1;
      if (!aIsIndia && bIsIndia) return 1;
    }

    return (b.popularity_score || 0) - (a.popularity_score || 0);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity) {
      toastError('Please select a destination city');
      return;
    }

    if (arrivalDate && departureDate && arrivalDate > departureDate) {
      toastError('Departure date cannot be before arrival date');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`/trips/${tripId}/stops`, {
        city_id: selectedCity.id,
        arrival_date: arrivalDate || null,
        departure_date: departureDate || null,
      });

      success(`Added ${selectedCity.name} to your trip!`);
      if (onStopAdded) onStopAdded(res.data.stop);
      onClose();
      setSelectedCity(null);
      setArrivalDate('');
      setDepartureDate('');
    } catch (err) {
      toastError(err.message || 'Failed to add stop');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Destination Stop"
      description="Choose a destination city and scheduled stay dates"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City Search Bar with Live Places API Indicator */}
        <div className="relative">
          {isSearchingLive ? (
            <Loader2 className="w-4 h-4 text-amber-primary animate-spin absolute left-4 top-3.5" />
          ) : (
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          )}
          <input
            type="text"
            placeholder="Search any destination city (e.g. Ahmedabad, Surat, Jaipur, Goa, Paris)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm bg-[#DFE4EA] text-[#0F172A] rounded-2xl neu-input pl-11 pr-4 py-3 outline-none focus:border-amber-primary border border-slate-300 shadow-neu-inset-sm placeholder:text-slate-400 font-sans"
          />
        </div>

        {/* Region Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {REGION_FILTERS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRegion(r)}
              className={`px-3 py-1 rounded-xl text-xs font-display font-bold whitespace-nowrap transition-all ${
                selectedRegion === r
                  ? 'neu-btn-primary text-white shadow-neu-amber'
                  : 'bg-[#E5EAF0] text-slate-600 hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
              }`}
            >
              {r === 'all' ? 'All Hubs' : r}
            </button>
          ))}
        </div>

        {/* Cities Selection Grid */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
              Select Destination ({displayedCities.length} available)
            </label>
            {isTripIndian && (
              <span className="text-[10px] font-mono font-bold text-amber-primary">
                🇮🇳 Prioritizing India Destinations
              </span>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-2xl p-2.5 bg-[#DFE4EA] shadow-neu-inset-sm">
            {displayedCities.length > 0 ? (
              displayedCities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                const isIndia = city.country?.toLowerCase() === 'india';

                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'neu-btn-primary text-white shadow-neu-amber'
                        : 'bg-[#E5EAF0] text-[#0F172A] hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={city.image_url}
                        alt={city.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 border border-white shadow-xs"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`font-display font-extrabold text-sm leading-tight ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>
                            {city.name}
                          </p>
                          {isIndia && (
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                            }`}>
                              🇮🇳 India
                            </span>
                          )}
                        </div>
                        <p className={`text-xs font-mono mt-0.5 ${isSelected ? 'text-white/90 font-bold' : 'text-slate-500'}`}>
                          {city.country} • Est. Daily: ₹{Math.round(city.cost_index * 2500).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-white stroke-[3] mr-1" />}
                  </button>
                );
              })
            ) : (
              <div className="text-center p-6 space-y-2">
                <p className="text-xs text-slate-500 font-sans">No matching cities found for "{searchQuery}".</p>
                <p className="text-[11px] text-slate-400 font-mono">Type any city worldwide to fetch it live via Places API.</p>
              </div>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <FormInput
            label="Arrival Date"
            name="arrival_date"
            type="date"
            value={arrivalDate}
            onChange={(e) => setArrivalDate(e.target.value)}
            leftIcon={Calendar}
          />
          <FormInput
            label="Departure Date"
            name="departure_date"
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            leftIcon={Calendar}
          />
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={!selectedCity} isLoading={isSubmitting}>
            Add Stop
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddStopModal;
