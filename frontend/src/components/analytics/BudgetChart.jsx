import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';

const CATEGORY_COLORS = {
  transport: '#3b82f6',
  stay: '#8b5cf6',
  activities: '#0D9488',
  meals: '#F59E0B',
  other: '#64748b'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="neu-modal text-[#0F172A] px-4 py-3 rounded-2xl border border-slate-300 shadow-2xl text-xs space-y-1 font-mono">
        <p className="font-display font-extrabold flex items-center gap-2 text-[#0F172A]">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color || '#0D9488' }} />
          {data.name}
        </p>
        <p className="text-slate-600">
          Amount: <span className="font-bold text-amber-primary">₹{parseFloat(data.amount || 0).toLocaleString('en-IN')}</span>
        </p>
        {data.percentage !== undefined && (
          <p className="text-slate-500 text-[11px]">
            Share: {data.percentage}% of total
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const BudgetChart = ({ categories = [], totalSpent = 0, className = '' }) => {
  const [chartType, setChartType] = useState('pie');

  const chartData = categories.filter((c) => c.amount > 0).length > 0
    ? categories.filter((c) => c.amount > 0)
    : categories.map((c) => ({ ...c, amount: 0 }));

  const hasData = categories.some((c) => c.amount > 0);

  return (
    <div className={`p-6 sm:p-7 rounded-[32px] neu-card text-[#0F172A] shadow-neu-extruded space-y-5 ${className}`}>
      {/* Header & Chart Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display font-black text-xl text-[#0F172A] flex items-center gap-1">
            <span>Expense Breakdown</span>
            <span className="text-amber-primary">.</span>
          </h4>
          <p className="text-xs text-slate-500 font-sans">
            Categorized across 5 standard travel buckets
          </p>
        </div>

        <div className="inline-flex p-1 rounded-2xl neu-inset">
          <button
            type="button"
            onClick={() => setChartType('pie')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              chartType === 'pie' ? 'neu-btn-primary text-white shadow-neu-amber' : 'text-slate-500 hover:text-[#0F172A]'
            }`}
            title="Pie / Donut View"
          >
            <PieIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-xl text-xs font-bold transition-all ${
              chartType === 'bar' ? 'neu-btn-primary text-white shadow-neu-amber' : 'text-slate-500 hover:text-[#0F172A]'
            }`}
            title="Bar Chart View"
          >
            <BarChart3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full relative flex items-center justify-center">
        {!hasData ? (
          <div className="text-center space-y-1 text-slate-400 font-sans">
            <p className="text-xs font-bold">No expenses logged or scheduled</p>
            <p className="text-[11px]">Add activities or log manual expenses to see visualization</p>
          </div>
        ) : chartType === 'pie' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
                stroke="#E5EAF0"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || CATEGORY_COLORS[entry.category] || '#0D9488'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(166, 180, 200, 0.4)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748B' }}
                axisLine={{ stroke: 'rgba(166, 180, 200, 0.5)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748B' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={entry.color || CATEGORY_COLORS[entry.category] || '#0D9488'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Legend & Percentages List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-200/80 font-mono">
        {categories.map((cat) => (
          <div key={cat.category} className="flex items-center justify-between p-3 rounded-2xl bg-[#DFE4EA] border border-slate-300 text-xs shadow-neu-inset-sm">
            <div className="flex items-center gap-2 min-w-0 font-sans">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color || CATEGORY_COLORS[cat.category] || '#0D9488' }}
              />
              <span className="font-bold text-[#0F172A] truncate">{cat.name}</span>
            </div>
            <span className="font-bold text-amber-primary text-[11px] ml-1">
              ₹{cat.amount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetChart;
