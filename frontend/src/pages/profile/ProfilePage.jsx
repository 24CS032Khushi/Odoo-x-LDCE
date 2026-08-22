import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Globe,
  Upload,
  Calendar,
  Save,
  Trash2,
  Heart,
  MapPin,
  AlertTriangle,
  Camera,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter, PhotoCard } from '../../components/shared/Card';
import FormInput from '../../components/shared/FormInput';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import api from '../../services/api';

export const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth();
  const { success, info, error: toastError } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    photo_url: user?.photo_url || '',
    language: 'en',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  // Saved destinations state
  const [savedDestinations, setSavedDestinations] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(true);

  // Delete account state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        photo_url: user.photo_url || '',
        language: 'en',
      });
    }
    fetchSavedDestinations();
  }, [user]);

  const fetchSavedDestinations = async () => {
    try {
      const res = await api.get('/saved-destinations');
      if (res.success) {
        setSavedDestinations(res.data.saved);
      }
    } catch (err) {
      console.error('Failed to fetch saved destinations', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  const handleRemoveSaved = async (cityId, e) => {
    e.stopPropagation();
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
      setHasChanged(
        updated.name !== user?.name ||
        updated.photo_url !== (user?.photo_url || '')
      );
      return updated;
    });
  };

  // Handle local image file browse
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toastError('Image size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setFormData((prev) => ({ ...prev, photo_url: result }));
      setHasChanged(true);
      success('Image loaded! Click "Save Changes" to apply.');
    };
    reader.onerror = () => {
      toastError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo_url: '' }));
    setHasChanged(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
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
        language: 'en',
      });
      success('Profile updated successfully!');
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

  const formattedJoinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Recently';

  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
          Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details, profile picture, saved destinations, and account settings.
        </p>
      </div>

      {/* Account Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1 h-fit">
          <CardBody className="flex flex-col items-center text-center p-6 space-y-4">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-ocean-teal/10 text-ocean-teal font-extrabold text-2xl flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                {formData.photo_url ? (
                  <img
                    src={formData.photo_url}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  user?.name?.substring(0, 2).toUpperCase() || 'GT'
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-ocean-teal text-white shadow-md hover:bg-ocean-deep transition-transform hover:scale-105"
                title="Browse Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-bold text-abyss font-display">{user?.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-700 border border-amber-500/30">
                  Platform Admin
                </span>
              )}
            </div>

            <div className="w-full pt-4 border-t border-slate-100 space-y-2.5 text-xs text-left">
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined:
                </span>
                <span className="font-semibold text-slate-700">{formattedJoinDate}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Globe className="w-3.5 h-3.5" />
                  Language:
                </span>
                <span className="font-semibold text-ocean-teal bg-ocean-teal/10 px-2.5 py-0.5 rounded-full">
                  English (EN)
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Edit Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Edit Account Information</CardTitle>
                <CardDescription>
                  Update your display name and upload a profile photo from your device.
                </CardDescription>
              </CardHeader>

              <CardBody className="space-y-5">
                <FormInput
                  label="Full Name"
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
                  helperText="Email cannot be changed directly."
                />

                {/* Browse Photo File Upload Control */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">
                    Profile Photo
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-abyss transition-all shadow-xs"
                    >
                      <Upload className="w-4 h-4 text-ocean-teal" />
                      <span>Browse Photo from Device</span>
                    </button>

                    {formData.photo_url && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="text-xs text-rose-600 hover:underline font-semibold"
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Supports PNG, JPG, or GIF up to 2MB. Preview updates instantly.
                  </p>
                </div>

                {/* System Language (English Only) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700 tracking-wide">
                    System Language
                  </label>
                  <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
                    <Globe className="w-4 h-4 text-ocean-teal" />
                    <span>English (EN)</span>
                    <span className="ml-auto text-[10px] text-slate-400 font-semibold uppercase">Default</span>
                  </div>
                </div>
              </CardBody>

              <CardFooter className="justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!hasChanged}
                  isLoading={isSubmitting}
                  icon={Save}
                >
                  Save Changes
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
      </div>

      {/* 2. Saved Destinations Gallery */}
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-abyss tracking-tight">
            Saved Destinations
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Cities you’ve bookmarked for upcoming journeys
          </p>
        </div>

        {savedDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedDestinations.map((city) => (
              <div key={city.id} className="relative group">
                <button
                  type="button"
                  onClick={(e) => handleRemoveSaved(city.id, e)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 text-rose-400 hover:text-white hover:bg-rose-500 flex items-center justify-center backdrop-blur-md transition-colors"
                  title="Remove from saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <PhotoCard
                  imageUrl={city.image_url}
                  title={city.name}
                  subtitle={`${city.country} • ${parseFloat(city.cost_index || 1.0).toFixed(1)}x Cost`}
                  badge={`${city.activities?.length || 5} Activities`}
                  badgeColor="bg-ocean-deep/80 text-white"
                  actionLabel="Explore City"
                  onAction={() => navigate('/discover')}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-[20px] p-8 text-center max-w-md mx-auto space-y-2">
            <Heart className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="font-bold text-sm text-abyss">No saved destinations yet</h4>
            <p className="text-xs text-slate-500">
              Browse the Discover page and tap the heart icon to save your favorite travel spots.
            </p>
            <div className="pt-2">
              <Button variant="outline" size="sm" onClick={() => navigate('/discover')}>
                Discover Cities
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Danger Zone: Delete Account */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-[20px] p-6 space-y-3">
        <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Danger Zone</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-rose-900">Delete Account</h4>
            <p className="text-xs text-rose-700/80 mt-0.5">
              Permanently delete your profile, trips, stops, and saved data. This action cannot be undone.
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
        description="Are you absolutely sure? All your trips, itineraries, and bookmarks will be erased permanently."
        maxWidth="max-w-md"
      >
        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
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
