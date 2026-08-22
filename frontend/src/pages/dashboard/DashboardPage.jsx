import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Database,
  Layers,
  Plus,
  TrendingUp,
  Star,
  Wallet
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader, CardTitle, CardDescription, CardBody, PhotoCard } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import CreateTripModal from '../../components/trips/CreateTripModal';
import api from '../../services/api';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [tripsRes, citiesRes] = await Promise.all([
        api.get('/trips').catch(() => ({ data: { trips: [] } })),
        api.get('/cities').catch(() => ({ data: { cities: [] } })),
      ]);

      if (tripsRes.data?.trips) {
        setTrips(tripsRes.data.trips);
      }
      if (citiesRes.data?.cities) {
        // Take top 3 by popularity
        setTopCities(citiesRes.data.cities.slice(0, 3));
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAllocatedBudget = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. Cinematic Hero Header Banner */}
      <div className="relative rounded-[24px] overflow-hidden shadow-xl min-h-[290px] flex flex-col justify-end p-8 sm:p-12 text-white">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
          alt="Dashboard Aerial View"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-abyss/95 via-ocean-deep/50 to-abyss/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/85 via-abyss/40 to-transparent" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-control text-xs font-semibold text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>GlobeTrotter Smart • Phase 2 Engine</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Welcome back, {user?.name || 'Explorer'} 👋
          </h1>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed">
            Ready to plan your next itinerary? Design multi-city journeys, allocate your budget in INR (₹), and organize activities with ease.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Button
              variant="white"
              size="md"
              icon={Plus}
              onClick={() => setCreateModalOpen(true)}
            >
              Plan New Trip
            </Button>
            <Link to="/discover">
              <Button variant="glass" size="md" icon={Compass}>
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Highlights Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-ocean-teal/10 text-ocean-teal flex items-center justify-center flex-shrink-0">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Itineraries</span>
            <h4 className="text-2xl font-bold text-abyss font-display">
              {trips.length} {trips.length === 1 ? 'Trip' : 'Trips'}
            </h4>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Allocated Budget</span>
            <h4 className="text-2xl font-bold text-abyss font-display">
              ₹{totalAllocatedBudget.toLocaleString('en-IN')}
            </h4>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Curated Destinations</span>
            <h4 className="text-2xl font-bold text-abyss font-display">12 Cities Seeded</h4>
          </div>
        </div>
      </div>

      {/* 3. My Recent Itineraries Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-abyss tracking-tight">
              My Recent Itineraries
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Continue planning or reviewing your scheduled journeys
            </p>
          </div>
          <Link to="/trips">
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
              View all trips ({trips.length})
            </Button>
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => {
              const stopCount = trip.trip_stops?.length || 0;
              return (
                <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)} className="cursor-pointer">
                  <PhotoCard
                    imageUrl={trip.cover_photo_url || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'}
                    title={trip.name}
                    subtitle={trip.trip_stops?.map((s) => s.city.name).join(' → ') || 'No stops yet'}
                    badge={`${stopCount} ${stopCount === 1 ? 'Stop' : 'Stops'}`}
                    badgeColor="bg-ocean-deep/80 text-white"
                    actionLabel="View Itinerary"
                    onAction={() => navigate(`/trips/${trip.id}`)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-[20px] p-10 text-center max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-abyss">No trips created yet</h3>
            <p className="text-xs text-slate-500">
              Build your first multi-destination journey with custom activity scheduling.
            </p>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setCreateModalOpen(true)}
            >
              Plan First Trip
            </Button>
          </div>
        )}
      </div>

      {/* 4. Top Recommended Destinations Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-abyss tracking-tight">
              Recommended Destinations
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Popular cities with curated attractions and cost ratings
            </p>
          </div>
          <Link to="/discover">
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
              Explore catalog
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topCities.map((city) => (
            <Link key={city.id} to="/discover">
              <PhotoCard
                imageUrl={city.image_url}
                title={city.name}
                subtitle={`${city.country} • ${city.region || 'Global'}`}
                badge={`${city.cost_index}x Cost`}
                badgeColor="bg-ocean-deep/80 text-white"
              >
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    {city.popularity_score}
                  </span>
                  <span className="text-white/80 font-medium">Explore & Add →</span>
                </div>
              </PhotoCard>
            </Link>
          ))}
        </div>
      </div>

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onTripCreated={(savedTrip) => {
          setTrips((prev) => [savedTrip, ...prev]);
          navigate(`/trips/${savedTrip.id}/builder`);
        }}
      />
    </div>
  );
};

export default DashboardPage;
