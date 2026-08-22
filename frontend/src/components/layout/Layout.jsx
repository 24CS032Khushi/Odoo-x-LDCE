import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import BackgroundSlideshow from './BackgroundSlideshow';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-[#CBD5E1] text-[#0F172A] flex flex-col font-sans selection:bg-[#F59E0B] selection:text-white relative overflow-x-hidden">
      {/* Living Atmospheric Travel Photography Slideshow Backdrop */}
      <BackgroundSlideshow />

      {/* Persistent Floating Tactile Navbar */}
      <Navbar />

      {/* Main Content Area with generous top spacing */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 min-w-0">
        <Outlet />
      </main>

      {/* Tactile Neumorphic Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 border-t border-slate-300/80 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans bg-[#E2E8F0]/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="font-display font-extrabold text-[#0F172A]">GlobeTrotter<span className="text-amber-primary">.</span></span>
          <span>&copy; 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
          <span>Odoo x LDCE Hackathon '26</span>
          <span>•</span>
          <span className="text-teal-accent font-bold">🇮🇳 India Focus Edition</span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
