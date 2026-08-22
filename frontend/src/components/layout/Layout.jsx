import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-foam text-abyss flex flex-col font-sans selection:bg-ocean-teal selection:text-white">
      {/* Persistent Floating Glass Navbar */}
      <Navbar />

      {/* Main Content Area on Clean Foam Background */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 min-w-0">
        <Outlet />
      </main>

      {/* Clean Light Footer */}
      <footer className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-200/60 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <span>GlobeTrotter Smart &copy; 2026. All rights reserved.</span>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Odoo x LDCE Hackathon '26</span>
          <span>•</span>
          <span className="text-ocean-teal font-semibold">Phase 1 Foundation</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
