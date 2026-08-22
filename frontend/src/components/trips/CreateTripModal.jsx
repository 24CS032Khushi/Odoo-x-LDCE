import React, { useState } from 'react';
import { Compass, Calendar, DollarSign, Image as ImageIcon, X } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const COVER_PRESETS = [
  { name: 'Tropical Island', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Kyoto Temple', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Santorini Sunset', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Parisian Lights', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Swiss Alps', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Dubai Skyline', url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80' },
];

export const CreateTripModal = ({ isOpen, onClose, onTripCreated, initialData = null }) => {
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    start_date: initialData?.start_date ? initialData.start_date.split('T')[0] : '',
    end_date: initialData?.end_date ? initialData.end_date.split('T')[0] : '',
    total_budget: initialData?.total_budget || '',
    cover_photo_url: initialData?.cover_photo_url || COVER_PRESETS[0].url,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Trip name is required';
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      errs.end_date = 'End date cannot be before start date';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      let res;
      if (isEditing) {
        res = await api.put(`/trips/${initialData.id}`, formData);
        success('Trip updated successfully!');
      } else {
        res = await api.post('/trips', formData);
        success('Trip created successfully!');
      }

      if (onTripCreated) onTripCreated(res.data.trip);
      onClose();
    } catch (err) {
      toastError(err.message || 'Failed to save trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Trip' : 'Plan a New Journey'}
      description={isEditing ? 'Update your trip details' : 'Set up your destination dates and budget'}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Trip Name"
          name="name"
          placeholder="e.g. Cherry Blossom Tour in Japan"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          leftIcon={Compass}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Start Date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            leftIcon={Calendar}
          />
          <FormInput
            label="End Date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            error={errors.end_date}
            leftIcon={Calendar}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Total Budget (INR ₹)</label>
          <div className="relative flex items-center">
            <span className="absolute left-3.5 text-slate-400 font-semibold text-sm">₹</span>
            <input
              name="total_budget"
              type="number"
              step="100"
              placeholder="e.g. 150000"
              value={formData.total_budget}
              onChange={handleChange}
              className="w-full text-sm bg-white text-abyss border border-slate-300 rounded-xl pl-9 pr-3.5 py-2.5 outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700">Trip Description (Optional)</label>
          <textarea
            name="description"
            rows="2"
            placeholder="Brief overview or travel goals..."
            value={formData.description}
            onChange={handleChange}
            className="w-full text-sm bg-white text-abyss border border-slate-300 rounded-xl p-3 outline-none focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 shadow-sm resize-none"
          />
        </div>

        {/* Cover Photo Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700">Choose Cover Photo</label>
          <div className="grid grid-cols-3 gap-2">
            {COVER_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, cover_photo_url: preset.url }))}
                className={`relative rounded-xl overflow-hidden aspect-[16/10] border-2 transition-all group ${
                  formData.cover_photo_url === preset.url
                    ? 'border-ocean-teal ring-2 ring-ocean-teal/30 scale-98 shadow-md'
                    : 'border-transparent hover:border-slate-300 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-white p-0.5 truncate text-center font-medium">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Journey'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTripModal;
