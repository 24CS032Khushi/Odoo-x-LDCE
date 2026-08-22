import React from 'react';
import { AlertTriangle, Clock, Zap, BatteryCharging, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SanityCheckBanner = ({ flag, tripId, onAction, className = '' }) => {
  if (!flag) return null;

  const isAlert = flag.severity === 'alert';
  const borderColor = isAlert ? 'border-l-[#c0392b]' : 'border-l-amber-500';
  const iconBgColor = isAlert ? 'bg-red-50 text-[#c0392b]' : 'bg-amber-50 text-amber-700';

  const getIcon = () => {
    switch (flag.icon) {
      case 'clock':
        return <Clock className="w-4 h-4" />;
      case 'zap':
        return <Zap className="w-4 h-4" />;
      case 'battery-charging':
        return <BatteryCharging className="w-4 h-4" />;
      case 'compass':
        return <Compass className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div
      className={`p-3.5 sm:p-4 rounded-[14px] bg-white border border-slate-200 border-l-4 ${borderColor} shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        <div className={`p-2 rounded-xl flex-shrink-0 ${iconBgColor}`}>
          {getIcon()}
        </div>
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xs text-abyss">
              {flag.title}
            </span>
            {flag.day_number && (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                Day {flag.day_number}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600 leading-snug">
            {flag.message}
          </p>
          <p className="text-[11px] font-medium text-ocean-teal pt-0.5">
            💡 <span className="text-slate-700 font-semibold">Suggested Fix:</span> {flag.suggested_fix}
          </p>
        </div>
      </div>

      {tripId && (
        <div className="self-end sm:self-center flex-shrink-0">
          {flag.action_type === 'reorder_stops' ? (
            <Link
              to={`/trips/${tripId}/builder`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-ocean-teal/10 hover:bg-ocean-teal/20 text-ocean-teal text-xs font-semibold transition-colors"
            >
              <span>Reorder in Builder</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          ) : (
            <Link
              to={`/trips/${tripId}/builder`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
            >
              <span>Adjust Schedule</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default SanityCheckBanner;
