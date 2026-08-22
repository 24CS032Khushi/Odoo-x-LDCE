import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Compass,
  Share2,
  Calendar,
  DollarSign,
  TrendingUp,
  BarChart3,
  Shield,
  Activity,
  MapPin
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import Card from '../../components/shared/Card';
import { FullPageLoader } from '../../components/shared/Loader';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

const PALETTE = ['#2a9d8f', '#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#64748b'];

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toastError } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toastError('Admin privileges required');
      navigate('/dashboard');
      return;
    }
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/analytics');
      if (res.success) {
        setAnalytics(res.data);
      }
    } catch (err) {
      toastError(err.message || 'Failed to load admin analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <FullPageLoader label="Aggregating platform metrics & statistics..." />;
  }

  if (!analytics) return null;

  const { summary, charts } = analytics;

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ocean-tint uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Governance & Analytics</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-display tracking-tight">
            Admin Metrics Console
          </h1>
          <p className="text-sm text-white/60">
            Real-time telemetry across users, journeys, destination popularity, and budget distributions
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Telemetry Connected</span>
        </div>
      </div>

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-[18px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">Total Users</span>
          <p className="font-display font-bold text-2xl text-white">
            {summary.total_users}
          </p>
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <Users className="w-3 h-3 text-ocean-tint" /> Registered
          </span>
        </div>

        <div className="p-4 rounded-[18px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">Active (7d)</span>
          <p className="font-display font-bold text-2xl text-ocean-tint">
            {summary.active_users_7d}
          </p>
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <Activity className="w-3 h-3 text-ocean-tint" /> Active travelers
          </span>
        </div>

        <div className="p-4 rounded-[18px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">Trips Created</span>
          <p className="font-display font-bold text-2xl text-white">
            {summary.total_trips}
          </p>
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <Compass className="w-3 h-3 text-ocean-tint" /> Total journeys
          </span>
        </div>

        <div className="p-4 rounded-[18px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">Shared Trips</span>
          <p className="font-display font-bold text-2xl text-blue-400">
            {summary.shared_trips}
          </p>
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <Share2 className="w-3 h-3 text-blue-400" /> Public links
          </span>
        </div>

        <div className="p-4 rounded-[18px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">Avg Duration</span>
          <p className="font-display font-bold text-2xl text-white">
            {summary.average_duration_days}d
          </p>
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-ocean-tint" /> Days / trip
          </span>
        </div>

        <div className="p-4 rounded-[18px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-md space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white/50">Avg Budget</span>
          <p className="font-display font-bold text-2xl text-ocean-tint">
            ₹{summary.average_budget >= 1000 ? `${(summary.average_budget / 1000).toFixed(0)}k` : summary.average_budget}
          </p>
          <span className="text-[10px] text-white/50 flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-ocean-tint" /> Per trip avg
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Popular Destinations */}
        <div className="p-6 rounded-[20px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-lg space-y-4">
          <div>
            <h4 className="font-display font-bold text-lg text-white">
              Top Visited Destinations
            </h4>
            <p className="text-xs text-white/60">
              Ranked by total trip stop inclusions across user itineraries
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.popular_cities} layout="vertical" margin={{ left: 20, right: 20, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis type="number" tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.6)' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.9)', fontWeight: 600 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip
                  formatter={(val) => [`${val} stops scheduled`, 'Popularity']}
                  contentStyle={{ backgroundColor: '#071019', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px' }}
                />
                <Bar dataKey="trip_count" radius={[0, 6, 6, 0]}>
                  {charts.popular_cities.map((entry, idx) => (
                    <Cell key={`dest-${idx}`} fill={PALETTE[idx % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Budget Distribution Histogram */}
        <div className="p-6 rounded-[20px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-lg space-y-4">
          <div>
            <h4 className="font-display font-bold text-lg text-white">
              Budget Distribution
            </h4>
            <p className="text-xs text-white/60">
              Itinerary volume grouped by planned budget brackets
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.budget_distribution} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.7)' }} axisLine={{ stroke: 'rgba(255,255,255,0.15)' }} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(val) => [`${val} trips`, 'Count']}
                  contentStyle={{ backgroundColor: '#071019', color: '#fff', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '12px' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {charts.budget_distribution.map((entry, idx) => (
                    <Cell key={`budget-${idx}`} fill={entry.color || PALETTE[idx % PALETTE.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Activities List Table */}
      <div className="p-6 rounded-[20px] bg-[#0a1820]/90 backdrop-blur-md border border-white/10 shadow-lg space-y-4">
        <div>
          <h4 className="font-display font-bold text-base text-white">
            Most Popular Booked Experiences
          </h4>
          <p className="text-xs text-white/60">
            High-frequency activities scheduled across active itineraries
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/50 uppercase font-bold text-[10px]">
                <th className="pb-3 font-semibold">Activity Name</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold text-right">Itinerary Additions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {charts.popular_activities.map((act) => (
                <tr key={act.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 font-bold text-white">
                    {act.name}
                  </td>
                  <td className="py-3 capitalize text-white/70">
                    🏷️ {act.category}
                  </td>
                  <td className="py-3 font-semibold text-white/90">
                    {act.cost === 0 ? 'Free' : `₹${act.cost.toLocaleString('en-IN')}`}
                  </td>
                  <td className="py-3 text-right font-display font-bold text-ocean-tint">
                    {act.booked_count} times
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
