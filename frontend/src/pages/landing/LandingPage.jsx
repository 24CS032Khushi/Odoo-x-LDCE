import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane,
  Compass,
  MapPin,
  Sparkles,
  ArrowRight,
  Shield,
  Wallet,
  HeartPulse,
  Flame,
  Globe,
  Sun,
  Mountain,
  Waves,
  ChevronRight,
  Star,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Luxury3DPlane from '../../components/landing/Luxury3DPlane';
import Luxury3DCar from '../../components/landing/Luxury3DCar';
import HeroShowcaseContainer from '../../components/landing/HeroShowcaseContainer';

const LUXURY_BEACH_DESTINATIONS = [
  {
    name: 'Goa Coastal Sanctuary',
    state: 'India',
    vibe: 'Golden Sun & Turquoise Shores',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=95',
    budget: '₹22,000 avg',
    match: '99% Match'
  },
  {
    name: 'Kerala Azure Waters',
    state: 'India',
    vibe: 'Private Houseboats & Palms',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=95',
    budget: '₹28,000 avg',
    match: '98% Match'
  },
  {
    name: 'Santorini Cliffside',
    state: 'Greece',
    vibe: 'Caldera Sunsets & Yachts',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1400&q=95',
    budget: '₹85,000 avg',
    match: '96% Match'
  }
];

