import React from 'react';
import { Link } from 'react-router-dom';
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
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Card, { CardHeader, CardTitle, CardDescription, CardBody, PhotoCard } from '../../components/shared/Card';
import Button from '../../components/shared/Button';

// Sample preview destinations showcasing the PhotoCard + bottom glass panel
const previewDestinations = [
  {
    id: 1,
    name: 'Kyoto & Osaka',
    country: 'Japan',
    subtitle: '7 Days • 12 Activities • Spring Itinerary',
    badge: 'Popular',
    badgeColor: 'bg-emerald-500/80 text-white',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    cost: '₹1,25,000',
    score: 9.4,
  },
  {
    id: 2,
    name: 'Santorini & Mykonos',
    country: 'Greece',
    subtitle: '5 Days • 8 Activities • Island Hopping',
    badge: 'Trending',
    badgeColor: 'bg-sky-500/80 text-white',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80',
    cost: '₹1,80,000',
    score: 9.8,
  },
  {
    id: 3,
    name: 'Amalfi Coast',
    country: 'Italy',
    subtitle: '6 Days • 10 Activities • Scenic Route',
    badge: 'Featured',
    badgeColor: 'bg-amber-500/80 text-white',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80',
    cost: '₹1,65,000',
    score: 9.2,
  },
];

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. Cinematic Hero Header Banner */}
      <div className="relative rounded-[24px] overflow-hidden shadow-xl min-h-[300px] flex flex-col justify-end p-8 sm:p-12 text-white">
        {/* Background Aerial Island Photo */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85"
          alt="Dashboard Aerial View"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark Ocean Vignette & Contrast Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-abyss/95 via-ocean-deep/50 to-abyss/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/85 via-abyss/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill-control text-xs font-semibold text-white/90">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Phase 1: Foundation Active</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Welcome back, {user?.name || 'Explorer'} 👋
          </h1>

          <p className="text-white/85 text-sm sm:text-base leading-relaxed">
            Your personalized travel engine is ready. Authentication, relational PostgreSQL schema, and the cinematic design system are fully locked in.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link to="/profile">
              <Button variant="white" size="md" icon={ArrowRight} iconPosition="right">
                Profile & Settings
              </Button>
            </Link>
            <Button
              variant="glass"
              size="md"
              icon={Plus}
              onClick={() => alert('Trip builder unlocks in Phase 2!')}
            >
              Plan New Trip (Phase 2)
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Destination Preview Grid with PhotoCard & Bottom Glass Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-abyss tracking-tight">
              Featured Multi-City Journeys
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Previews styled with photography & bottom glass panels
            </p>
          </div>
          <Link to="/discover">
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
              Explore all
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewDestinations.map((dest) => (
            <PhotoCard
              key={dest.id}
              imageUrl={dest.image}
              title={dest.name}
              subtitle={dest.subtitle}
              badge={dest.badge}
              badgeColor={dest.badgeColor}
              actionLabel="View Details"
              onAction={() => alert(`Details for ${dest.name} (Phase 2 preview)`)}
            >
              <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs text-white/90">
                <span className="font-semibold">{dest.cost} est.</span>
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3 h-3 fill-amber-300" />
                  {dest.score}
                </span>
              </div>
            </PhotoCard>
          ))}
        </div>
      </div>

      {/* 3. System Architecture & Foundation Status on Clean Foam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card hover>
          <CardBody className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ocean-teal/10 text-ocean-teal flex items-center justify-center flex-shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Database</span>
              <h4 className="text-base font-bold text-abyss font-display">10 Tables Schema</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prisma ORM synced with PostgreSQL: Users, Trips, Stops, Cities, Activities, Itinerary, Expenses & Health Scores.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Authentication</span>
              <h4 className="text-base font-bold text-abyss font-display">JWT & Bcrypt Security</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Protected routes, AuthContext persistence, Bearer verification & standard error formatting.
              </p>
            </div>
          </CardBody>
        </Card>

        <Card hover>
          <CardBody className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Roadmap</span>
              <h4 className="text-base font-bold text-abyss font-display">Phase 2 Engine</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-city Trip creation, city discovery search, activity scheduling & itinerary timeline coming next.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 4. Blank Shell Callout for Phase 2 */}
      <Card className="border-dashed border-2 border-slate-300 bg-white/70">
        <div className="p-10 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
            <Compass className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-abyss font-display">Itinerary & Budget Ready</h3>
            <p className="text-xs text-slate-500 mt-1">
              This authenticated shell is primed for Phase 2 feature integration without any restructuring.
            </p>
          </div>
          <div className="pt-2">
            <Button
              variant="primary"
              size="md"
              icon={Plus}
              onClick={() => alert('Trip creation engine unlocks in Phase 2!')}
            >
              Create Trip (Phase 2)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
