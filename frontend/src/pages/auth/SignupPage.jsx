import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, X, Shield, ArrowDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/shared/Button';
import Navbar from '../../components/layout/Navbar';

// Cinematic aerial island travel hero image
const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85';

export const SignupPage = () => {
  const { signup } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordCriteria = useMemo(() => {
    const pwd = formData.password;
    return [
      { label: 'At least 6 characters', valid: pwd.length >= 6 },
      { label: 'Contains letters', valid: /[a-zA-Z]/.test(pwd) },
      { label: 'Contains a number or symbol', valid: /[0-9!@#$%^&*(),.?":{}|<>]/.test(pwd) },
    ];
  }, [formData.password]);

  const strengthScore = useMemo(() => {
    return passwordCriteria.filter((c) => c.valid).length;
  }, [passwordCriteria]);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const user = await signup(formData.name.trim(), formData.email.trim(), formData.password);
      success(`Welcome to GlobeTrotter, ${user.name}! Your account is ready.`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toastError(err.message || 'Signup failed. Please try again.');
      setErrors({ form: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-abyss">
      {/* Full-Bleed Cinematic Photography Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={HERO_IMAGE_URL}
          alt="Cinematic aerial island travel photography"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Dark Ocean Gradient & Contrast Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-ocean-deep/35 to-abyss/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/75 via-abyss/30 to-transparent" />
      </div>

      {/* Floating Glass Navbar */}
      <Navbar />

      {/* Main Cinematic Hero Content & Glass Signup Form */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: 3-Line Space Grotesk Bold Headline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-control text-white text-xs font-semibold tracking-wide shadow-sm">
              <span>🌟 Start Your Journey</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-[64px] font-bold text-white leading-[1.06] tracking-tight drop-shadow-md">
              Begin Your<br />
              Smart Travel Story<br />
              <span className="text-white/95">with GlobeTrotter</span>
            </h1>

            <p className="text-white/85 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed drop-shadow-sm">
              Design multi-city itineraries, allocate budgets with confidence, and discover curated global adventures.
            </p>
          </div>

          {/* Right Column: Floating Glass Card */}
          <div className="lg:col-span-5 w-full max-w-[390px] mx-auto lg:ml-auto">
            <div className="glass-card-elevated p-6 sm:p-8">
              <div className="mb-5">
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  Create Your Account
                </h2>
                <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                  Join GlobeTrotter Smart to organize your trips
                </p>
              </div>

              <form className="space-y-3" onSubmit={handleSubmit} noValidate>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/90">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Khushi Patel"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-sm bg-white text-abyss border-0 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-ocean-teal shadow-inner placeholder:text-slate-400 font-medium"
                    required
                  />
                  {errors.name && (
                    <p className="text-xs text-rose-300 font-medium">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/90">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-sm bg-white text-abyss border-0 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-ocean-teal shadow-inner placeholder:text-slate-400 font-medium"
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-300 font-medium">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/90">Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full text-sm bg-white text-abyss border-0 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-ocean-teal shadow-inner placeholder:text-slate-400 font-medium"
                    required
                  />
                  {errors.password && (
                    <p className="text-xs text-rose-300 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Password Strength */}
                {formData.password && (
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/10 space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-white/90">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-ocean-tint" />
                        Strength:
                      </span>
                      <span className={strengthScore === 3 ? 'text-emerald-300' : strengthScore === 2 ? 'text-amber-300' : 'text-rose-300'}>
                        {strengthScore === 3 ? 'Strong' : strengthScore === 2 ? 'Fair' : 'Weak'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 h-1 w-full">
                      <div className={`h-full rounded-full ${strengthScore >= 1 ? (strengthScore === 1 ? 'bg-rose-400' : strengthScore === 2 ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-white/20'}`} />
                      <div className={`h-full rounded-full ${strengthScore >= 2 ? (strengthScore === 2 ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-white/20'}`} />
                      <div className={`h-full rounded-full ${strengthScore === 3 ? 'bg-emerald-400' : 'bg-white/20'}`} />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-white/90">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full text-sm bg-white text-abyss border-0 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-ocean-teal shadow-inner placeholder:text-slate-400 font-medium"
                    required
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-rose-300 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>

                {errors.form && (
                  <div className="p-3 bg-rose-500/25 border border-rose-400/40 text-rose-100 text-xs rounded-xl font-medium">
                    {errors.form}
                  </div>
                )}

                {/* Pure White Pill CTA Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="white"
                    size="lg"
                    className="w-full py-3 text-sm tracking-tight font-bold shadow-lg"
                    isLoading={isSubmitting}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Create Account
                  </Button>
                </div>
              </form>

              <div className="mt-5 pt-4 border-t border-white/10 text-center">
                <p className="text-xs text-white/75">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-white hover:underline underline-offset-4">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Row */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="text-xs text-white/50">
          <span>GlobeTrotter Smart &copy; 2026</span>
        </div>

        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full glass-navbar-floating flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all shadow-md active:scale-95"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};

export default SignupPage;