const LUXURY_MOUNTAIN_DESTINATIONS = [
  {
    name: 'Ladakh & Pangong Tso',
    state: 'India',
    vibe: 'Himalayan Passes & Glacial Blue',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1400&q=95',
    budget: '₹34,000 avg',
    match: '99% Match'
  },
  {
    name: 'Manali & Solang Valley',
    state: 'India',
    vibe: 'Alpine Peaks & Pine Forests',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=95',
    budget: '₹20,000 avg',
    match: '97% Match'
  },
  {
    name: 'Swiss Alps Summits',
    state: 'Switzerland',
    vibe: 'Glaciers & Luxury Chalets',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1400&q=95',
    budget: '₹1,20,000 avg',
    match: '99% Match'
  }
];

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F8FAFC] flex flex-col font-sans selection:bg-[#E5B869] selection:text-[#0B0F19] relative overflow-x-hidden">
      
      {/* 1. CINEMATIC LUXURY DUAL-WORLD HERO */}
      <div className="relative min-h-[96vh] flex flex-col justify-between overflow-hidden bg-[#0B0F19]">
        
        {/* Full-Bleed 4K Crystal Clear Photography (Turquoise Beach & Alpine Horizon) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=95"
            alt="Luxury turquoise coastal waters and distant mountain peaks"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.78] contrast-105"
          />
          {/* Subtle Obsidian & Gold Velvet Shading */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-black/40 to-black/75" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/50" />
        </div>

        {/* 2. FLOATING OBSIDIAN GLASS NAVBAR */}
        <header className="relative z-30 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6">
          <nav className="glass-navbar-floating text-white px-7 py-4 rounded-2xl flex items-center justify-between shadow-2xl backdrop-blur-2xl bg-[#0B0F19]/60 border border-white/20">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#E5B869] to-[#B4833E] text-[#0B0F19] flex items-center justify-center transition-transform group-hover:scale-105 shadow-luxury-glow">
                <Plane className="w-5 h-5 transform -rotate-45 fill-[#0B0F19]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-2xl font-bold tracking-tight text-white flex items-center gap-1">
                  GlobeTrotter<span className="text-[#E5B869]">.</span>
                </span>
                <span className="font-cinzel text-[9px] uppercase tracking-[0.25em] text-[#E5B869] -mt-1 font-bold">
                  Bespoke Luxury
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-xs font-display font-bold tracking-wider text-slate-200">
              <a href="#destinations" className="hover:text-[#E5B869] transition-colors uppercase">Beaches & Mountains</a>
              <a href="#intelligence" className="hover:text-[#E5B869] transition-colors uppercase">Intelligence</a>
              <Link to="/discover" className="hover:text-[#E5B869] transition-colors uppercase">Live Catalog</Link>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B869] to-[#D97706] text-[#0B0F19] text-xs font-display font-black shadow-luxury-glow transition-transform active:scale-95"
                >
                  Open Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl text-xs font-display font-bold text-slate-200 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5B869] to-[#D97706] text-[#0B0F19] text-xs font-display font-black shadow-luxury-glow hover:brightness-110 transition-transform active:scale-95"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>

        {/* --- SLEEK 3D LUXURY JET AIRCRAFT (FLYING IN OPEN SKY CLEARLY BELOW THE NAVBAR) --- */}
        <div className="absolute top-20 sm:top-24 left-0 w-full pointer-events-none z-20 overflow-hidden h-28 sm:h-36">
          <Luxury3DPlane />
        </div>

        {/* 3. HERO CONTENT: EDITORIAL LUXURY, MINIMAL WORDS, MAXIMUM IMPACT */}
        <div className="relative z-20 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-14 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Hero Text Block */}
          <div className="space-y-7 max-w-2xl text-left text-white">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B0F19]/80 border border-[#E5B869]/40 backdrop-blur-md text-xs font-cinzel font-bold text-[#E5B869] tracking-wider shadow-lg">
              <Award className="w-3.5 h-3.5 text-[#E5B869]" />
              <span>THE ART OF MODERN TRAVEL • INDIA & THE WORLD</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal text-white tracking-tight leading-[1.02] drop-shadow-2xl">
              Curated Routes.<br />
              <span className="font-serif italic font-light text-[#E5B869]">Infinite</span> Horizons<span className="text-[#E5B869]">.</span>
            </h1>

            <p className="text-slate-200 text-base sm:text-xl font-sans max-w-lg leading-relaxed drop-shadow-md">
              Bespoke multi-destination journeys from sun-drenched Indian coasts to snowy Himalayan summits. Real-time INR (₹) luxury budget intelligence.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link to="/signup">
                <button
                  type="button"
                  className="px-9 py-4 rounded-2xl bg-gradient-to-r from-[#E5B869] via-[#F59E0B] to-[#D97706] text-[#0B0F19] font-display font-black text-base flex items-center gap-2.5 shadow-luxury-glow transition-all hover:scale-105 active:scale-95"
                >
                  <span>Plan First Voyage — Free</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </button>
              </Link>

              <Link to="/discover">
                <button
                  type="button"
                  className="px-8 py-4 rounded-2xl bg-[#0B0F19]/70 hover:bg-[#0B0F19]/90 text-white font-display font-extrabold text-base backdrop-blur-xl border border-white/30 transition-all shadow-2xl flex items-center gap-2.5"
                >
                  <Compass className="w-5 h-5 text-[#E5B869]" />
                  <span>Discover Catalog</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Hero Visual Showcase: Dynamic Rotating Luxury Container */}
          <div className="relative w-full max-w-md hidden lg:block">
            <HeroShowcaseContainer />
          </div>
        </div>

        {/* --- PROPORTIONAL 3D LUXURY 4x4 OVERLAND SUV ON SCENIC HIGHWAY (100% VISIBLE & SLOWER) --- */}
        <div className="relative w-full border-t border-white/15 bg-gradient-to-b from-[#0B0F19]/90 via-[#151D2F] to-[#0B0F19] pt-2 pb-5 overflow-hidden">
          
          {/* Scenic Waypoints */}
          <div className="max-w-6xl mx-auto px-4 flex items-center justify-between text-[11px] font-cinzel font-bold tracking-widest text-[#E5B869] mb-1.5">
            <span>• AHMEDABAD</span>
            <span>• JAIPUR</span>
            <span>• GOA</span>
            <span>• VARANASI</span>
            <span>• LADAKH</span>
            <span>• KYOTO</span>
          </div>

          {/* Fully Visible Highway Stage with Full Clearance for Proportional 3D Car */}
          <div className="relative min-h-[120px] sm:min-h-[135px] w-full flex items-end">
            
            {/* Asphalt Highway Surface */}
            <div className="absolute bottom-0 inset-x-0 h-8 bg-[#05070B] border-t border-b border-[#E5B869]/30 shadow-2xl flex items-center">
              <div className="w-full border-t border-dashed border-[#E5B869]/70 opacity-90" />
            </div>

            {/* Completely Unclipped, Sleek Proportional 3D Luxury 4x4 SUV (Slower 32s Cruise) */}
            <div className="relative w-full z-20">
              <Luxury3DCar />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CRYSTAL CLEAR HD EDITORIAL SHOWCASE: BEACHES & MOUNTAINS */}
      <section id="destinations" className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-24 space-y-12">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-white/15 pb-6">
          <div className="space-y-2">
            <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#E5B869] font-bold">
              CURATED VOYAGES
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-normal text-white tracking-tight">
              Bespoke Escapes<span className="text-[#E5B869]">.</span>
            </h2>
          </div>

          {/* Luxury Switcher */}
          <div className="flex items-center gap-2 bg-[#151D2F] p-1.5 rounded-2xl border border-white/15 shadow-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl text-xs font-display font-extrabold transition-all ${
                activeTab === 'all'
                  ? 'bg-[#E5B869] text-[#0B0F19] shadow-luxury-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Worlds
            </button>
            <button
              onClick={() => setActiveTab('beaches')}
              className={`px-5 py-2.5 rounded-xl text-xs font-display font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'beaches'
                  ? 'bg-[#E5B869] text-[#0B0F19] shadow-luxury-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>🏖️ Beaches</span>
            </button>
            <button
              onClick={() => setActiveTab('mountains')}
              className={`px-5 py-2.5 rounded-xl text-xs font-display font-extrabold flex items-center gap-2 transition-all ${
                activeTab === 'mountains'
                  ? 'bg-[#E5B869] text-[#0B0F19] shadow-luxury-glow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Mountain className="w-4 h-4" />
              <span>🏔️ Mountains</span>
            </button>
          </div>
        </div>

        {/* 1. Coastal Luxury Grid */}
        {(activeTab === 'all' || activeTab === 'beaches') && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-cinzel font-bold text-[#E5B869] tracking-wider uppercase">
              <Waves className="w-4 h-4 text-teal-400" />
              <span>Coastal Sanctuaries & Turquoise Horizons</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {LUXURY_BEACH_DESTINATIONS.map((dest) => (
                <div
                  key={dest.name}
                  onClick={() => navigate('/discover')}
                  className="overflow-hidden group cursor-pointer aspect-[4/3] relative rounded-[32px] border border-white/20 shadow-2xl hover:-translate-y-2 hover:border-[#E5B869]/50 transition-all duration-300 bg-[#0B0F19]"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/95 via-[#0B0F19]/30 to-transparent p-6 flex flex-col justify-between text-white">
                    <span className="self-start px-3.5 py-1 rounded-full bg-[#0B0F19]/85 border border-[#E5B869]/40 text-[#E5B869] text-xs font-mono font-bold">
                      {dest.match}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">{dest.name}</h3>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">{dest.state} • {dest.budget}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. Mountain Luxury Grid */}
        {(activeTab === 'all' || activeTab === 'mountains') && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center gap-2 text-sm font-cinzel font-bold text-[#E5B869] tracking-wider uppercase">
              <Mountain className="w-4 h-4 text-[#E5B869]" />
              <span>Alpine Summits & High Altitude Glaciers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {LUXURY_MOUNTAIN_DESTINATIONS.map((dest) => (
                <div
                  key={dest.name}
                  onClick={() => navigate('/discover')}
                  className="overflow-hidden group cursor-pointer aspect-[4/3] relative rounded-[32px] border border-white/20 shadow-2xl hover:-translate-y-2 hover:border-[#E5B869]/50 transition-all duration-300 bg-[#0B0F19]"
                >
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/95 via-[#0B0F19]/30 to-transparent p-6 flex flex-col justify-between text-white">
                    <span className="self-start px-3.5 py-1 rounded-full bg-[#0B0F19]/85 border border-[#E5B869]/40 text-[#E5B869] text-xs font-mono font-bold">
                      {dest.match}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-white">{dest.name}</h3>
                      <p className="text-xs text-slate-300 font-sans mt-0.5">{dest.state} • {dest.budget}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. FOUR CORE INTELLIGENCE PILLARS (LUXURY BENTO GRID) */}
      <section id="intelligence" className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-3xl bg-[#151D2F] border border-white/15 space-y-3 text-center shadow-2xl hover:border-[#E5B869]/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#0B0F19] text-[#E5B869] flex items-center justify-center mx-auto border border-[#E5B869]/30 shadow-lg">
              <Compass className="w-7 h-7" />
            </div>
            <h4 className="font-serif font-bold text-lg text-white">Multi-City Routes</h4>
            <p className="text-xs text-slate-400 font-sans">Chronological day timelines & order</p>
          </div>

          <div className="p-7 rounded-3xl bg-[#151D2F] border border-white/15 space-y-3 text-center shadow-2xl hover:border-[#E5B869]/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#0B0F19] text-teal-400 flex items-center justify-center mx-auto border border-teal-400/30 shadow-lg">
              <Wallet className="w-7 h-7" />
            </div>
            <h4 className="font-serif font-bold text-lg text-white">5-Bucket INR Budget</h4>
            <p className="text-xs text-slate-400 font-sans">Stays, food, transit, entry, buffer</p>
          </div>

          <div className="p-7 rounded-3xl bg-[#151D2F] border border-white/15 space-y-3 text-center shadow-2xl hover:border-[#E5B869]/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#0B0F19] text-rose-400 flex items-center justify-center mx-auto border border-rose-400/30 shadow-lg">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h4 className="font-serif font-bold text-lg text-white">Health Score 0-100</h4>
            <p className="text-xs text-slate-400 font-sans">Pacing & transit safety audit</p>
          </div>

          <div className="p-7 rounded-3xl bg-[#151D2F] border border-white/15 space-y-3 text-center shadow-2xl hover:border-[#E5B869]/40 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-[#0B0F19] text-[#E5B869] flex items-center justify-center mx-auto border border-[#E5B869]/30 shadow-lg">
              <Globe className="w-7 h-7" />
            </div>
            <h4 className="font-serif font-bold text-lg text-white">Live Places API</h4>
            <p className="text-xs text-slate-400 font-sans">Global geocoding for any city</p>
          </div>
        </div>
      </section>

      {/* 4. LUXURY CTA BANNER */}
      <section className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-16">
        <div className="p-10 sm:p-16 rounded-[40px] bg-gradient-to-br from-[#151D2F] via-[#0B0F19] to-[#05070B] border border-[#E5B869]/40 shadow-2xl text-center space-y-7 relative overflow-hidden">
          <div className="max-w-xl mx-auto space-y-3">
            <span className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#E5B869] font-bold">
              START YOUR ADVENTURE
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-normal text-white tracking-tight">
              Ready to take flight<span className="text-[#E5B869]">?</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-300 font-sans">
              Experience the definitive luxury travel planner. Free forever for explorers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
            <Link to="/signup">
              <button
                type="button"
                className="px-9 py-4 rounded-2xl bg-gradient-to-r from-[#E5B869] via-[#F59E0B] to-[#D97706] text-[#0B0F19] font-display font-black text-base shadow-luxury-glow transition-all hover:scale-105 active:scale-95"
              >
                Create First Journey — Free
              </button>
            </Link>
            <Link to="/login">
              <button
                type="button"
                className="px-8 py-4 rounded-2xl bg-[#0B0F19] hover:bg-white/10 text-white font-display font-extrabold text-base border border-white/30 transition-all"
              >
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 border-t border-white/15 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-white text-base">GlobeTrotter<span className="text-[#E5B869]">.</span></span>
          <span>&copy; 2026. Bespoke Travel Operating System.</span>
        </div>
        <div className="flex items-center gap-3 font-cinzel text-[11px] text-slate-400">
          <span>Odoo x LDCE Hackathon '26</span>
          <span>•</span>
          <span className="text-[#E5B869] font-bold">🇮🇳 India Focus Edition</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
