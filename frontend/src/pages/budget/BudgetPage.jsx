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
      success('Expense removed');
      fetchBudget(selectedTripId);
    } catch (err) {
      toastError(err.message || 'Failed to delete expense');
    } finally {
      setIsDeletingExpense(null);
    }
  };

  if (isLoading && !budgetData) {
    return <FullPageLoader label="Calculating real-time budget analytics..." />;
  }

  if (trips.length === 0) {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
            Trip Budget Analytics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time categorized expense tracking and cost intelligence
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-[20px] p-16 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto">
            <Wallet className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-abyss">No trips created yet</h3>
          <p className="text-sm text-slate-500">
            Create an itinerary first to analyze budget allocations and cost savings.
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
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Trip Selector */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-ocean-teal uppercase tracking-wider">
            <Wallet className="w-3.5 h-3.5" />
            <span>Financial Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-abyss font-display tracking-tight">
            Trip Budget & Costs
          </h1>
          <p className="text-sm text-slate-500">
            Dynamic expense categorization, average daily spend, and automated savings suggestions
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
            className="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-abyss shadow-xs focus:outline-none focus:border-ocean-teal cursor-pointer"
          >
            {trips.map((t) => (
              <option key={t.id} value={t.id}>
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

      {budgetData && (
        <>
          {/* Top Summary Bar: Total Spent vs Total Budget Pair */}
          <div className="p-6 sm:p-8 rounded-[20px] bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              {/* Primary Number Pair */}
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Total Expenditure vs Planned Budget
                </span>
                <div className="flex flex-wrap items-baseline gap-3">
                  <span
                    className={`font-display font-bold text-3xl sm:text-4xl ${
                      isOverBudget ? 'text-[#c0392b]' : 'text-ocean-teal'
                    }`}
                  >
                    ₹{totalSpent.toLocaleString('en-IN')}
                  </span>
                  <span className="text-slate-400 text-xl font-light">/</span>
                  <span className="font-display font-semibold text-2xl sm:text-3xl text-slate-700">
                    ₹{totalBudget.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  {isOverBudget ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-bold text-[#c0392b]">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      ₹{overAmount.toLocaleString('en-IN')} Over Target Budget
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ocean-teal/10 border border-ocean-teal/20 text-xs font-bold text-ocean-teal">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ₹{savingsHeadroom.toLocaleString('en-IN')} Remaining Headroom
                    </span>
                  )}
                </div>
              </div>

              {/* Stat Cards Grid beside number pair */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full lg:w-auto">
                <div className="p-3.5 rounded-[16px] bg-slate-50 border border-slate-200/80 min-w-[130px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Daily Average</span>
                  <p className="font-display font-bold text-base text-abyss mt-0.5">
                    ₹{budgetData.average_daily_cost.toLocaleString('en-IN')}/day
                  </p>
                </div>
                <div className="p-3.5 rounded-[16px] bg-slate-50 border border-slate-200/80 min-w-[130px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Trip Duration</span>
                  <p className="font-display font-bold text-base text-abyss mt-0.5">
                    {budgetData.total_days} {budgetData.total_days === 1 ? 'Day' : 'Days'}
                  </p>
                </div>
                <div className="p-3.5 rounded-[16px] bg-slate-50 border border-slate-200/80 min-w-[130px] col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Daily</span>
                  <p className="font-display font-bold text-base text-ocean-teal mt-0.5">
                    ₹{budgetData.average_daily_budget.toLocaleString('en-IN')}/day
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Budget Meter */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span>Budget Utilization</span>
                <span>
                  {totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}%` : 'No budget limit'}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isOverBudget ? 'bg-[#c0392b]' : 'bg-ocean-teal'
                  }`}
                  style={{ width: `${Math.min(100, totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 50)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Middle Row: Health Score Gauge & Category Breakdown Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HealthScoreGauge scoreData={budgetData.health_score} />
            <BudgetChart categories={budgetData.categories} totalSpent={totalSpent} />
          </div>

          {/* Bottom Section: Over-Budget Actionable Alternatives OR Calm Confirmation State */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-xl text-abyss">
                  {isOverBudget ? 'Recommended Cost Optimizations' : 'Budget Health Confirmation'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isOverBudget
                    ? 'Ranked actionable alternatives calculated directly from your destination and activity records'
                    : 'Your itinerary is cost-effective and on track'}
                </p>
              </div>
            </div>

            {isOverBudget ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {budgetData.suggestions.map((sug, idx) => (
                  <div
                    key={sug.id}
                    className="p-5 rounded-[20px] bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="p-2 rounded-xl bg-red-50 text-[#c0392b]">
                          {sug.type === 'activity_cut' ? (
                            <Scissors className="w-4 h-4" />
                          ) : sug.type === 'activity_swap' ? (
                            <RefreshCw className="w-4 h-4" />
                          ) : (
                            <MapPin className="w-4 h-4" />
                          )}
                        </div>
                        <span className="font-display font-bold text-base text-[#c0392b]">
                          -₹{sug.estimated_savings.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <h4 className="font-display font-bold text-sm text-abyss">
                        {sug.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {sug.description}
                      </p>
                    </div>

                    <Link
                      to={`/trips/${selectedTripId}/builder`}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-abyss font-bold text-xs transition-colors"
                    >
                      <span>Apply in Builder</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              /* Calm Confirmation State */
              <div className="p-8 rounded-[20px] bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-5">
                <div className="w-12 h-12 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-display font-bold text-base text-abyss">
                    Your Trip is Well Within Target Budget
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {budgetData.under_budget_message || `You have ₹${savingsHeadroom.toLocaleString('en-IN')} in financial headroom.`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Logged Expenses Table */}
          <div className="p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-base text-abyss">
                  Logged Manual Expenses
                </h4>
                <p className="text-xs text-slate-500">
                  Flights, hotels, dining, and other expenditures tracked on this journey
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={Plus}
                onClick={() => setIsExpenseModalOpen(true)}
              >
                Add Expense
              </Button>
            </div>

            {budgetData.expenses && budgetData.expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 uppercase font-bold text-[10px]">
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Note / Description</th>
                      <th className="pb-3 font-semibold">City</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                      <th className="pb-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {budgetData.expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 font-bold text-abyss capitalize">
                          🏷️ {exp.category}
                        </td>
                        <td className="py-3 text-slate-600">
                          {exp.note || 'Manual expense entry'}
                        </td>
                        <td className="py-3 text-slate-500">
                          {exp.trip_stop?.city?.name || 'Whole Trip'}
                        </td>
                        <td className="py-3 text-right font-bold text-abyss">
                          ₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteExpense(exp.id)}
                            disabled={isDeletingExpense === exp.id}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete Expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-4 text-center">
                No manual expenses logged yet. Itinerary activity costs are aggregated automatically.
              </p>
            )}
          </div>
        </>
      )}

      {/* Add Expense Modal */}
      {selectedTripId && (
        <AddExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          tripId={selectedTripId}
          onExpenseAdded={() => fetchBudget(selectedTripId)}
        />
      )}
    </div>
  );
};

export default BudgetPage;
