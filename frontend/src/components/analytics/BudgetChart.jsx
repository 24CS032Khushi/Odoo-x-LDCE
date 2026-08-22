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
  activities: '#14554f',
  meals: '#f59e0b',
  other: '#64748b'
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-abyss/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl border border-white/10 shadow-lg text-xs space-y-1">
        <p className="font-bold flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color || '#14554f' }} />
          {data.name}
        </p>
        <p className="text-slate-300">
          Amount: <span className="font-bold text-white">₹{parseFloat(data.amount || 0).toLocaleString('en-IN')}</span>
        </p>
        {data.percentage !== undefined && (
          <p className="text-slate-400 text-[11px]">
            Share: {data.percentage}% of total
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const BudgetChart = ({ categories = [], totalSpent = 0, className = '' }) => {
  const [chartType, setChartType] = useState('pie'); // 'pie' or 'bar'

  const chartData = categories.filter((c) => c.amount > 0).length > 0
    ? categories.filter((c) => c.amount > 0)
    : categories.map((c) => ({ ...c, amount: 0 }));

  const hasData = categories.some((c) => c.amount > 0);

  return (
    <div className={`p-6 rounded-[20px] bg-white border border-slate-200 shadow-sm space-y-5 ${className}`}>
      {/* Header & Chart Mode Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-display font-bold text-lg text-abyss">
            Expense Breakdown
          </h4>
          <p className="text-xs text-slate-500">
            Categorized across 5 standard travel buckets
          </p>
        </div>

        <div className="inline-flex p-1 rounded-full bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setChartType('pie')}
            className={`p-1.5 rounded-full text-xs font-semibold transition-all ${
              chartType === 'pie' ? 'bg-white text-abyss shadow-xs' : 'text-slate-500 hover:text-abyss'
            }`}
            title="Pie / Donut View"
          >
            <PieIcon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={`p-1.5 rounded-full text-xs font-semibold transition-all ${
              chartType === 'bar' ? 'bg-white text-abyss shadow-xs' : 'text-slate-500 hover:text-abyss'
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
          <div className="text-center space-y-1 text-slate-400">
            <p className="text-xs font-semibold">No expenses logged or scheduled</p>
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
                stroke="#ffffff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color || CATEGORY_COLORS[entry.category] || '#14554f'}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `₹${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`bar-cell-${index}`}
                    fill={entry.color || CATEGORY_COLORS[entry.category] || '#14554f'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Category Legend & Percentages List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
        {categories.map((cat) => (
          <div key={cat.category} className="flex items-center justify-between p-2 rounded-xl bg-slate-50/60 border border-slate-100 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: cat.color || CATEGORY_COLORS[cat.category] || '#14554f' }}
              />
              <span className="font-medium text-slate-700 truncate">{cat.name}</span>
            </div>
            <span className="font-bold text-abyss text-[11px] ml-1">
              ₹{cat.amount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetChart;
