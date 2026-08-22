import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Scale,
  Compass,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowLeftRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { FullPageLoader } from '../../components/shared/Loader';
import HealthScoreGauge from '../../components/analytics/HealthScoreGauge';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const CATEGORY_COLORS = {
  transport: '#3b82f6',
  stay: '#8b5cf6',
  activities: '#14554f',
  meals: '#f59e0b',
  other: '#64748b'
};

export const TripComparePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tripAParam = searchParams.get('tripA');
  const tripBParam = searchParams.get('tripB');
  const { toastError } = useToast();

  const [tripsList, setTripsList] = useState([]);
  const [tripAId, setTripAId] = useState(tripAParam || '');
  const [tripBId, setTripBId] = useState(tripBParam || '');

  const [itineraryA, setItineraryA] = useState(null);
  const [itineraryB, setItineraryB] = useState(null);
  const [budgetA, setBudgetA] = useState(null);
  const [budgetB, setBudgetB] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (tripAId && tripBId) {
      fetchComparisonData(tripAId, tripBId);
    }
  }, [tripAId, tripBId]);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      if (res.success && res.data.trips.length > 0) {
        setTripsList(res.data.trips);
        const list = res.data.trips;
        if (!tripAId && list.length >= 1) setTripAId(list[0].id.toString());
        if (!tripBId && list.length >= 2) setTripBId(list[1].id.toString());
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      toastError('Failed to load trips library');
      setIsLoading(false);
    }
  };

  const fetchComparisonData = async (idA, idB) => {
    setIsLoading(true);
    try {
      const [itinARes, itinBRes, budgARes, budgBRes] = await Promise.all([
        api.get(`/trips/${idA}/itinerary`),
        api.get(`/trips/${idB}/itinerary`),
        api.get(`/trips/${idA}/budget`),
        api.get(`/trips/${idB}/budget`)
      ]);

      if (itinARes.success) setItineraryA(itinARes.data);
      if (itinBRes.success) setItineraryB(itinBRes.data);
      if (budgARes.success) setBudgetA(budgARes.data);
      if (budgBRes.success) setBudgetB(budgBRes.data);
    } catch (err) {
      toastError('Failed to fetch full comparison data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && (!itineraryA || !itineraryB)) {
    return <FullPageLoader label="Synthesizing multi-variable comparison matrix..." />;
  }

  if (tripsList.length < 2) {
    return (
      <div className="space-y-8 animate-fade-in text-[#0F172A] font-sans">
        <div className="neu-card p-6 sm:p-8 shadow-neu-extruded">
          <h1 className="text-3xl sm:text-4xl font-black font-display text-[#0F172A] tracking-tight flex items-center gap-1">
            <span>Trip Comparison Matrix</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-sans">
            Side-by-side trade-off showdown: health scores, daily spend, and schedule feasibility.
          </p>
        </div>
        <div className="neu-card p-14 text-center max-w-md mx-auto space-y-4 shadow-neu-extruded">
          <div className="w-14 h-14 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
            <Scale className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0F172A]">At least 2 trips required</h3>
          <p className="text-sm text-slate-500">
            Create or clone at least two trips to analyze trade-offs side-by-side.
          </p>
          <Link to="/trips">
            <Button variant="primary" size="md">
              View Trips Library
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const scoreA = itineraryA?.health_score?.overall || 100;
  const scoreB = itineraryB?.health_score?.overall || 100;
  const scoreDelta = Math.abs(scoreA - scoreB);

  const spentA = parseFloat(budgetA?.total_spent || 0);
  const spentB = parseFloat(budgetB?.total_spent || 0);
  const budgetLimitA = parseFloat(budgetA?.total_budget || 0);
  const budgetLimitB = parseFloat(budgetB?.total_budget || 0);

  const daysCountA = Object.keys(itineraryA?.days || {}).length || 1;
  const daysCountB = Object.keys(itineraryB?.days || {}).length || 1;

  const dailyA = budgetA?.average_daily_cost || (spentA / daysCountA);
  const dailyB = budgetB?.average_daily_cost || (spentB / daysCountB);

  const flagsCountA = itineraryA?.sanity_flags?.length || 0;
  const flagsCountB = itineraryB?.sanity_flags?.length || 0;

  return (
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* Header & Selectors in High-Contrast Tactile Card */}
      <div className="neu-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-neu-extruded">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-primary uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Decision Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] font-display tracking-tight flex items-center gap-1.5">
            <span>Trip Comparison Matrix</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 font-sans">
            Side-by-side trade-off showdown: health scores, daily spend, and schedule feasibility.
          </p>
        </div>

        {/* Dual Trip Selectors */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={tripAId}
            onChange={(e) => {
              setTripAId(e.target.value);
              setSearchParams({ tripA: e.target.value, tripB: tripBId });
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-xs font-mono font-bold text-[#0F172A] shadow-neu-inset-sm cursor-pointer outline-none"
          >
            {tripsList.map((t) => (
              <option key={t.id} value={t.id}>
                Draft A: {t.name}
              </option>
            ))}
          </select>

          <ArrowLeftRight className="w-4 h-4 text-slate-400 shrink-0" />

          <select
            value={tripBId}
            onChange={(e) => {
              setTripBId(e.target.value);
              setSearchParams({ tripA: tripAId, tripB: e.target.value });
            }}
            className="px-3.5 py-2.5 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-xs font-mono font-bold text-[#0F172A] shadow-neu-inset-sm cursor-pointer outline-none"
          >
            {tripsList.map((t) => (
              <option key={t.id} value={t.id}>
                Draft B: {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Showdown Score Winner Banner */}
      <div className="neu-card p-6 flex items-center justify-between shadow-neu-extruded">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center shadow-neu-inset">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-[#0F172A]">
              {scoreA > scoreB
                ? `Draft A (${itineraryA?.trip_name}) is more balanced`
                : scoreB > scoreA
                ? `Draft B (${itineraryB?.trip_name}) is more balanced`
                : 'Both drafts have identical feasibility health ratings'}
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Score Delta: {scoreDelta} points • Calculated across pacing, transit sanity, and budget headroom
            </p>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Draft A Column */}
        <div className="neu-card p-7 space-y-6 shadow-neu-extruded">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-primary">
                Option A
              </span>
              <h2 className="text-2xl font-display font-bold text-[#0F172A]">{itineraryA?.trip_name}</h2>
            </div>
            <Link to={`/trips/${tripAId}`}>
              <Button variant="outline" size="sm">
                Open Trip
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center p-4 bg-[#DFE4EA] rounded-2xl border border-slate-300 shadow-neu-inset-sm">
            <HealthScoreGauge score={scoreA} size={150} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Destinations</span>
              <span className="font-bold text-[#0F172A]">{itineraryA?.stops_count || 0} stops</span>
            </div>
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Scheduled Experiences</span>
              <span className="font-bold text-[#0F172A]">{itineraryA?.activities_count || 0} activities</span>
            </div>
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Total Spend / Target</span>
              <span className="font-mono font-bold text-amber-primary">
                ₹{spentA.toLocaleString('en-IN')} / ₹{budgetLimitA.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Daily Burn Velocity</span>
              <span className="font-mono font-bold text-teal-accent">₹{Math.round(dailyA).toLocaleString('en-IN')}/day</span>
            </div>
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Sanity Warnings</span>
              <span className={`font-bold ${flagsCountA > 0 ? 'text-rose-600' : 'text-teal-accent'}`}>
                {flagsCountA} {flagsCountA === 1 ? 'flag' : 'flags'}
              </span>
            </div>
          </div>
        </div>

        {/* Draft B Column */}
        <div className="neu-card p-7 space-y-6 shadow-neu-extruded">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-teal-accent">
                Option B
              </span>
              <h2 className="text-2xl font-display font-bold text-[#0F172A]">{itineraryB?.trip_name}</h2>
            </div>
            <Link to={`/trips/${tripBId}`}>
              <Button variant="outline" size="sm">
                Open Trip
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center p-4 bg-[#DFE4EA] rounded-2xl border border-slate-300 shadow-neu-inset-sm">
            <HealthScoreGauge score={scoreB} size={150} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Destinations</span>
              <span className="font-bold text-[#0F172A]">{itineraryB?.stops_count || 0} stops</span>
            </div>
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Scheduled Experiences</span>
              <span className="font-bold text-[#0F172A]">{itineraryB?.activities_count || 0} activities</span>
            </div>
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Total Spend / Target</span>
              <span className="font-mono font-bold text-teal-accent">
                ₹{spentB.toLocaleString('en-IN')} / ₹{budgetLimitB.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Daily Burn Velocity</span>
              <span className="font-mono font-bold text-teal-accent">₹{Math.round(dailyB).toLocaleString('en-IN')}/day</span>
            </div>
            <div className="flex justify-between text-xs p-3 rounded-xl bg-[#DFE4EA]">
              <span className="text-slate-500">Sanity Warnings</span>
              <span className={`font-bold ${flagsCountB > 0 ? 'text-rose-600' : 'text-teal-accent'}`}>
                {flagsCountB} {flagsCountB === 1 ? 'flag' : 'flags'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripComparePage;
