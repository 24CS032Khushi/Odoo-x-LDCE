import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  helperText,
  required = false,
  disabled = false,
  leftIcon: LeftIcon,
  className = '',
  autoComplete,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const isMono = type === 'date' || type === 'number' || type === 'time';

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 flex items-center gap-1">
          {label}
          {required && <span className="text-amber-primary font-bold">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-500">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          className={`w-full text-sm bg-[#DFE4EA] text-[#0F172A] rounded-2xl neu-input transition-all duration-150 outline-none
            ${LeftIcon ? 'pl-10' : 'pl-4'}
            ${isPassword ? 'pr-11' : 'pr-4'}
            py-3
            ${isMono ? 'font-mono' : 'font-sans'}
            ${error
              ? 'border-rose-400/80 focus:border-rose-500 bg-rose-500/10'
              : 'border-slate-300 hover:border-amber-primary/50 focus:border-amber-primary'
            }
            disabled:opacity-40 disabled:cursor-not-allowed
            placeholder:text-slate-500
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 rounded-md text-slate-400 hover:text-amber-primary focus:outline-none transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <div className="flex items-center gap-1 text-xs text-rose-600 font-medium mt-0.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : helperText ? (
        <span className="text-[11px] text-slate-500">{helperText}</span>
      ) : null}
    </div>
  );
};

export default FormInput;
