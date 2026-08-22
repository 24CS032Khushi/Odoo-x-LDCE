import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-[#E5EAF0] border border-black/10 rounded-[32px] neu-card text-[#0F172A] overflow-hidden transition-all duration-200 ${
        hover ? 'hover:border-amber-primary/40 hover:-translate-y-1 hover:shadow-neu-extruded-lg' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-7 py-6 border-b border-slate-300/80 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-xl font-extrabold text-[#0F172A] font-display tracking-tight flex items-center gap-1.5 ${className}`} {...props}>
      <span>{children}</span>
      <span className="text-amber-primary">.</span>
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-xs text-slate-500 mt-1 font-sans ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-7 py-6 text-slate-700 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-7 py-5 bg-[#DFE4EA]/60 border-t border-slate-300/80 flex items-center justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Place Photography Card with Bold Place Name Overlaid on Image
 */
export const PhotoCard = ({
  imageUrl,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-[#E5EAF0] text-amber-primary border border-amber-primary/40 font-extrabold shadow-sm',
  matchScore,
  matchReason,
  actionLabel,
  onAction,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  children
}) => {
  return (
    <div
      className={`group relative rounded-[32px] overflow-hidden neu-card border border-black/10 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-neu-extruded-lg ${aspectRatio} ${className}`}
    >
      {/* Edge-to-Edge High Resolution Background Photography */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* Dual Gradient Overlay to Ensure High Contrast for Overlaid Place Name */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />

      {/* Top Badges & AI Match Indicator */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-2">
        {badge ? (
          <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold backdrop-blur-md shadow-md ${badgeColor}`}>
            {badge}
          </span>
        ) : <div />}

        {matchScore && (
          <span className="px-3 py-1 rounded-full text-xs font-display font-extrabold bg-[#0F172A]/90 text-teal-300 border border-teal-400/40 shadow-md flex items-center gap-1 backdrop-blur-md">
            <Sparkles className="w-3 h-3 text-teal-300 animate-pulse" />
            <span>{matchScore}% Match</span>
          </span>
        )}
      </div>

      {/* Bottom Panel with Place Name integrated on the Image */}
      <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 text-white flex flex-col justify-between z-20 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/90 to-transparent pt-8">
        <div>
          <h4 className="font-display font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-snug drop-shadow-md flex items-center gap-1.5">
            <span>{title}</span>
            <span className="text-amber-primary">.</span>
          </h4>
          {subtitle && (
            <p className="text-xs text-slate-200 font-medium mt-1 truncate">
              {subtitle}
            </p>
          )}
          {matchReason && (
            <p className="text-[11px] text-teal-300 font-mono mt-1 truncate">
              💡 {matchReason}
            </p>
          )}
        </div>

        {children && <div className="mt-3">{children}</div>}

        {actionLabel && (
          <div className="mt-3.5 flex justify-end">
            <button
              type="button"
              onClick={onAction}
              className="px-4 py-2 rounded-2xl neu-btn-primary text-xs font-display font-extrabold flex items-center gap-1.5 transition-transform active:scale-95 text-white"
            >
              <span>{actionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
