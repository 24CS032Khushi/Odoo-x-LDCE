import React from 'react';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, BatteryCharging, Clock, DollarSign, Layers } from 'lucide-react';

export const HealthScoreGauge = ({ scoreData, compact = false, className = '' }) => {
  if (!scoreData) return null;

  const score = Math.round(scoreData.overall_score || 0);
  const budgetScore = Math.round(scoreData.budget_score ?? 100);
  const loadScore = Math.round(scoreData.load_balance_score ?? 100);
  const conflictScore = Math.round(scoreData.conflict_score ?? 100);
  const bufferScore = Math.round(scoreData.buffer_score ?? 100);

  let statusColor = '#0D9488';
  let statusLabel = 'Healthy Itinerary';
  let statusBadgeBg = 'bg-teal-50 text-teal-700 border-teal-200';

  if (score < 50) {
    statusColor = '#e11d48';
    statusLabel = 'Action Required';
    statusBadgeBg = 'bg-rose-50 text-rose-600 border-rose-200';
  } else if (score < 80) {
    statusColor = '#D97706';
    statusLabel = 'Needs Attention';
    statusBadgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  }

  const size = compact ? 88 : 120;
  const strokeWidth = compact ? 8 : 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const subScoreColor = (val) => {
    if (val < 50) return '#e11d48';
    if (val < 80) return '#D97706';
    return '#0D9488';
  };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-3.5 p-3 rounded-2xl neu-card text-[#0F172A] shadow-neu-extruded-sm ${className}`}>
        <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="transform -rotate-90">
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="rgba(166, 180, 200, 0.4)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={statusColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono font-bold text-lg text-[#0F172A] leading-none">
              {score}
            </span>
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-tight mt-0.5">
              Score
            </span>
          </div>
        </div>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-1.5">
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${statusBadgeBg}`}>
              {statusLabel}
            </span>
          </div>
          <p className="text-xs text-slate-600 line-clamp-1 font-sans">
            {scoreData.explanations?.budget || 'Real-time health score'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 sm:p-7 rounded-[32px] neu-card text-[#0F172A] shadow-neu-extruded space-y-6 ${className}`}>
      {/* Header & Radial Gauge */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border bg-teal-50 text-teal-700 border-teal-200 shadow-neu-inset-sm">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Trip Health Engine</span>
          </div>
          <h3 className="text-2xl font-black text-[#0F172A] font-display tracking-tight flex items-center gap-1">
            <span>Schedule & Budget Pacing</span>
            <span className="text-amber-primary">.</span>
          </h3>
          <p className="text-xs text-slate-600 max-w-md leading-relaxed font-sans">
            Multi-factor evaluation of your itinerary balancing budget limits, travel intensity, and timing conflicts.
          </p>
        </div>

        {/* Circular Radial Gauge */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(166, 180, 200, 0.4)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={statusColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono font-black text-3xl text-[#0F172A] leading-none">
                {score}
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-1">
                out of 100
              </span>
            </div>
          </div>
          <span className={`mt-2.5 text-xs font-mono font-bold px-3 py-0.5 rounded-full border ${statusBadgeBg}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* 4 Sub-Score Bars with Plain-Language Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Sub-score 1: Budget */}
        <div className="p-4 rounded-2xl bg-[#DFE4EA] border border-slate-300 space-y-2 shadow-neu-inset-sm">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#0F172A] font-sans">
              <DollarSign className="w-3.5 h-3.5 text-amber-primary" />
              <span>Budget Adherence (35%)</span>
            </div>
            <span className="font-mono font-bold" style={{ color: subScoreColor(budgetScore) }}>
              {budgetScore}/100
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${budgetScore}%`, backgroundColor: subScoreColor(budgetScore) }}
            />
          </div>
          <p className="text-[11px] text-slate-600 leading-snug font-sans">
            {scoreData.explanations?.budget || 'Budget evaluation'}
          </p>
        </div>

        {/* Sub-score 2: Load Balance */}
        <div className="p-4 rounded-2xl bg-[#DFE4EA] border border-slate-300 space-y-2 shadow-neu-inset-sm">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#0F172A] font-sans">
              <Layers className="w-3.5 h-3.5 text-teal-600" />
              <span>Daily Load Balance (25%)</span>
            </div>
            <span className="font-mono font-bold" style={{ color: subScoreColor(loadScore) }}>
              {loadScore}/100
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${loadScore}%`, backgroundColor: subScoreColor(loadScore) }}
            />
          </div>
          <p className="text-[11px] text-slate-600 leading-snug font-sans">
            {scoreData.explanations?.load_balance || 'Daily activity distribution'}
          </p>
        </div>

        {/* Sub-score 3: Conflict Avoidance */}
        <div className="p-4 rounded-2xl bg-[#DFE4EA] border border-slate-300 space-y-2 shadow-neu-inset-sm">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#0F172A] font-sans">
              <Clock className="w-3.5 h-3.5 text-amber-primary" />
              <span>Timing Conflicts (25%)</span>
            </div>
            <span className="font-mono font-bold" style={{ color: subScoreColor(conflictScore) }}>
              {conflictScore}/100
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${conflictScore}%`, backgroundColor: subScoreColor(conflictScore) }}
            />
          </div>
          <p className="text-[11px] text-slate-600 leading-snug font-sans">
            {scoreData.explanations?.conflict || 'Overlap detection'}
          </p>
        </div>

        {/* Sub-score 4: Rest & Buffer */}
        <div className="p-4 rounded-2xl bg-[#DFE4EA] border border-slate-300 space-y-2 shadow-neu-inset-sm">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#0F172A] font-sans">
              <BatteryCharging className="w-3.5 h-3.5 text-teal-600" />
              <span>Rest & Buffer Pacing (15%)</span>
            </div>
            <span className="font-mono font-bold" style={{ color: subScoreColor(bufferScore) }}>
              {bufferScore}/100
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${bufferScore}%`, backgroundColor: subScoreColor(bufferScore) }}
            />
          </div>
          <p className="text-[11px] text-slate-600 leading-snug font-sans">
            {scoreData.explanations?.buffer || 'Rest day and buffer balance'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreGauge;
