import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Wallet,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  Sparkles,
  Scissors,
  RefreshCw,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import { FullPageLoader } from '../../components/shared/Loader';
import HealthScoreGauge from '../../components/analytics/HealthScoreGauge';
import BudgetChart from '../../components/analytics/BudgetChart';
import AddExpenseModal from '../../components/trips/AddExpenseModal';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

export const BudgetPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tripParamId = searchParams.get('trip_id');
  const { success, error: toastError } = useToast();

  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(tripParamId || null);
  const [budgetData, setBudgetData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isDeletingExpense, setIsDeletingExpense] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (selectedTripId) {
      fetchBudget(selectedTripId);
    }
  }, [selectedTripId]);

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      if (res.success && res.data.trips.length > 0) {
        setTrips(res.data.trips);
        if (!selectedTripId) {
          const initialId = tripParamId ? parseInt(tripParamId, 10) : res.data.trips[0].id;
          setSelectedTripId(initialId);
        }
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      toastError('Failed to load trips');
      setIsLoading(false);
    }
  };

  const fetchBudget = async (tripId) => {
    setIsLoading(true);
    try {
      const res = await api.get(`/trips/${tripId}/budget`);
      if (res.success) {
        setBudgetData(res.data);
      }
    } catch (err) {
      toastError('Failed to load budget breakdown');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    setIsDeletingExpense(expenseId);
    try {
      await api.delete(`/trips/${selectedTripId}/expenses/${expenseId}`);
      success('Expense deleted');
      fetchBudget(selectedTripId);
    } catch (err) {
      toastError('Failed to delete expense');
    } finally {
      setIsDeletingExpense(null);
    }
  };

  if (isLoading && !budgetData) {
    return <FullPageLoader label="Calculating financial telemetry & burn rate in INR..." />;
  }

  if (trips.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in text-[#0F172A] font-sans">
        <div className="neu-card p-6 sm:p-8 shadow-neu-extruded">
          <h1 className="text-3xl sm:text-4xl font-black font-display text-[#0F172A] tracking-tight flex items-center gap-1">
            <span>Trip Budget & Optimization</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 mt-1 font-sans">
            Categorized expense tracking, daily burn rate in INR (₹), and budget analytics.
          </p>
        </div>
        <div className="neu-card p-14 text-center max-w-md mx-auto space-y-4 shadow-neu-extruded">
          <div className="w-14 h-14 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-amber-primary flex items-center justify-center mx-auto shadow-neu-inset">
            <Wallet className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-[#0F172A]">No Trips Found</h3>
          <p className="text-xs text-slate-500">
            Create a trip first to unlock detailed budget categorization and smart spending analytics.
          </p>
          <Link to="/trips">
            <Button variant="primary" size="md">
              Create Your First Trip
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isOverBudget = budgetData?.over_budget || false;
  const totalBudget = parseFloat(budgetData?.total_budget || 0);
  const totalSpent = parseFloat(budgetData?.total_spent || 0);
  const overAmount = parseFloat(budgetData?.over_amount || 0);
  const savingsHeadroom = parseFloat(budgetData?.savings_headroom || 0);

  return (
    <div className="space-y-10 animate-fade-in text-[#0F172A] font-sans">
      {/* Top Header & Trip Selector in High-Contrast Tactile Card */}
      <div className="neu-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-neu-extruded">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-primary uppercase tracking-wider">
            <Wallet className="w-3.5 h-3.5" />
            <span>Financial Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-[#0F172A] tracking-tight flex items-center gap-1.5">
            <span>Trip Budget & Optimization</span>
            <span className="text-amber-primary">.</span>
          </h1>
          <p className="text-sm text-slate-600 font-sans">
            Dynamic expense categorization, daily burn rate in INR (₹), and automated savings heuristics.
          </p>
        </div>

        {/* Trip Switcher & Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={selectedTripId || ''}
            onChange={(e) => {
              const id = parseInt(e.target.value, 10);
              setSelectedTripId(id);
              setSearchParams({ trip_id: id });
            }}
            className="px-4 py-2.5 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-xs font-mono font-bold text-[#0F172A] shadow-neu-inset-sm focus:outline-none focus:border-amber-primary cursor-pointer"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id} className="bg-[#E5EAF0] text-[#0F172A]">
                📍 {t.name}
              </option>
            ))}
          </select>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsExpenseModalOpen(true)}
          >
            Log Expense
          </Button>
        </div>
      </div>

      {/* KPI Cards: 3 Core Figures */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="neu-card p-6 space-y-2 shadow-neu-extruded">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
            Target Trip Budget
          </span>
          <p className="font-mono font-bold text-3xl text-[#0F172A]">
            ₹{totalBudget.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-slate-500 block font-sans">
            Set maximum expenditure threshold
          </span>
        </div>

        <div className="neu-card p-6 space-y-2 shadow-neu-extruded">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
              Total Logged Spend
            </span>
            {isOverBudget ? (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                OVER BUDGET
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                ON TRACK
              </span>
            )}
          </div>
          <p className={`font-mono font-bold text-3xl ${isOverBudget ? 'text-rose-600' : 'text-amber-primary'}`}>
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
          <span className="text-xs text-slate-500 block font-sans">
            {isOverBudget
              ? `Exceeded limit by ₹${overAmount.toLocaleString('en-IN')}`
              : `₹${savingsHeadroom.toLocaleString('en-IN')} remaining headroom`}
          </span>
        </div>

        <div className="neu-card p-6 space-y-2 shadow-neu-extruded">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
            Daily Burn Velocity
          </span>
          <p className="font-mono font-bold text-3xl text-teal-accent">
            ₹{parseFloat(budgetData?.burn_rate_daily || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            <span className="text-xs font-normal text-slate-500 font-sans">/day</span>
          </p>
          <span className="text-xs text-slate-500 block font-sans">
            Estimated daily outlay across duration
          </span>
        </div>
      </div>

      {/* Main Budget Grid: Chart + Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Left 2 Cols: Interactive Visual Donut & Category Cards */}
        <div className="lg:col-span-2 space-y-6">
          <div className="neu-card p-7 space-y-6 shadow-neu-extruded">
            <h2 className="font-display font-extrabold text-xl text-[#0F172A] flex items-center gap-2">
              <span>Category Allocation Breakdown</span>
              <span className="text-amber-primary">.</span>
            </h2>

            {/* Visual Budget Donut */}
            <div className="pt-2">
              <BudgetChart
                categories={budgetData?.categories || {}}
                totalSpent={totalSpent}
              />
            </div>
          </div>

          {/* Detailed 5 Standard Category Breakdowns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(budgetData?.categories || {}).map(([key, cat]) => (
              <div
                key={key}
                className="neu-card p-5 space-y-3 shadow-neu-extruded"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider font-bold text-slate-700 capitalize">
                    {key}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {cat.percentage}%
                  </span>
                </div>

                <div className="flex items-baseline justify-between">
                  <span className="font-mono font-bold text-xl text-[#0F172A]">
                    ₹{parseFloat(cat.amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full bg-[#CBD5E1] rounded-full overflow-hidden shadow-neu-inset-sm">
                  <div
                    className="h-full bg-amber-primary transition-all duration-500"
                    style={{ width: `${Math.min(parseFloat(cat.percentage), 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Heuristic Savings Suggestions & Health Score */}
        <div className="space-y-6">
          {/* Smart Savings Heuristics */}
          <div className="neu-card p-6 space-y-4 shadow-neu-extruded">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-teal-accent uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Smart Savings Heuristics</span>
            </div>

            <h3 className="font-display font-extrabold text-base text-[#0F172A]">
              Automated Cost Optimization
            </h3>

            {budgetData?.savings_suggestions && budgetData.savings_suggestions.length > 0 ? (
              <div className="space-y-3">
                {budgetData.savings_suggestions.map((sug, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[#DFE4EA] border border-slate-300 shadow-neu-inset-sm space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold uppercase text-amber-primary">
                        {sug.category}
                      </span>
                      <span className="font-mono font-bold text-teal-accent">
                        Save ~₹{sug.potential_saving_inr.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p className="text-slate-600 font-sans">{sug.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Your budget allocations look balanced! No high-burn optimizations triggered.
              </p>
            )}
          </div>

          {/* Quick Expense History Log */}
          <div className="neu-card p-6 space-y-4 shadow-neu-extruded">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-extrabold text-base text-[#0F172A]">
                Recent Expenses
              </h3>
              <button
                type="button"
                onClick={() => setIsExpenseModalOpen(true)}
                className="text-xs font-display font-bold text-amber-primary hover:underline"
              >
                + Add Item
              </button>
            </div>

            {budgetData?.expenses && budgetData.expenses.length > 0 ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {budgetData.expenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#DFE4EA] border border-slate-300 shadow-neu-inset-sm text-xs"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-[#0F172A] block font-sans">
                        {exp.description}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {exp.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-primary">
                        ₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id)}
                        disabled={isDeletingExpense === exp.id}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete expense"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No manual expenses logged yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Log Expense Modal */}
      <AddExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        tripId={selectedTripId}
        onExpenseAdded={() => {
          success('Expense logged successfully');
          fetchBudget(selectedTripId);
        }}
      />
    </div>
  );
};

export default BudgetPage;
