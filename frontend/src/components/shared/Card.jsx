import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white border border-slate-200/80 rounded-[20px] shadow-sm overflow-hidden transition-all duration-200 ${
        hover ? 'hover:shadow-md hover:border-slate-300' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-5 border-b border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3 className={`text-lg font-bold text-abyss font-display tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p className={`text-sm text-slate-500 mt-1 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-3 ${className}`} {...props}>
      {children}
    </div>
  );
};

/**
 * Voyare-style Photo Card with bottom translucent glass panel
 * Used for Trips, Cities, and Activities
 */
export const PhotoCard = ({
  imageUrl,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-white/20 text-white',
  actionLabel,
  onAction,
  className = '',
  aspectRatio = 'aspect-[4/3]',
  children
}) => {
  return (
    <div
      className={`group relative rounded-[20px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${aspectRatio} ${className}`}
    >
      {/* Background Cover Photo */}
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
      />

      {/* Top Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/30 to-transparent" />

      {/* Top Badge (if any) */}
      {badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-white/20 shadow-sm ${badgeColor}`}>
            {badge}
          </span>
        </div>
      )}

      {/* Bottom Translucent Glass Panel */}
      <div className="absolute bottom-0 inset-x-0 glass-bottom-panel p-4 sm:p-5 text-white flex flex-col justify-between z-10">
        <div>
          <h4 className="font-display font-bold text-base sm:text-lg text-white tracking-tight leading-snug truncate">
            {title}
          </h4>
          {subtitle && (
            <p className="text-xs text-white/80 mt-0.5 truncate font-medium">
              {subtitle}
            </p>
          )}
        </div>

        {children && <div className="mt-2.5">{children}</div>}

        {actionLabel && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onAction}
              className="px-3.5 py-1.5 rounded-full bg-white text-abyss font-bold text-xs hover:bg-foam transition-colors shadow-sm"
            >
              {actionLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
