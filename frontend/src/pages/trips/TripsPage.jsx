import React from 'react';
import { MapPin, Sparkles, Plus } from 'lucide-react';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

export const TripsPage = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">My Trips</h1>
          <p className="text-sm text-slate-500 mt-1">Multi-city itineraries and saved trip collections</p>
        </div>
        <Button variant="primary" size="md" icon={Plus} onClick={() => alert('Phase 2 trip creator')}>
          New Trip
        </Button>
      </div>

      <Card className="border-dashed border-2 border-slate-300 bg-white/70 p-14 text-center">
        <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ocean-teal/10 border border-ocean-teal/20 text-xs font-semibold text-ocean-teal mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arriving in Phase 2</span>
        </div>
        <h3 className="text-xl font-bold text-abyss font-display">Trip Creation & Management Engine</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          In Phase 2, you'll be able to create custom multi-city journeys, set dates, configure budgets, and generate shareable public links.
        </p>
      </Card>
    </div>
  );
};

export default TripsPage;
