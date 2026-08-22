import React from 'react';

export const Luxury3DPlane = ({ className = '' }) => {
  return (
    <div className={`relative pointer-events-none select-none w-full overflow-visible ${className}`}>
      {/* High-Altitude Elegant Cruise Flight Motion */}
      <div className="animate-flight-jet relative flex items-center">
        
        {/* Slender Dual High-Altitude Vapor Contrails */}
        <div className="absolute right-[85%] top-[46%] w-[240px] sm:w-[380px] h-[3px] bg-gradient-to-l from-white/80 via-white/30 to-transparent rounded-full filter blur-[1px] -z-10" />
        <div className="absolute right-[85%] top-[56%] w-[200px] sm:w-[300px] h-[2.5px] bg-gradient-to-l from-white/70 via-white/20 to-transparent rounded-full filter blur-[1px] -z-10" />

        {/* Sleek Aerodynamic 3D Executive Jet Aircraft */}
        <div className="w-56 sm:w-72 md:w-80 h-20 sm:h-26 relative flex items-center justify-center filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.7)]">
          <svg
            viewBox="0 0 400 160"
            className="w-full h-full transform -rotate-2"
          >
            <defs>
              {/* Metallic Fuselage Gradient */}
              <linearGradient id="fuselageSleek" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#F8FAFC" />
                <stop offset="65%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>

              {/* Gold Luxury Trim */}
              <linearGradient id="goldSleek" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FFFBEB" />
                <stop offset="40%" stopColor="#FDE68A" />
                <stop offset="75%" stopColor="#E5B869" />
                <stop offset="100%" stopColor="#B4833E" />
              </linearGradient>

              {/* Swept Wing Gradient */}
              <linearGradient id="wingSleek" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="50%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>

            {/* Far Wing in 3D Perspective */}
            <polygon points="220,60 140,15 160,14 260,56" fill="url(#wingSleek)" opacity="0.8" />

            {/* Far Engine */}
            <rect x="180" y="44" width="45" height="14" rx="7" fill="#1E293B" stroke="#475569" strokeWidth="1" />
            <circle cx="182" cy="51" r="5" fill="#F59E0B" opacity="0.85" />

            {/* Slender Aerodynamic Fuselage */}
            <path
              d="M380,80 C340,64 200,62 100,68 C45,72 15,82 5,88 C20,96 100,104 230,98 C330,94 370,88 380,80 Z"
              fill="url(#fuselageSleek)"
              stroke="#94A3B8"
              strokeWidth="0.8"
            />

            {/* Luxury Gold Streamline Stripe */}
            <path
              d="M360,79 C310,71 180,70 120,76 L128,80 C190,75 310,76 358,83 Z"
              fill="url(#goldSleek)"
            />

            {/* Cockpit 3D Tinted Glass */}
            <path
              d="M360,77 C345,71 325,72 315,75 L322,80 C335,77 352,77 360,77 Z"
              fill="#0F172A"
              stroke="#E5B869"
              strokeWidth="1"
            />

            {/* Cabin Porthole Windows */}
            {[295, 275, 255, 235, 215, 195, 175, 155, 135].map((x, i) => (
              <rect
                key={i}
                x={x}
                y="74"
                width="9"
                height="6"
                rx="3"
                fill="#0F172A"
                stroke="#E5B869"
                strokeWidth="0.7"
              />
            ))}

            {/* Vertical Tail Fin & Stabilizer */}
            <polygon points="100,68 40,8 65,8 145,66" fill="url(#wingSleek)" />
            <polygon points="58,16 48,11 63,11" fill="url(#goldSleek)" />
            {/* Horizontal Tail */}
            <polygon points="85,84 35,88 40,80 95,78" fill="url(#wingSleek)" />

            {/* Near Swept Wing with Vertical Gold Winglet */}
            <polygon points="260,86 150,150 180,155 310,90" fill="url(#wingSleek)" />
            <polygon points="150,150 145,130 154,132 160,152" fill="url(#goldSleek)" />
            <circle cx="147" cy="130" r="2.5" fill="#EF4444" className="animate-pulse" />

            {/* Near Jet Turbine with Glowing Thrust */}
            <g transform="translate(210, 95)">
              <rect x="0" y="0" width="58" height="22" rx="11" fill="#0F172A" stroke="#64748B" strokeWidth="1.2" />
              <rect x="7" y="3" width="44" height="16" rx="8" fill="url(#fuselageSleek)" />
              {/* Glowing Afterburner Exhaust */}
              <circle cx="4" cy="11" r="7" fill="#0D9488" />
              <circle cx="2" cy="11" r="5" fill="#F59E0B" className="animate-glow" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Luxury3DPlane;
