import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loader = ({ size = 'md', className = '', label = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-16 h-16',
  }[size] || 'w-6 h-6';

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className={`animate-spin text-brand-600 ${sizeClasses}`} />
      {label && <p className="text-sm font-medium text-slate-500 animate-pulse">{label}</p>}
    </div>
  );
};

export const FullPageLoader = ({ label = 'Loading GlobeTrotter...' }) => {
  return (
    <div className="fixed inset-0 bg-slate-50/80 backdrop-blur-xs flex flex-col items-center justify-center z-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center gap-4 max-w-xs text-center">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center">
          <Loader2 className="w-7 h-7 animate-spin text-brand-600" />
        </div>
        <div>
          <h4 className="font-semibold text-slate-800 text-sm">GlobeTrotter Smart</h4>
          <p className="text-xs text-slate-500 mt-1">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;
