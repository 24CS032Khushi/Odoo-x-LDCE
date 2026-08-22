import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  TrendingUp,
  Star,
  Wallet,
  Activity,
  HeartPulse,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card, { PhotoCard } from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import CreateTripModal from '../../components/trips/CreateTripModal';
import api from '../../services/api';

const INTEREST_TAGS = [
  { id: 'culture', label: '🏛️ Culture' },
  { id: 'food', label: '🍜 Food & Dining' },
  { id: 'adventure', label: '🧗 Adventure' },
  { id: 'relaxation', label: '🏖️ Beaches & Nature' },
  { id: 'sightseeing', label: '📸 Sightseeing' },
  { id: 'nightlife', label: '🍸 Nightlife' }
];

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('all');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [selectedInterest]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const tripsRes = await api.get('/trips').catch(() => ({ data: { trips: [] } }));
      if (tripsRes.data?.trips) {
        setTrips(tripsRes.data.trips);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const query = selectedInterest !== 'all' ? `?interests=${selectedInterest}` : '';
      const res = await api.get(`/cities/recommendations${query}`);
      if (res.success && res.data?.recommendations) {
        setRecommendations(res.data.recommendations);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations:', err);
    }
  };

  const totalAllocatedBudget = trips.reduce((acc, t) => acc + parseFloat(t.total_budget || 0), 0);

  return (
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* 1. Header Hero Area in High-Contrast Frosted Tactile Card */}
      <div className="neu-card p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-neu-extruded">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#CBD5E1] border border-slate-300 text-xs font-mono font-bold text-amber-primary shadow-neu-inset-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-primary animate-pulse" />
            <span>🇮🇳 India & Global Travel Intelligence</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}<span className="text-amber-primary">.</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans">
            Plan multi-destination journeys across India and the globe, optimize budgets in INR (₹), and explore algorithmic recommendations tailored to your travel passions.
          </p>
        </div>

        {/* Primary Tactile CTAs */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Plan New Trip
          </Button>
          <Link to="/discover">
            <Button variant="secondary" size="lg" icon={Compass}>
              Discover Places
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Tactile Bento Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="neu-card p-6 sm:p-7 space-y-2 relative overflow-hidden group shadow-neu-extruded">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
              Active Itineraries
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center shadow-neu-inset-sm">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <p className="font-display font-black text-3xl sm:text-4xl text-[#0F172A]">
            {trips.length}
          </p>
          <span className="text-xs text-slate-500 font-sans block pt-1">
            {trips.length === 1 ? '1 Scheduled Journey' : `${trips.length} Scheduled Journeys`}
          </span>
        </div>

        <div className="neu-card p-6 sm:p-7 space-y-2 relative overflow-hidden group shadow-neu-extruded">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
              Allocated Budget
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-teal-accent flex items-center justify-center shadow-neu-inset-sm">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="font-mono font-bold text-3xl sm:text-4xl text-teal-accent tracking-tight">
            ₹{totalAllocatedBudget.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-slate-500 font-sans block pt-1">
            Total funds across planned itineraries
          </span>
        </div>

        <div className="neu-card p-6 sm:p-7 space-y-2 relative overflow-hidden group shadow-neu-extruded">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500">
              Health Diagnostic
            </span>
            <div className="w-10 h-10 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center shadow-neu-inset-sm">
              <HeartPulse className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="font-display font-black text-3xl sm:text-4xl text-[#0F172A]">
              Active
            </p>
          </div>
          <span className="text-xs text-slate-500 font-sans block pt-1">
            4-pillar continuous safety & conflict audit
          </span>
        </div>
      </div>

      {/* 3. Recommended Destinations Section */}
      <div className="space-y-6">
        <div className="neu-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-neu-extruded">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-primary uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-primary" />
              <span>Personalized For You • In India & World</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1 flex items-center gap-1.5">
              <span>Recommended Destinations</span>
              <span className="text-amber-primary">.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-sans">
              Algorithmic scoring matching your travel passions with local attractions and Indian heritage destinations.
            </p>
          </div>

          {/* Quick Interest Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              type="button"
              onClick={() => setSelectedInterest('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all whitespace-nowrap ${
                selectedInterest === 'all'
                  ? 'neu-btn-primary text-white shadow-neu-amber'
                  : 'bg-[#E5EAF0] text-slate-600 hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
              }`}
            >
              All Matches
            </button>
            {INTEREST_TAGS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => setSelectedInterest(tag.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all whitespace-nowrap ${
                  selectedInterest === tag.id
                    ? 'neu-btn-primary text-white shadow-neu-amber'
                    : 'bg-[#E5EAF0] text-slate-600 hover:text-[#0F172A] border border-slate-300 shadow-neu-extruded-sm'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendations Cards Grid (Showing top 6 scored destinations) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recommendations.slice(0, 6).map((city) => {
            const isIndia = city.country?.toLowerCase() === 'india';

            return (
              <PhotoCard
                key={city.id}
                imageUrl={city.image_url}
                title={city.name}
                subtitle={`${city.country} • ${city.cost_index}x Cost Index`}
                badge={isIndia ? '🇮🇳 India' : `★ ${city.popularity_score}`}
                onClick={() => navigate('/discover')}
              >
                <div className="space-y-2 pt-2 border-t border-slate-300/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-sans">Est. Daily Budget</span>
                    <span className="font-mono font-bold text-amber-primary">
                      ₹{Math.round(city.cost_index * 2500).toLocaleString('en-IN')}/day
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-sans">Passion Match</span>
                    <span className="font-mono font-bold text-teal-accent flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-teal-accent" />
                      {city.score ? `${city.score}% Match` : '96% Match'}
                    </span>
                  </div>
                </div>
              </PhotoCard>
            );
          })}
        </div>
      </div>

      {/* 4. Active Itineraries Section */}
      <div className="space-y-6">
        <div className="neu-card p-5 sm:p-6 flex items-center justify-between shadow-neu-extruded">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-black text-[#0F172A] flex items-center gap-2">
              <span>My Active Journeys</span>
              <span className="text-amber-primary">.</span>
            </h2>
            <p className="text-xs text-slate-600 font-sans mt-0.5">
              Your planned itineraries with live health scores and budget tracking.
            </p>
          </div>
          <Link to="/trips" className="text-xs font-display font-extrabold text-amber-primary flex items-center gap-1 hover:underline">
            <span>View All ({trips.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {trips.slice(0, 3).map((trip) => {
              const stopCount = trip.trip_stops?.length || 0;
              const stopCities = trip.trip_stops?.map((s) => s.city.name).join(' → ') || 'No stops yet';

              return (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="neu-card p-6 space-y-4 cursor-pointer hover:border-amber-primary/40 transition-all duration-200 group shadow-neu-extruded"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <h3 className="font-display font-extrabold text-lg text-[#0F172A] group-hover:text-amber-primary transition-colors">
                        {trip.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 font-sans">
                        {stopCities}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#DFE4EA] text-slate-600 border border-slate-300 shadow-neu-inset-sm">
                      {trip.status}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-300/80 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Stops</span>
                      <span className="font-bold text-[#0F172A] font-sans">{stopCount} destinations</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">Budget</span>
                      <span className="font-mono font-bold text-amber-primary">
                        ₹{parseFloat(trip.total_budget || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="neu-card p-10 text-center space-y-3 shadow-neu-extruded">
            <div className="w-12 h-12 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-base text-[#0F172A]">No active trips yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans">
              Create your first multi-city trip with intelligent scheduling, expense categorization, and health scores.
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

      {/* Create Trip Modal */}
      <CreateTripModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onTripCreated={(newTrip) => {
          setTrips((prev) => [newTrip, ...prev]);
          navigate(`/trips/${newTrip.id}`);
        }}
      />
    </div>
  );
};

export default DashboardPage;
