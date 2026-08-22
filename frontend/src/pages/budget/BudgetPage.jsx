import React from 'react';
import { Wallet, Sparkles } from 'lucide-react';
import Card from '../../components/shared/Card';

export const BudgetPage = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-abyss font-display tracking-tight">
          Budget Breakdown & Analytics
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time expense categorization and over-budget actionable suggestions
        </p>
      </div>

      <Card className="border-dashed border-2 border-slate-300 bg-white/70 p-14 text-center">
        <div className="w-16 h-16 rounded-full bg-ocean-teal/10 text-ocean-teal flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-8 h-8" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-700 mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Arriving in Phase 3</span>
        </div>
        <h3 className="text-xl font-bold text-abyss font-display">Smart Budget & Expense Engine</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-2 leading-relaxed">
          Manage currency in INR (₹) across Transport, Stay, Activities, Meals, and Other categories with real-time health score calculation.
        </p>
      </Card>
    </div>
  );
};

export default BudgetPage;
