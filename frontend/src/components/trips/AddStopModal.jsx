import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, Check, Plus } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AddStopModal = ({ isOpen, onClose, tripId, onStopAdded }) => {
  const { success, error: toastError } = useToast();

  const [cities, setCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState(null);
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCities();
    }
  }, [isOpen]);

  const fetchCities = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/cities');
      if (res.success) {
        setCities(res.data.cities);
      }
    } catch (err) {
      toastError('Failed to load cities list');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCities = cities.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      // Reset
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
      description="Choose a city and scheduled stay dates"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* City Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search city or country (e.g. Kyoto, Paris, Goa)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm bg-white text-abyss border border-slate-300 rounded-xl pl-10 pr-3.5 py-2.5 outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 shadow-sm"
          />
        </div>

        {/* Cities Selection Grid */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Select City</label>
          <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 border border-slate-200 rounded-xl p-2 bg-slate-50/50">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => {
                const isSelected = selectedCity?.id === city.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => setSelectedCity(city)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-ocean-teal text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={city.image_url}
                        alt={city.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div>
                        <p className={`font-semibold text-sm leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {city.name}
                        </p>
                        <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                          {city.country} • Cost Index: {city.cost_index}x
                        </p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-white mr-1" />}
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 p-4 text-center">No matching destinations found.</p>
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

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
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
