import React, { useState, useEffect } from 'react';
import { User, Mail, Globe, Image as ImageIcon, Calendar, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Card, { CardHeader, CardTitle, CardDescription, CardBody, CardFooter } from '../../components/shared/Card';
import FormInput from '../../components/shared/FormInput';
import Button from '../../components/shared/Button';

const languages = [
  { code: 'en', label: 'English (EN)' },
  { code: 'hi', label: 'Hindi (हिन्दी)' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'fr', label: 'French (Français)' },
  { code: 'de', label: 'German (Deutsch)' },
];

export const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { success, error: toastError } = useToast();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    photo_url: user?.photo_url || '',
    language: user?.language || 'en',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        photo_url: user.photo_url || '',
        language: user.language || 'en',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      setHasChanged(
        updated.name !== user?.name ||
        updated.photo_url !== (user?.photo_url || '') ||
        updated.language !== (user?.language || 'en')
      );
      return updated;
    });
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
        photo_url: formData.photo_url.trim() || null,
        language: formData.language,
      });
      success('Profile updated successfully!');
      setHasChanged(false);
    } catch (err) {
      toastError(err.message || 'Failed to update profile.');
    } finally {
      setIsSubmitting(false);
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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
          User Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details, language preferences, and account configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card className="md:col-span-1 h-fit">
          <CardBody className="flex flex-col items-center text-center p-6 space-y-4">
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

            <div>
              <h3 className="text-lg font-bold text-abyss font-display">{user?.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
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
                <span className="font-semibold uppercase text-ocean-teal bg-ocean-teal/10 px-2.5 py-0.5 rounded-full">
                  {user?.language || 'en'}
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
                  Update your display name, profile photo, and system language.
                </CardDescription>
              </CardHeader>

              <CardBody className="space-y-4">
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

                <FormInput
                  label="Profile Photo URL"
                  name="photo_url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={formData.photo_url}
                  onChange={handleChange}
                  leftIcon={ImageIcon}
                  helperText="Optional link to your avatar image."
                />

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="language" className="text-xs font-semibold text-slate-700 tracking-wide">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <select
                      id="language"
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                      className="w-full text-sm bg-white text-abyss border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none hover:border-slate-400 focus:border-ocean-teal focus:ring-2 focus:ring-ocean-teal/20 shadow-sm"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
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
    </div>
  );
};

export default ProfilePage;
