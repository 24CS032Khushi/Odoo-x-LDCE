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
        const trips = res.data.trips;
        setTripsList(trips);

        const initialA = tripAParam ? parseInt(tripAParam, 10) : trips[0]?.id;
        const initialB = tripBParam ? parseInt(tripBParam, 10) : trips[1]?.id || trips[0]?.id;

        setTripAId(initialA);
        setTripBId(initialB);
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      toastError('Failed to load trips for comparison');
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
        api.get(`/trips/${idB}/budget`),
      ]);

      if (itinARes.success) setItineraryA(itinARes.data);
      if (itinBRes.success) setItineraryB(itinBRes.data);
      if (budgARes.success) setBudgetA(budgARes.data);
      if (budgBRes.success) setBudgetB(budgBRes.data);
    } catch (err) {
      toastError('Failed to load comparison metrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && (!itineraryA || !itineraryB)) {
    return <FullPageLoader label="Calculating side-by-side trade-off matrix..." />;
  }

  if (tripsList.length < 2) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
            Trip Comparison Matrix
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare trade-offs, budgets, pacing, and health scores across draft journeys
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[20px] p-16 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
            <Scale className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-abyss">At least 2 trips required</h3>
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
    <div className="space-y-8 animate-fade-in">
      {/* Header & Selectors */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ocean-teal uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Decision Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-abyss font-display tracking-tight">
            Trip Comparison Matrix
          </h1>
          <p className="text-sm text-slate-500">
            Side-by-side trade-off showdown: health scores, daily spend, and schedule feasibility
          </p>
        </div>

        {/* Dual Trip Selectors */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select
            value={tripAId}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setTripAId(val);
              setSearchParams({ tripA: val, tripB: tripBId });
            }}
            className="px-3.5 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-abyss shadow-xs focus:outline-none focus:border-ocean-teal cursor-pointer"
          >
            {tripsList.map((t) => (
              <option key={`a-${t.id}`} value={t.id}>
                Plan A: {t.name}
              </option>
            ))}
          </select>

          <span className="text-xs font-bold text-slate-400">vs</span>

          <select
            value={tripBId}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              setTripBId(val);
              setSearchParams({ tripA: tripAId, tripB: val });
            }}
            className="px-3.5 py-2 rounded-full bg-white border border-slate-200 text-xs font-bold text-abyss shadow-xs focus:outline-none focus:border-ocean-teal cursor-pointer"
          >
            {tripsList.map((t) => (
              <option key={`b-${t.id}`} value={t.id}>
                Plan B: {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {itineraryA && itineraryB && (
        <>
          {/* Top Level Showdown Grid: Plan A vs Plan B */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Card Plan A */}
            <div className={`p-6 sm:p-7 rounded-[20px] bg-white border shadow-sm space-y-6 ${
              scoreA >= scoreB ? 'border-ocean-teal/40 ring-1 ring-ocean-teal/20' : 'border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-abyss text-white text-[11px] font-bold">
                      Plan A
                    </span>
                    {scoreA > scoreB && (
                      <span className="px-2.5 py-0.5 rounded-full bg-ocean-teal/10 text-ocean-teal text-[11px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Recommended Draft (+{scoreDelta} pts)
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl text-abyss pt-1">
                    {itineraryA.trip_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {itineraryA.stops_count} Cities • {itineraryA.activities_count} Scheduled Experiences
                  </p>
                </div>
              </div>

              {/* Mini Health Score Ring & Status */}
              <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Health Score</span>
                  <p className={`font-display font-bold text-2xl ${scoreA >= 80 ? 'text-ocean-teal' : scoreA >= 50 ? 'text-amber-600' : 'text-[#c0392b]'}`}>
                    {scoreA}/100
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  scoreA >= 80 ? 'bg-ocean-teal/10 text-ocean-teal' : scoreA >= 50 ? 'bg-amber-500/10 text-amber-700' : 'bg-red-500/10 text-[#c0392b]'
                }`}>
                  {itineraryA.health_score?.label || 'Healthy'}
                </span>
              </div>

              {/* Sub-Score Bars */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 pb-1">
                    <span>Budget Adherence (35%)</span>
                    <span>{itineraryA.health_score?.sub_scores?.budget || 100}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${itineraryA.health_score?.sub_scores?.budget >= 80 ? 'bg-ocean-teal' : 'bg-[#c0392b]'}`}
                      style={{ width: `${itineraryA.health_score?.sub_scores?.budget || 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 pb-1">
                    <span>Load Balance (25%)</span>
                    <span>{itineraryA.health_score?.sub_scores?.load_balance || 100}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-ocean-teal"
                      style={{ width: `${itineraryA.health_score?.sub_scores?.load_balance || 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 pb-1">
                    <span>Timing Conflicts (25%)</span>
                    <span>{itineraryA.health_score?.sub_scores?.conflict || 100}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${itineraryA.health_score?.sub_scores?.conflict >= 80 ? 'bg-ocean-teal' : 'bg-[#c0392b]'}`}
                      style={{ width: `${itineraryA.health_score?.sub_scores?.conflict || 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to={`/trips/${tripAId}`} className="block">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Plan A Details
                  </Button>
                </Link>
              </div>
            </div>

            {/* Card Plan B */}
            <div className={`p-6 sm:p-7 rounded-[20px] bg-white border shadow-sm space-y-6 ${
              scoreB > scoreA ? 'border-ocean-teal/40 ring-1 ring-ocean-teal/20' : 'border-slate-200'
            }`}>
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold">
                      Plan B
                    </span>
                    {scoreB > scoreA && (
                      <span className="px-2.5 py-0.5 rounded-full bg-ocean-teal/10 text-ocean-teal text-[11px] font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Recommended Draft (+{scoreDelta} pts)
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-bold text-xl text-abyss pt-1">
                    {itineraryB.trip_name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {itineraryB.stops_count} Cities • {itineraryB.activities_count} Scheduled Experiences
                  </p>
                </div>
              </div>

              {/* Mini Health Score Ring & Status */}
              <div className="p-4 rounded-[16px] bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Health Score</span>
                  <p className={`font-display font-bold text-2xl ${scoreB >= 80 ? 'text-ocean-teal' : scoreB >= 50 ? 'text-amber-600' : 'text-[#c0392b]'}`}>
                    {scoreB}/100
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  scoreB >= 80 ? 'bg-ocean-teal/10 text-ocean-teal' : scoreB >= 50 ? 'bg-amber-500/10 text-amber-700' : 'bg-red-500/10 text-[#c0392b]'
                }`}>
                  {itineraryB.health_score?.label || 'Healthy'}
                </span>
              </div>

              {/* Sub-Score Bars */}
              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 pb-1">
                    <span>Budget Adherence (35%)</span>
                    <span>{itineraryB.health_score?.sub_scores?.budget || 100}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${itineraryB.health_score?.sub_scores?.budget >= 80 ? 'bg-ocean-teal' : 'bg-[#c0392b]'}`}
                      style={{ width: `${itineraryB.health_score?.sub_scores?.budget || 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 pb-1">
                    <span>Load Balance (25%)</span>
                    <span>{itineraryB.health_score?.sub_scores?.load_balance || 100}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-ocean-teal"
                      style={{ width: `${itineraryB.health_score?.sub_scores?.load_balance || 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold text-slate-700 pb-1">
                    <span>Timing Conflicts (25%)</span>
                    <span>{itineraryB.health_score?.sub_scores?.conflict || 100}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${itineraryB.health_score?.sub_scores?.conflict >= 80 ? 'bg-ocean-teal' : 'bg-[#c0392b]'}`}
                      style={{ width: `${itineraryB.health_score?.sub_scores?.conflict || 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link to={`/trips/${tripBId}`} className="block">
                  <Button variant="secondary" size="sm" className="w-full">
                    View Plan B Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Deep Trade-Off Comparison Matrix Table */}
          <div className="p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-lg text-abyss">
              Detailed Metric Comparison Matrix
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="pb-3 w-1/3">Evaluation Metric</th>
                    <th className="pb-3 w-1/3 text-abyss font-bold">Plan A ({itineraryA.trip_name})</th>
                    <th className="pb-3 w-1/3 text-abyss font-bold">Plan B ({itineraryB.trip_name})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <tr>
                    <td className="py-3 text-slate-500 font-semibold">Total Planned Budget</td>
                    <td className="py-3 font-bold text-abyss">₹{budgetLimitA.toLocaleString('en-IN')}</td>
                    <td className="py-3 font-bold text-abyss">₹{budgetLimitB.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-semibold">Estimated Total Spend</td>
                    <td className={`py-3 font-bold ${budgetA?.over_budget ? 'text-[#c0392b]' : 'text-ocean-teal'}`}>
                      ₹{spentA.toLocaleString('en-IN')} {budgetA?.over_budget ? '(Over Budget)' : '(Within Target)'}
                    </td>
                    <td className={`py-3 font-bold ${budgetB?.over_budget ? 'text-[#c0392b]' : 'text-ocean-teal'}`}>
                      ₹{spentB.toLocaleString('en-IN')} {budgetB?.over_budget ? '(Over Budget)' : '(Within Target)'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-semibold">Daily Average Spend (Burn Rate)</td>
                    <td className="py-3 font-bold text-slate-700">₹{Math.round(dailyA).toLocaleString('en-IN')} / day</td>
                    <td className="py-3 font-bold text-slate-700">₹{Math.round(dailyB).toLocaleString('en-IN')} / day</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-semibold">Trip Duration</td>
                    <td className="py-3 text-slate-700">{daysCountA} Days</td>
                    <td className="py-3 text-slate-700">{daysCountB} Days</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-semibold">Scheduled Experiences</td>
                    <td className="py-3 text-slate-700">{itineraryA.activities_count} activities</td>
                    <td className="py-3 text-slate-700">{itineraryB.activities_count} activities</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-500 font-semibold">Schedule Flags / Conflicts</td>
                    <td className="py-3 font-bold">
                      {flagsCountA === 0 ? (
                        <span className="text-ocean-teal">0 flags (Conflict-Free)</span>
                      ) : (
                        <span className="text-[#c0392b]">{flagsCountA} flags detected</span>
                      )}
                    </td>
                    <td className="py-3 font-bold">
                      {flagsCountB === 0 ? (
                        <span className="text-ocean-teal">0 flags (Conflict-Free)</span>
                      ) : (
                        <span className="text-[#c0392b]">{flagsCountB} flags detected</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Synthesis & Recommendation Verdict */}
          <div className="p-7 rounded-[20px] bg-gradient-to-r from-ocean-deep to-abyss text-white shadow-md flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center flex-shrink-0 border border-white/20">
              <ShieldCheck className="w-6 h-6 text-ocean-tint" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-display font-bold text-lg text-white">
                Algorithmic Comparison Verdict
              </h4>
              <p className="text-xs text-white/85 leading-relaxed max-w-3xl">
                {scoreA >= scoreB
                  ? `Plan A (${itineraryA.trip_name}) delivers a significantly higher trip health score (${scoreA}/100 vs ${scoreB}/100). It maintains balanced activity pacing and ensures financial adherence without schedule overlaps.`
                  : `Plan B (${itineraryB.trip_name}) is the superior draft with a health score of ${scoreB}/100. It offers better daily load distribution and budget headroom compared to Plan A.`}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TripComparePage;
