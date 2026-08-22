import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import Card from '../../components/shared/Card';

export const DiscoverPage = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
          Discover Destinations & Activities
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore world cities, cost indexes, popularity rankings, and local attractions
        </p>
      </div>

      <Card className="border-dashed border-2 border-slate-300 bg-white/70 p-14 text-center">
        <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-ocean-teal/10 border border-ocean-teal/20 text-xs font-semibold text-ocean-teal mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arriving in Phase 2</span>
        </div>
        <h3 className="text-xl font-bold text-abyss font-display">City & Activity Discovery Catalog</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          Search cities worldwide, filter activities by category and duration, and save favorites directly to your itinerary.
        </p>
      </Card>
    </div>
  );
};

export default DiscoverPage;
