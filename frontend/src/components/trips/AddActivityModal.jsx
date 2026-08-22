import React, { useState, useEffect } from 'react';
import { Clock, Tag, DollarSign, Search, Check, Sparkles } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const AddActivityModal = ({ isOpen, onClose, tripId, stop, onActivityAdded }) => {
  const { success, error: toastError } = useToast();

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dayNumber, setDayNumber] = useState(1);
  const [startTime, setStartTime] = useState('10:00');
  const [customCost, setCustomCost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && stop?.city_id) {
      fetchActivities();
    }
  }, [isOpen, stop?.city_id]);

  const fetchActivities = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/activities?city_id=${stop.city_id}`);
      if (res.success) {
        setActivities(res.data.activities);
      }
    } catch (err) {
      toastError('Failed to load city activities');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredActivities = activities.filter((act) => {
    if (categoryFilter !== 'all' && act.category !== categoryFilter) return false;
    return true;
  });

  const handleSelect = (act) => {
    setSelectedActivity(act);
    setCustomCost(act.cost ? act.cost.toString() : '0');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedActivity) {
      toastError('Please choose an activity');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post(`/trips/${tripId}/itinerary-items`, {
        trip_stop_id: stop.id,
        activity_id: selectedActivity.id,
        day_number: parseInt(dayNumber, 10) || 1,
        start_time: startTime || '10:00',
        custom_cost: customCost ? parseFloat(customCost) : null
      });

      success(`Added "${selectedActivity.name}" to Day ${dayNumber}!`);
      if (onActivityAdded) onActivityAdded(res.data.item);
      onClose();
      setSelectedActivity(null);
    } catch (err) {
      toastError(err.message || 'Failed to add activity');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Activity in ${stop?.city?.name || 'Destination'}`}
      description="Choose curated attractions and schedule their time slot"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Pills Filter */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          {['all', 'sightseeing', 'culture', 'food', 'adventure', 'relaxation', 'nightlife'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold capitalize transition-all ${
                categoryFilter === cat
                  ? 'neu-btn-primary text-white shadow-neu-amber'
                  : 'bg-[#E5EAF0] text-slate-600 hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Activity Selection List */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
            Available Attractions
          </label>
          <div className="max-h-52 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-2xl p-2.5 bg-[#DFE4EA] shadow-neu-inset-sm">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((act) => {
                const isSelected = selectedActivity?.id === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => handleSelect(act)}
                    className={`w-full flex items-start gap-3 p-3 rounded-2xl text-left transition-all ${
                      isSelected
                        ? 'neu-btn-primary text-white shadow-neu-amber'
                        : 'bg-[#E5EAF0] text-[#0F172A] hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
                    }`}
                  >
                    <img
                      src={act.image_url}
                      alt={act.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border border-white shadow-xs"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`font-display font-extrabold text-sm leading-tight truncate ${isSelected ? 'text-white' : 'text-[#0F172A]'}`}>
                          {act.name}
                        </p>
                        <span className={`text-xs font-mono font-bold ${isSelected ? 'text-white font-black' : 'text-amber-primary'}`}>
                          {parseFloat(act.cost) === 0 ? 'Free' : `₹${act.cost}`}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${isSelected ? 'text-white/90 font-medium' : 'text-slate-600'}`}>
                        {act.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-mono">
                        <span className={`capitalize font-bold ${isSelected ? 'text-white' : 'text-teal-accent'}`}>
                          🏷️ {act.category}
                        </span>
                        <span className={isSelected ? 'text-white/80' : 'text-slate-500'}>
                          ⏱️ {act.duration_minutes} min
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-slate-500 p-4 text-center">No activities match this category filter.</p>
            )}
          </div>
        </div>

        {/* Schedule Inputs: Day, Time & Custom Cost */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <FormInput
            label="Day Number"
            name="day_number"
            type="number"
            min="1"
            max="30"
            value={dayNumber}
            onChange={(e) => setDayNumber(e.target.value)}
            required
          />

          <FormInput
            label="Start Time"
            name="start_time"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            leftIcon={Clock}
            required
          />

          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
              Cost in INR (₹)
            </label>
            <input
              name="custom_cost"
              type="number"
              placeholder="Cost in ₹"
              value={customCost}
              onChange={(e) => setCustomCost(e.target.value)}
              className="w-full text-sm bg-[#DFE4EA] text-[#0F172A] rounded-2xl neu-input px-4 py-3 outline-none focus:border-amber-primary border border-slate-300 font-mono shadow-neu-inset-sm placeholder:text-slate-400"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" disabled={!selectedActivity} isLoading={isSubmitting}>
            Add to Schedule
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddActivityModal;
