import React from 'react';
import { Loader2 } from 'lucide-react';

const variants = {
  // Primary Tactile: Amber Extruded -> Inset on :active
  primary: 'neu-btn-primary rounded-2xl',
  white: 'neu-btn-primary rounded-2xl',
  
  // Secondary Tactile: Surface Extruded -> Inset on :active
  secondary: 'neu-btn-secondary rounded-2xl',
  glass: 'neu-btn-secondary rounded-2xl',

  // Subtle Inset Well Button
  inset: 'neu-inset text-white hover:text-amber-primary font-bold rounded-2xl border border-white/10 hover:border-amber-primary/40 active:scale-98',

  // Outline Tactile
  outline: 'border border-amber-primary/40 hover:border-amber-primary bg-[#1F2A3A]/60 hover:bg-[#1F2A3A] text-white font-bold rounded-2xl active:scale-98 shadow-neu-extruded-sm',

  // Danger Button
  danger: 'bg-rose-600/90 hover:bg-rose-600 text-white font-bold rounded-2xl shadow-neu-extruded-sm active:shadow-neu-inset-sm border border-rose-400/30',

  // Ghost Button
  ghost: 'text-slate-300 hover:text-white hover:bg-white/10 rounded-2xl active:bg-white/15',
};

const sizes = {
  sm: 'text-xs px-4 py-2 gap-1.5 font-bold',
  md: 'text-sm px-5 py-2.5 gap-2 font-bold',
  lg: 'text-base px-7 py-3.5 gap-2.5 font-bold',
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
  const baseClasses = 'inline-flex items-center justify-center tracking-tight transition-all duration-150 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';
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
