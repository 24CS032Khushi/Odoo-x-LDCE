import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Copy,
  Check,
  Compass,
  Plane,
  Layers,
  ArrowRight,
  ExternalLink,
  Download
} from 'lucide-react';
import { FullPageLoader } from '../../components/shared/Loader';
import Button from '../../components/shared/Button';
import ExportTripModal from '../../components/trips/ExportTripModal';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const PublicSharePage = () => {
  const { shareSlug } = useParams();
  const { isAuthenticated } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    fetchSharedTrip();
  }, [shareSlug]);

  const fetchSharedTrip = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/share/${shareSlug}`);
      if (res.success) {
        setTrip(res.data.trip);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load shared trip');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyTrip = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/share/${shareSlug}&action=copy`);
      return;
    }

    setIsCopying(true);
    try {
      const res = await api.post(`/share/${shareSlug}/copy`);
      if (res.success) {
        success('Trip cloned to your library! Opening your new itinerary...');
        navigate(`/trips/${res.data.trip.id}`);
      }
    } catch (err) {
      toastError(err.message || 'Failed to copy trip');
    } finally {
      setIsCopying(false);
    }
  };

  if (isLoading) {
    return <FullPageLoader label="Loading shared travel itinerary..." />;
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-foam flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white border border-slate-200 rounded-[20px] p-10 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mx-auto">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="font-display font-bold text-xl text-abyss">Shared Itinerary Not Found</h2>
          <p className="text-xs text-slate-500">
            This trip might have been made private or the share link has expired.
          </p>
          <Link to="/">
            <Button variant="primary" size="md">
              Explore GlobeTrotter
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const dayNumbers = Object.keys(trip.days || {}).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-foam text-abyss flex flex-col">
      {/* Floating Glass Navbar for Public View */}
      <div className="w-full z-40 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 sticky top-0">
        <nav className="max-w-6xl mx-auto glass-navbar-floating px-5 sm:px-7 py-3 sm:py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/25 shadow-inner">
              <Plane className="w-4 h-4 text-white transform -rotate-45" />
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              GlobeTrotter
            </span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsExportModalOpen(true)}
              className="px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export (.ics)</span>
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
            )}

            <button
              type="button"
              onClick={handleCopyTrip}
              disabled={isCopying}
              className="px-5 py-2 rounded-full bg-white text-abyss font-bold text-xs shadow-md hover:bg-foam transition-all hover:scale-105"
            >
              {isCopying ? 'Cloning...' : 'Copy This Trip'}
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Header Full-Bleed with Cover Photo */}
      <div className="relative w-full h-[420px] -mt-20 overflow-hidden">
        <img
          src={trip.cover_photo_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80'}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" />

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 max-w-6xl mx-auto px-6 pb-10 flex flex-col justify-end text-white space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-ocean-tint">
            <span>Shared Itinerary</span>
            <span>•</span>
            <span>{trip.stops_count} Destinations</span>
            <span>•</span>
            <span>{trip.activities_count} Curated Experiences</span>
          </div>

          <h1 className="font-display font-bold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            {trip.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-ocean-tint" />
              {trip.start_date
                ? `${new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(trip.end_date || trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : 'Flexible Schedule'}
            </span>
            <span>•</span>
            <span className="font-medium text-white/95">
              Shared by <span className="font-bold text-white">{trip.creator?.name || 'Explorer'}</span> · via GlobeTrotter
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area on Foam */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 w-full flex-grow">
        {/* At-a-Glance Summary Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-[16px] bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Duration</span>
            <p className="font-display font-bold text-base text-abyss mt-0.5">
              {dayNumbers.length} {dayNumbers.length === 1 ? 'Day' : 'Days'}
            </p>
          </div>
          <div className="p-4 rounded-[16px] bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Destinations</span>
            <p className="font-display font-bold text-base text-abyss mt-0.5">
              {trip.stops_count} {trip.stops_count === 1 ? 'City' : 'Cities'}
            </p>
          </div>
          <div className="p-4 rounded-[16px] bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experiences</span>
            <p className="font-display font-bold text-base text-ocean-teal mt-0.5">
              {trip.activities_count} Scheduled
            </p>
          </div>
          <div className="p-4 rounded-[16px] bg-white border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Est. Activity Budget</span>
            <p className="font-display font-bold text-base text-abyss mt-0.5">
              ₹{parseFloat(trip.total_estimated_activities_cost || 0).toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Read-Only Day-by-Day Itinerary Schedule */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-abyss">
              Complete Travel Schedule
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-abyss"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Calendar</span>
              </button>
              <button
                type="button"
                onClick={handleCopyTrip}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-ocean-teal hover:underline"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Clone this plan</span>
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {dayNumbers.map((dayNum) => {
              const dayItems = trip.days[dayNum] || [];
              const dayCost = dayItems.reduce((acc, item) => acc + parseFloat(item.cost || 0), 0);

              return (
                <div
                  key={dayNum}
                  className="rounded-[20px] bg-white border border-slate-200 shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="px-3.5 py-1 rounded-full bg-abyss text-white font-display font-bold text-xs shadow-xs">
                        Day {dayNum}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {dayItems.length} {dayItems.length === 1 ? 'Experience' : 'Experiences'}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-ocean-teal">
                      Est. Spend: ₹{dayCost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    {dayItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-[16px] bg-slate-50/50 border border-slate-200/80"
                      >
                        <div className="flex items-start sm:items-center gap-4 min-w-0">
                          <img
                            src={item.activity?.image_url}
                            alt={item.activity?.name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-xs"
                          />
                          <div className="min-w-0 space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-bold text-base text-abyss font-display">
                                {item.activity?.name}
                              </h4>
                              <span className="px-2.5 py-0.5 rounded-full bg-ocean-teal/10 text-ocean-teal text-[11px] font-semibold">
                                {item.city_name}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">
                              {item.activity?.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <Clock className="w-3.5 h-3.5 text-ocean-teal" />
                                {item.start_time || '10:00'} ({item.activity?.duration_minutes}m)
                              </span>
                              <span className="capitalize text-slate-400">
                                🏷️ {item.activity?.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="self-end sm:self-center text-right flex-shrink-0">
                          <span className="text-sm font-bold text-abyss">
                            {parseFloat(item.cost) === 0 ? 'Free' : `₹${parseFloat(item.cost).toLocaleString('en-IN')}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="p-8 rounded-[20px] bg-gradient-to-r from-ocean-deep to-abyss text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h3 className="font-display font-bold text-xl text-white">
              Inspired by this itinerary?
            </h3>
            <p className="text-xs text-white/80 max-w-md">
              Clone this trip directly to your GlobeTrotter account to customize stops, balance your budget, and track health scores.
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyTrip}
            disabled={isCopying}
            className="px-6 py-3 rounded-full bg-white text-abyss font-bold text-xs shadow-md hover:bg-foam transition-all hover:scale-105 flex-shrink-0"
          >
            {isCopying ? 'Cloning Itinerary...' : 'Clone & Customize Trip'}
          </button>
        </div>
      </main>

      {/* Export Modal */}
      {trip && (
        <ExportTripModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          trip={trip}
          itineraryDays={trip.days}
        />
      )}
    </div>
  );
};

export default PublicSharePage;
