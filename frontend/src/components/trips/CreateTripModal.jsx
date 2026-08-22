import React, { useState, useEffect, useRef } from 'react';
import { Compass, Calendar, DollarSign, Image as ImageIcon, X, Upload } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import FormInput from '../shared/FormInput';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const DESTINATION_COVER_PRESETS = [
  { name: 'Taj Mahal, Agra', country: 'India', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Kerala Backwaters', country: 'India', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Hawa Mahal, Jaipur', country: 'India', url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Varanasi Ghats', country: 'India', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Goa Coast', country: 'India', url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Pangong Lake, Ladakh', country: 'India', url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Udaipur Lake Palace', country: 'India', url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Manali Snow Peaks', country: 'India', url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Kyoto Temple', country: 'Japan', url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Parisian Lights', country: 'France', url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Santorini Sunset', country: 'Greece', url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80' },
  { name: 'Swiss Alps', country: 'Switzerland', url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80' },
];

export const CreateTripModal = ({ isOpen, onClose, onTripCreated, initialData = null }) => {
  const { success, error: toastError } = useToast();
  const isEditing = !!initialData;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    total_budget: '',
    cover_photo_url: DESTINATION_COVER_PRESETS[0].url,
  });

  // Sync existing trip details on Edit or reset on new trip
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          description: initialData.description || '',
          start_date: initialData.start_date ? initialData.start_date.split('T')[0] : '',
          end_date: initialData.end_date ? initialData.end_date.split('T')[0] : '',
          total_budget: initialData.total_budget ? String(parseFloat(initialData.total_budget)) : '',
          cover_photo_url: initialData.cover_photo_url || DESTINATION_COVER_PRESETS[0].url,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          start_date: '',
          end_date: '',
          total_budget: '',
          cover_photo_url: DESTINATION_COVER_PRESETS[0].url,
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

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

  const handleCustomPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      setFormData((prev) => ({ ...prev, cover_photo_url: base64 }));
      success('Custom destination photo loaded!');
    };
    reader.readAsDataURL(file);
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
      description={isEditing ? 'Update your trip name, dates, budget and destination cover' : 'Set up your destination dates, allocated funds, and cover photography'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          label="Trip Name"
          name="name"
          placeholder="e.g. Royal Rajasthan & Taj Tour"
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
          <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-600">
            Total Budget (INR ₹)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-4 text-amber-primary font-mono font-bold text-sm">₹</span>
            <input
              name="total_budget"
              type="number"
              step="100"
              placeholder="e.g. 150000"
              value={formData.total_budget}
              onChange={handleChange}
              className="w-full text-sm bg-[#CBD5E1] text-[#0F172A] rounded-2xl neu-input pl-10 pr-4 py-3 outline-none focus:border-amber-primary border border-slate-300 font-mono shadow-neu-inset-sm placeholder:text-slate-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-600">
            Trip Description (Optional)
          </label>
          <textarea
            name="description"
            rows="2"
            placeholder="Brief overview or travel goals..."
            value={formData.description}
            onChange={handleChange}
            className="w-full text-sm bg-[#CBD5E1] text-[#0F172A] rounded-2xl neu-input p-3.5 outline-none focus:border-amber-primary border border-slate-300 font-sans shadow-neu-inset-sm resize-none placeholder:text-slate-500"
          />
        </div>

        {/* Destination Cover Photo Selection */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-600">
              Choose Destination Cover Photo
            </label>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleCustomPhotoUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1 text-xs font-display font-extrabold text-amber-primary hover:underline"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Photo</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1 p-2 rounded-2xl bg-[#CBD5E1] border border-slate-300 shadow-neu-inset-sm">
            {DESTINATION_COVER_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, cover_photo_url: preset.url }))}
                className={`relative rounded-2xl overflow-hidden aspect-[16/10] border-2 transition-all group ${
                  formData.cover_photo_url === preset.url
                    ? 'border-amber-primary ring-2 ring-amber-primary/50 shadow-md scale-[1.02]'
                    : 'border-black/10 hover:border-amber-primary/40 opacity-75 hover:opacity-100'
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] font-display font-bold text-white truncate text-left leading-tight drop-shadow-sm">
                    {preset.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-300">
          <Button variant="ghost" size="md" onClick={onClose} type="button">
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
