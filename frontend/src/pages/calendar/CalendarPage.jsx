import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import Card from '../../components/shared/Card';

export const CalendarPage = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
          Trip Calendar & Timeline
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Multi-destination calendar view, buffer time analysis, and schedule conflict alerts
        </p>
      </div>

      <Card className="border-dashed border-2 border-slate-300 bg-white/70 p-14 text-center">
        <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-700 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arriving in Phase 3</span>
        </div>
        <h3 className="text-xl font-bold text-abyss font-display">Timeline & Conflict Visualizer</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          Interactive calendar and timeline spanning your multi-city stops with automated schedule conflict detection and buffer analysis.
        </p>
      </Card>
    </div>
  );
};

export default CalendarPage;
