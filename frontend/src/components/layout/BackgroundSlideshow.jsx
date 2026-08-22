import React, { useState, useEffect } from 'react';

const SLIDES = [
  {
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=90',
    title: 'Tropical Azure Coast & Beach'
  },
  {
    url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=2560&q=90',
    title: 'Pangong Lake & Ladakh Himalayas'
  },
  {
    url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2560&q=90',
    title: 'Varanasi Ghats & Sacred Ganga'
  },
  {
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2560&q=90',
    title: 'Goa Coastal Palm Beach'
  },
  {
    url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=2560&q=90',
    title: 'Udaipur Lake Palace & Golden Reflections'
  },
  {
    url: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2560&q=90',
    title: 'Swiss Alps Snow Peaks'
  },
  {
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2560&q=90',
    title: 'Kyoto Ancient Bamboo Shrine'
  },
  {
    url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=2560&q=90',
    title: 'Hawa Mahal Palace, Jaipur'
  }
];

export const BackgroundSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 8000); // 8 seconds per slide

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-slate-900">
      {SLIDES.map((slide, idx) => {
        const isActive = idx === currentIndex;
        return (
          <div
            key={slide.url}
            className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
              isActive ? 'opacity-70' : 'opacity-0'
            }`}
          >
            {/* Crystal Clear HD Image (No Blur, High Visual Fidelity) */}
            <img
              src={slide.url}
              alt={slide.title}
              className={`w-full h-full object-cover object-center transition-transform duration-[9000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>
        );
      })}

      {/* Sheer, Translucent Dark/Frosted Overlay (NOT White/Opaque) */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-slate-950/30" />
    </div>
  );
};

export default BackgroundSlideshow;
