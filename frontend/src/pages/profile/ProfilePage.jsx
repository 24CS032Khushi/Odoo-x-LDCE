import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Save,
  Trash2,
  Heart,
  AlertTriangle,
  Flame,
  Check,
  Upload,
  Camera,
  Calendar,
  Compass,
  Wallet,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card, { PhotoCard } from '../../components/shared/Card';
import FormInput from '../../components/shared/FormInput';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import api from '../../services/api';

const AVAILABLE_INTERESTS = [
  { id: 'culture', label: '🏛️ Culture & Heritage' },
  { id: 'food', label: '🍜 Gastronomy & Food' },
  { id: 'adventure', label: '🧗 Adventure & Trekking' },
  { id: 'relaxation', label: '🏖️ Beaches & Relaxation' },
  { id: 'sightseeing', label: '📸 Iconic Sightseeing' },
  { id: 'nightlife', label: '🍸 Nightlife & Clubs' },
  { id: 'nature', label: '🌲 Nature & Wildlife' },
  { id: 'budget', label: '💰 Budget Conscious' }
];

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, info, error: toastError } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    photo_url: user?.photo_url || '',
  });

  const [userInterests, setUserInterests] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  const [savedDestinations, setSavedDestinations] = useState([]);
  const [userTrips, setUserTrips] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        photo_url: user.photo_url || '',
      });

      const initialInterests = user.interests
        ? user.interests.split(',').map((i) => i.trim()).filter(Boolean)
        : ['culture', 'food', 'sightseeing'];
      setUserInterests(initialInterests);
    }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [savedRes, tripsRes] = await Promise.all([
        api.get('/saved-destinations').catch(() => ({ data: { saved: [] } })),
        api.get('/trips').catch(() => ({ data: { trips: [] } }))
      ]);

      if (savedRes.data?.saved) {
        setSavedDestinations(savedRes.data.saved);
      }
      if (tripsRes.data?.trips) {
        setUserTrips(tripsRes.data.trips);
      }
    } catch (err) {
      console.error('Failed to fetch profile stats', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const toggleInterest = (interestId) => {
    setUserInterests((prev) => {
      const exists = prev.includes(interestId);
      const next = exists ? prev.filter((i) => i !== interestId) : [...prev, interestId];
      setHasChanged(true);
      return next;
    });
  };

  const handleRemoveSaved = async (cityId, e) => {
    e?.stopPropagation?.();
    try {
      await api.delete(`/saved-destinations/${cityId}`);
      setSavedDestinations((prev) => prev.filter((c) => c.id !== cityId));
      info('Destination removed from saved list');
    } catch (err) {
      toastError('Failed to remove destination');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setHasChanged(true);
      return updated;
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toastError('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toastError('Image size should be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Data = event.target?.result;
      setFormData((prev) => ({ ...prev, photo_url: base64Data }));
      setHasChanged(true);
      success('Photo loaded! Tap "Save Changes" to apply.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo_url: '' }));
    setHasChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toastError('Name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: formData.name.trim(),
        photo_url: formData.photo_url || null,
        interests: userInterests
      });
      success('Profile and preferences updated!');
      setHasChanged(false);
    } catch (err) {
      toastError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await api.delete('/users/me');
      logout();
      success('Account successfully deleted');
      navigate('/login');
    } catch (err) {
      toastError(err.message || 'Failed to delete account');
      setIsDeletingAccount(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'GT';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const totalPlannedBudget = userTrips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);

  return (
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* 1. Header Traveler Hero Banner */}
      <div className="neu-card p-6 sm:p-8 relative overflow-hidden shadow-neu-extruded border border-black/10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          {/* Avatar & Identity Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#CBD5E1] border-2 border-amber-primary text-amber-primary font-display font-black text-3xl flex items-center justify-center overflow-hidden shadow-md">
                {formData.photo_url ? (
                  <img
                    src={formData.photo_url}
                    alt={formData.name || 'User Avatar'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{getInitials(formData.name || user?.name)}</span>
                )}
              </div>

              {/* Quick camera upload overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-2 rounded-2xl bg-amber-primary text-white shadow-md hover:bg-amber-600 transition-all border border-white"
                title="Change Avatar Photo"
              >
                <Camera className="w-4 h-4" />
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                  {formData.name || 'Explorer'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-mono font-bold">
                  Verified Traveler
                </span>
              </div>

              <p className="text-xs text-slate-600 font-mono">
                {user?.email || 'traveler@globetrotter.com'}
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-slate-500 font-mono">
                <span>Joined GlobeTrotter 2026</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-bold text-amber-primary hover:underline"
                >
                  Browse New Photo
                </button>
                {formData.photo_url && (
                  <>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Telemetry Badges on the right */}
          <div className="grid grid-cols-3 gap-2.5 w-full sm:w-auto">
            <div className="p-3.5 rounded-2xl bg-[#CBD5E1] border border-black/5 text-center min-w-[85px] shadow-neu-inset-sm">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600 block">Trips</span>
              <span className="font-display font-black text-lg text-[#0F172A]">{userTrips.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#CBD5E1] border border-black/5 text-center min-w-[85px] shadow-neu-inset-sm">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600 block">Saved</span>
              <span className="font-display font-black text-lg text-amber-primary">{savedDestinations.length}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#CBD5E1] border border-black/5 text-center min-w-[85px] shadow-neu-inset-sm">
              <span className="text-[10px] font-mono font-bold uppercase text-slate-600 block">Interests</span>
              <span className="font-display font-black text-lg text-teal-accent">{userInterests.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Personal Details Form */}
      <form onSubmit={handleSubmit} className="neu-card p-6 sm:p-8 space-y-6 shadow-neu-extruded">
        <div className="flex items-center justify-between pb-3 border-b border-slate-300/80">
          <div>
            <h3 className="font-display font-extrabold text-xl text-[#0F172A] flex items-center gap-1">
              <span>Personal Details</span>
              <span className="text-amber-primary">.</span>
            </h3>
            <p className="text-xs text-slate-500">
              Update your explorer name and account settings.
            </p>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={!hasChanged}
            isLoading={isSubmitting}
            icon={Save}
          >
            Save All Changes
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormInput
            label="Explorer Full Name"
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            leftIcon={User}
            required
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            value={user?.email || ''}
            disabled
            leftIcon={Mail}
            helperText="Primary email tied to your account."
          />
        </div>
      </form>

      {/* 3. Travel Passion & Interest Selection Matrix */}
      <div className="neu-card p-6 sm:p-8 space-y-4 shadow-neu-extruded">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#CBD5E1] border border-slate-300 text-amber-primary flex items-center justify-center shadow-neu-inset-sm">
            <Flame className="w-4 h-4 text-amber-primary" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-xl text-[#0F172A] flex items-center gap-1">
              <span>My Travel Passions & Interests</span>
              <span className="text-amber-primary">.</span>
            </h3>
            <p className="text-xs text-slate-500">
              Select what you love most. The AI recommendation engine customizes destination suggestions based on these.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {AVAILABLE_INTERESTS.map((item) => {
            const isSelected = userInterests.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleInterest(item.id)}
                className={`p-3.5 rounded-2xl text-left font-display font-extrabold text-xs sm:text-sm transition-all duration-150 flex items-center justify-between border ${
                  isSelected
                    ? 'neu-btn-primary border-slate-300 shadow-neu-amber scale-[1.02] text-white'
                    : 'bg-[#CBD5E1] text-slate-700 hover:text-[#0F172A] border-slate-300 hover:border-amber-primary/40 shadow-neu-inset-sm'
                }`}
              >
                <span>{item.label}</span>
                {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Saved Destinations Photo Gallery */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-2xl text-[#0F172A] flex items-center gap-1">
              <span>Saved Places</span>
              <span className="text-amber-primary">.</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Destinations you bookmarked from Discover for future journeys
            </p>
          </div>

          <Button variant="secondary" size="sm" onClick={() => navigate('/discover')}>
            Explore Catalog
          </Button>
        </div>

        {savedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((city) => (
              <div key={city.id} className="relative group">
                <button
                  type="button"
                  onClick={(e) => handleRemoveSaved(city.id, e)}
                  className="absolute top-4 right-4 z-30 w-9 h-9 rounded-2xl bg-white/90 text-rose-600 hover:text-white hover:bg-rose-500 flex items-center justify-center transition-all shadow-md border border-white"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <PhotoCard
                  imageUrl={city.image_url}
                  title={city.name}
                  subtitle={`${city.country} • ${city.cost_index}x Cost Index`}
                  badge={`★ ${city.popularity_score}`}
                  actionLabel="Plan Stop"
                  onAction={() => navigate('/discover')}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="neu-card p-10 text-center max-w-md mx-auto space-y-3 shadow-neu-extruded">
            <Heart className="w-10 h-10 text-slate-400 mx-auto" />
            <h4 className="font-display font-bold text-base text-[#0F172A]">No saved destinations yet</h4>
            <p className="text-xs text-slate-500">
              Browse the Discover catalog and tap the heart icon to save favorite travel destinations.
            </p>
          </div>
        )}
      </div>

      {/* 5. Danger Zone: Delete Account */}
      <div className="neu-card p-6 border border-rose-400/50 bg-[#E2E8F0] space-y-3">
        <div className="flex items-center gap-2 text-rose-600 font-display font-extrabold text-sm">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <span>Danger Zone</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-display font-bold text-base text-[#0F172A]">Delete Traveler Account</h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently delete your profile, scheduled itineraries, stops, and bookmarks.
            </p>
          </div>
          <Button
            variant="danger"
            size="md"
            icon={Trash2}
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Account Deletion"
        description="Are you absolutely sure? All your itineraries, stops, and saved bookmarks will be deleted permanently."
        maxWidth="max-w-md"
      >
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-300">
          <Button variant="ghost" size="md" onClick={() => setDeleteModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={handleDeleteAccount} isLoading={isDeletingAccount}>
            Permanently Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
