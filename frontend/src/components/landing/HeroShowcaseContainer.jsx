import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

const SHOWCASE_SLIDES = [
  {
    name: 'Ladakh & Pangong Tso',
    country: 'India',
    archetype: '🏔️ Alpine Glaciers',
    badgeColor: 'bg-[#0B0F19]/85 border-[#E5B869]/50 text-[#E5B869]',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1400&q=95',
    budget: '₹34,000 avg',
    matchScore: 99,
    description: 'High Altitude Himalayan Passes & Glacial Blue Waters'
  },
  {
    name: 'Goa Coastal Sanctuary',
    country: 'India',
    archetype: '🏖️ Coastal Sun',
    badgeColor: 'bg-[#0B0F19]/85 border-teal-400/50 text-teal-300',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=95',
    budget: '₹22,000 avg',
    matchScore: 98,
    description: 'Turquoise Ocean Waves & Sunset Palm Retreats'
  },
  {
    name: 'Varanasi Ganga Ghats',
    country: 'India',
    archetype: '🪔 Spiritual Heritage',
    badgeColor: 'bg-[#0B0F19]/85 border-amber-400/50 text-amber-300',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1400&q=95',
    budget: '₹12,500 avg',
    matchScore: 99,
    description: 'Ancient Sunrise Boat Rides & Sacred Aarti Ceremonies'
  },
  {
    name: 'Udaipur Lake Palace',
    country: 'India',
    archetype: '🏰 Royal Heritage',
    badgeColor: 'bg-[#0B0F19]/85 border-[#E5B869]/50 text-[#E5B869]',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1400&q=95',
    budget: '₹26,000 avg',
    matchScore: 97,
    description: 'City of Lakes & Golden Marble Palaces'
  },
  {
    name: 'Manali & Solang Valley',
    country: 'India',
    archetype: '❄️ Snow & Adventure',
    badgeColor: 'bg-[#0B0F19]/85 border-cyan-400/50 text-cyan-300',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=95',
    budget: '₹18,000 avg',
    matchScore: 98,
    description: 'Snowy Himalayan Summits & Paragliding'
  },
  {
    name: 'Kyoto Bamboo Grove',
    country: 'Japan',
    archetype: '⛩️ Zen Shrines',
    badgeColor: 'bg-[#0B0F19]/85 border-emerald-400/50 text-emerald-300',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1400&q=95',
    budget: '₹65,000 avg',
    matchScore: 96,
    description: 'Traditional Tea Houses & Shinto Shrines'
  }
];

export const HeroShowcaseContainer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SHOWCASE_SLIDES.length);
    }, 4500); // Rotate every 4.5 seconds

    return () => clearInterval(timer);
  }, []);

  const active = SHOWCASE_SLIDES[currentIndex];

  return (
    <div className="w-full max-w-lg relative group">
      {/* Luxury Ambient Glow Halo */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#E5B869]/30 via-teal-500/20 to-[#E5B869]/30 rounded-[36px] filter blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

      {/* Main Luxury Glass Container */}
      <div
        onClick={() => navigate('/discover')}
        className="relative rounded-[32px] overflow-hidden border border-white/30 shadow-2xl bg-[#0B0F19] aspect-[16/11] cursor-pointer"
      >
        {/* Dynamic Image Slides with Smooth Cross-Fade */}
        {SHOWCASE_SLIDES.map((slide, idx) => {
          const isCurrent = idx === currentIndex;
          return (
            <div
              key={slide.name}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.name}
                className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${
                  isCurrent ? 'scale-105' : 'scale-100'
                }`}
              />
            </div>
          );
        })}

        {/* Dual Gradient Overlay for Readability */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/30 to-transparent" />
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

        {/* Content Inside Container */}
        <div className="absolute inset-0 z-30 p-6 flex flex-col justify-between text-white">
          
          {/* Top Header Row */}
          <div className="flex items-center justify-between gap-2">
            <span className={`px-3.5 py-1 rounded-full border text-xs font-cinzel font-bold backdrop-blur-md shadow-md ${active.badgeColor}`}>
              {active.archetype}
            </span>

            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#0B0F19]/80 border border-[#E5B869]/40 text-[#E5B869] backdrop-blur-md shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E5B869] animate-pulse" />
              <span>{active.matchScore}% Match</span>
            </span>
          </div>

          {/* Bottom Destination Details Row */}
          <div className="space-y-3">
            <div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-md">
                  {active.name}
                </h3>
                <span className="text-xs font-mono font-bold text-[#E5B869] bg-black/50 px-2.5 py-1 rounded-lg border border-[#E5B869]/30">
                  {active.budget}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-sans mt-1 line-clamp-1">
                {active.description}
              </p>
            </div>

            {/* Interactive Destination Selector Dots & Direct Explore CTA */}
            <div className="pt-2 border-t border-white/20 flex items-center justify-between">
              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                {SHOWCASE_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.name}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-6 bg-[#E5B869]'
                        : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                    title={slide.name}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs font-display font-extrabold text-[#E5B869] group-hover:translate-x-1 transition-transform">
                <span>Explore Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroShowcaseContainer;
