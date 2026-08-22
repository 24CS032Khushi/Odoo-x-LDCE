import React from 'react';

export const Luxury3DCar = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none select-none w-full overflow-visible ${className}`}>
      {/* Slower, Graceful Highway Driving Motion (32s loop) */}
      <div className="animate-drive-highway-slow relative flex items-center">
        
        {/* Proportional Luxury Overland Vehicle Container */}
        <div className="animate-car-bounce relative w-56 sm:w-68 md:w-76 h-24 sm:h-28">
          
          {/* Ground Asphalt Drop Shadow */}
          <div className="absolute bottom-1 left-6 right-5 h-4 bg-black/85 rounded-full filter blur-[5px] -z-10" />

          {/* 3D Sleek Luxury Overland 4x4 Vehicle */}
          <svg
            viewBox="0 0 420 180"
            className="w-full h-full filter drop-shadow-[0_12px_20px_rgba(0,0,0,0.85)]"
          >
            <defs>
              {/* Luxury Obsidian / Satin Bronze Gradient */}
              <linearGradient id="carBodySleek" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="35%" stopColor="#1E293B" />
                <stop offset="75%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>

              {/* Gold Trim */}
              <linearGradient id="carGoldSleek" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#FDE68A" />
                <stop offset="80%" stopColor="#E5B869" />
                <stop offset="100%" stopColor="#92400E" />
              </linearGradient>

              {/* 3D Privacy Tint Glass */}
              <linearGradient id="carGlassSleek" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#1E293B" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0F172A" stopOpacity="1" />
              </linearGradient>

              {/* Headlight Beam Cone */}
              <linearGradient id="carLightCone" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
                <stop offset="35%" stopColor="#FDE047" stopOpacity="0.45" />
                <stop offset="80%" stopColor="#E5B869" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#E5B869" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Projector Headlight Beam Cone */}
            <polygon points="370,118 420,80 420,170 370,145" fill="url(#carLightCone)" />

            {/* Sleek Rooftop Expedition Rack & Surfboard */}
            <rect x="110" y="32" width="190" height="6" rx="3" fill="#475569" stroke="#1E293B" />
            <rect x="130" y="38" width="6" height="10" fill="#1E293B" />
            <rect x="280" y="38" width="6" height="10" fill="#1E293B" />
            {/* Aerodynamic Carbon Surfboard */}
            <ellipse cx="205" cy="24" rx="80" ry="7.5" fill="url(#carGoldSleek)" stroke="#FFFFFF" strokeWidth="1" />
            <path d="M130,24 Q205,17 280,24" stroke="#0D9488" strokeWidth="2" fill="none" />
            {/* Weatherproof Cargo Trunk */}
            <rect x="140" y="18" width="38" height="14" rx="3" fill="#0D9488" stroke="#134E4A" />

            {/* 3D Sleek SUV Body Chassis */}
            <path
              d="M55,142 L48,96 L80,56 L150,48 L300,48 L355,90 L385,100 L392,142 Z"
              fill="url(#carBodySleek)"
              stroke="#475569"
              strokeWidth="1.5"
            />

            {/* Hood & Fender Accent Line */}
            <path d="M300,48 L355,90 L392,100 L388,125 L295,125 Z" fill="#1E293B" opacity="0.6" />
            <path d="M355,90 L385,100 L380,114 L350,104 Z" fill="url(#carGoldSleek)" />

            {/* Privacy Glass Panels with Gold Trim */}
            <path d="M90,62 L140,56 L205,56 L205,98 L85,98 Z" fill="url(#carGlassSleek)" stroke="#E5B869" strokeWidth="1" />
            <path d="M212,56 L290,56 L335,92 L290,98 L212,98 Z" fill="url(#carGlassSleek)" stroke="#E5B869" strokeWidth="1" />

            {/* Door Cut Line & Handles */}
            <line x1="208" y1="56" x2="208" y2="136" stroke="#0B0F19" strokeWidth="2.5" />
            <rect x="188" y="106" width="16" height="4" rx="2" fill="url(#carGoldSleek)" />
            <rect x="265" y="106" width="16" height="4" rx="2" fill="url(#carGoldSleek)" />

            {/* Front Projector LED Headlight */}
            <polygon points="380,102 392,106 388,124 376,120" fill="#FFFFFF" />
            <circle cx="384" cy="113" r="4.5" fill="#FEF08A" className="animate-glow" />

            {/* Rear Tail Light */}
            <rect x="46" y="100" width="7" height="22" rx="3.5" fill="#EF4444" />

            {/* Wheel Arch Fenders */}
            <path d="M72,142 C72,114 142,114 142,142 Z" fill="#0B0F19" stroke="#334155" strokeWidth="1.5" />
            <path d="M288,142 C288,114 358,114 358,142 Z" fill="#0B0F19" stroke="#334155" strokeWidth="1.5" />

            {/* Rear All-Terrain Wheel */}
            <g transform="translate(107, 142)">
              <circle cx="0" cy="0" r="30" fill="#020617" stroke="#475569" strokeWidth="5" />
              <circle cx="0" cy="0" r="22" fill="#1E293B" />
              <g className="animate-wheel-spin">
                <circle cx="0" cy="0" r="14" fill="none" stroke="url(#carGoldSleek)" strokeWidth="3.5" />
                <line x1="-15" y1="0" x2="15" y2="0" stroke="url(#carGoldSleek)" strokeWidth="2.5" />
                <line x1="0" y1="-15" x2="0" y2="15" stroke="url(#carGoldSleek)" strokeWidth="2.5" />
                <line x1="-11" y1="-11" x2="11" y2="11" stroke="url(#carGoldSleek)" strokeWidth="2.5" />
                <line x1="-11" y1="11" x2="11" y2="-11" stroke="url(#carGoldSleek)" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="5" fill="#F59E0B" />
              </g>
            </g>

            {/* Front All-Terrain Wheel */}
            <g transform="translate(323, 142)">
              <circle cx="0" cy="0" r="30" fill="#020617" stroke="#475569" strokeWidth="5" />
              <circle cx="0" cy="0" r="22" fill="#1E293B" />
              <g className="animate-wheel-spin">
                <circle cx="0" cy="0" r="14" fill="none" stroke="url(#carGoldSleek)" strokeWidth="3.5" />
                <line x1="-15" y1="0" x2="15" y2="0" stroke="url(#carGoldSleek)" strokeWidth="2.5" />
                <line x1="0" y1="-15" x2="0" y2="15" stroke="url(#carGoldSleek)" strokeWidth="2.5" />
                <line x1="-11" y1="-11" x2="11" y2="11" stroke="url(#carGoldSleek)" strokeWidth="2.5" />
                <line x1="-11" y1="11" x2="11" y2="-11" stroke="url(#carGoldSleek)" strokeWidth="2.5" />
                <circle cx="0" cy="0" r="5" fill="#F59E0B" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Luxury3DCar;
