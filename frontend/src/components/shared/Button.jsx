import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  // Pure white pill with abyss text (for dark/photo hero surfaces)
  white: 'bg-white hover:bg-foam text-abyss font-bold shadow-md hover:shadow-lg active:scale-98 focus-visible:ring-white border border-white/20',
  // Solid abyss pill (standard primary on light foam surfaces)
  primary: 'bg-abyss hover:bg-ocean-deep text-white font-semibold shadow-sm hover:shadow active:scale-98 focus-visible:ring-abyss',
  // Translucent dark glass pill
  glass: 'glass-pill-control text-white font-medium hover:text-white active:scale-98 focus-visible:ring-white/50',
  // Light foam pill
  secondary: 'bg-foam hover:bg-slate-200/80 text-abyss font-semibold active:bg-slate-300 focus-visible:ring-ocean-teal border border-slate-200',
  // Outline pill
  outline: 'border border-slate-300 hover:border-abyss bg-transparent hover:bg-black/5 text-abyss font-medium active:bg-slate-100 focus-visible:ring-abyss',
  // Danger pill
  danger: 'bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm hover:shadow active:scale-98 focus-visible:ring-rose-500',
  // Ghost pill
  ghost: 'text-slate-600 hover:text-abyss hover:bg-black/5 active:bg-black/10 focus-visible:ring-slate-400',
};

const sizes = {
  sm: 'text-xs px-4 py-1.5 gap-1.5',
  md: 'text-sm px-5 py-2.5 gap-2',
  lg: 'text-base px-7 py-3 gap-2.5',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full tracking-tight transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
