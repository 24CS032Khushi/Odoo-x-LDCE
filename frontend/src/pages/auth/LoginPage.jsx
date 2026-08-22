import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, CheckCircle2, ArrowDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import FormInput from '../../components/shared/FormInput';
import Navbar from '../../components/layout/Navbar';
import api from '../../services/api';

// Cinematic aerial island travel hero image
const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85';

export const LoginPage = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password modal state
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errs.password = 'Password is required';
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
      const user = await login(formData.email.trim(), formData.password);
      success(`Welcome back, ${user.name}!`);
      const origin = location.state?.from?.pathname || '/dashboard';
      navigate(origin, { replace: true });
    } catch (err) {
      toastError(err.message || 'Login failed. Please check your credentials.');
      setErrors({ form: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim())) {
      toastError('Please enter a valid email address.');
      return;
    }

    setForgotSubmitting(true);
    try {
      const res = await api.post('/auth/forgot-password', { email: forgotEmail.trim() });
      setForgotSuccess(true);
      success(res.data?.message || 'Password reset link sent!');
    } catch (err) {
      toastError(err.message || 'Unable to process request.');
    } finally {
      setForgotSubmitting(false);
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
        {/* Subtle Dark Ocean Vignette & Contrast Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-abyss/90 via-ocean-deep/35 to-abyss/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-abyss/75 via-abyss/30 to-transparent" />
      </div>

      {/* Floating Glass Navbar with Visible Inset Margins */}
      <Navbar />

      {/* Main Cinematic Hero Content & Glass Login Form */}
      <main className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1 flex items-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: 3-Line Space Grotesk Bold Headline & Supporting Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-pill-control text-white text-xs font-semibold tracking-wide shadow-sm">
              <span>✈️ Odoo x LDCE Ahmedabad Hackathon '26</span>
            </div>

            {/* 3-Line Space Grotesk Bold Headline with Contrast Drop Shadow */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-[66px] font-bold text-white leading-[1.06] tracking-tight drop-shadow-md">
              Unforgettable<br />
              Travel Moments<br />
              <span className="text-white/95">by GlobeTrotter</span>
            </h1>

            {/* Supporting Body Copy */}
            <p className="text-white/85 text-sm sm:text-base lg:text-lg max-w-xl font-normal leading-relaxed drop-shadow-sm">
              We take you beyond the ordinary, to places where cultures come alive, landscapes leave you breathless, and every moment becomes a story to tell.
            </p>
          </div>

          {/* Right Column: Floating Glass Auth Card */}
          <div className="lg:col-span-5 w-full max-w-[390px] mx-auto lg:ml-auto">
            <div className="glass-card-elevated p-7 sm:p-8">
              <div className="mb-6">
                <h2 className="font-display text-2xl font-bold text-white tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-white/70 text-xs sm:text-sm mt-1">
                  Sign in to access your smart itineraries
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="space-y-1.5">
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
                    <p className="text-xs text-rose-300 font-medium pt-0.5">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white/90">Password</label>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(formData.email);
                        setForgotSuccess(false);
                        setForgotModalOpen(true);
                      }}
                      className="text-xs text-white/75 hover:text-white transition-colors"
                    >
                      Forgot?
                    </button>
                  </div>
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
                    <p className="text-xs text-rose-300 font-medium pt-0.5">{errors.password}</p>
                  )}
                </div>

                {errors.form && (
                  <div className="p-3 bg-rose-500/25 border border-rose-400/40 text-rose-100 text-xs rounded-xl font-medium">
                    {errors.form}
                  </div>
                )}

                {/* Pure White Pill CTA Button (High Contrast) */}
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
                    Sign In to GlobeTrotter
                  </Button>
                </div>
              </form>

              <div className="mt-6 pt-5 border-t border-white/10 text-center">
                <p className="text-xs text-white/75">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-bold text-white hover:underline underline-offset-4">
                    Create one now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer Row with Circular Glass Down Arrow Affordance */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="text-xs text-white/50">
          <span>GlobeTrotter Smart &copy; 2026</span>
        </div>

        {/* Circular Down Arrow Glass Control */}
        <button
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="w-10 h-10 rounded-full glass-navbar-floating flex items-center justify-center text-white/90 hover:text-white hover:bg-white/20 transition-all shadow-md active:scale-95"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </footer>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Your Password"
        description="Enter your account email to receive a password reset link."
      >
        {forgotSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-semibold text-slate-800">Reset instructions sent!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Instructions dispatched to <strong className="text-slate-700">{forgotEmail}</strong> (Hackathon mock stub).
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              className="w-full"
              onClick={() => setForgotModalOpen(false)}
            >
              Back to Sign In
            </Button>
          </div>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <FormInput
              label="Account Email"
              name="forgotEmail"
              type="email"
              placeholder="you@example.com"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              leftIcon={Mail}
              required
            />
            <div className="flex gap-3 justify-end pt-2">
              <Button variant="ghost" size="md" onClick={() => setForgotModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={forgotSubmitting}>
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default LoginPage;
