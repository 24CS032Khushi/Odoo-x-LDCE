import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Menu, X, Plane, Shield, Calendar, Wallet, Scale, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { info } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Check if we are on Login or Signup hero screen (which uses the dark cinematic photographic hero)
  const isAuthHeroPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    info('You have been logged out.');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'GT';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const publicNavLinks = [
    { label: 'Destinations', path: '/discover' },
    { label: 'Itinerary Planner', path: '/itinerary' },
    { label: 'Smart Budget', path: '/budget' },
  ];

  const authNavLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Trips', path: '/trips' },
    { label: 'Discover', path: '/discover' },
    { label: 'Budget', path: '/budget' },
    { label: 'Calendar', path: '/calendar' },
    { label: 'Compare', path: '/trips/compare' },
    ...(user?.role === 'admin' ? [{ label: 'Admin', path: '/admin' }] : [])
  ];

  const currentNavLinks = isAuthenticated ? authNavLinks : publicNavLinks;

  return (
    <div className="fixed top-0 inset-x-0 z-40 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-5 pointer-events-none">
      <nav
        className={`max-w-6xl mx-auto px-5 sm:px-7 py-3 sm:py-3.5 pointer-events-auto transition-all duration-200 ${
          isAuthHeroPage
            ? 'glass-navbar-floating text-white'
            : 'neu-navbar text-[#0F172A]'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="flex items-center gap-2.5 group">
            <div
              className={`w-9 h-9 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 ${
                isAuthHeroPage
                  ? 'bg-white/15 text-white border border-white/30 backdrop-blur-md'
                  : 'bg-[#DFE4EA] text-amber-primary border border-slate-300 shadow-neu-inset-sm'
              }`}
            >
              <Plane className="w-4 h-4 transform -rotate-45" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className={`font-display font-extrabold text-lg tracking-tight ${isAuthHeroPage ? 'text-white' : 'text-[#0F172A]'}`}>
                GlobeTrotter
              </span>
              <span className="font-display font-black text-xl text-amber-primary">.</span>
            </div>
          </Link>

          {/* Center Segmented Tab Navigation */}
          <div
            className={`hidden md:flex items-center gap-1.5 p-1 rounded-2xl ${
              isAuthHeroPage ? 'bg-black/20 backdrop-blur-md border border-white/10' : 'neu-inset'
            }`}
          >
            {currentNavLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-display font-bold transition-all duration-150 ${
                    isAuthHeroPage
                      ? isActive
                        ? 'bg-white text-abyss font-extrabold shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      : isActive
                      ? 'bg-[#E5EAF0] text-[#0F172A] shadow-neu-extruded-sm border border-slate-300 font-extrabold'
                      : 'text-slate-600 hover:text-[#0F172A]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action / Profile */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User Tactile Pill Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl transition-all text-left ${
                      isAuthHeroPage
                        ? 'bg-white/15 text-white border border-white/30 backdrop-blur-md hover:bg-white/25'
                        : 'bg-[#DFE4EA] text-[#0F172A] border border-slate-300 hover:border-amber-primary/40 shadow-neu-inset-sm'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-xl bg-amber-primary/20 text-amber-primary font-mono font-bold text-[11px] flex items-center justify-center border border-amber-primary/40">
                      {user?.photo_url ? (
                        <img
                          src={user.photo_url}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                    <span className={`text-xs font-display font-bold truncate max-w-[110px] ${isAuthHeroPage ? 'text-white' : 'text-[#0F172A]'}`}>
                      {user?.name?.split(' ')[0] || 'Explorer'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAuthHeroPage ? 'text-white/80' : 'text-slate-500'} ${dropdownOpen ? 'rotate-180 text-amber-primary' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 neu-modal text-[#0F172A] p-3 z-50 animate-scale-up border border-slate-300">
                      <div className="px-3 py-2.5 border-b border-slate-300 mb-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-display font-extrabold text-[#0F172A] truncate">{user?.name}</p>
                          {user?.role === 'admin' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-700 border border-amber-500/30">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">{user?.email}</p>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0F172A] hover:bg-white/60 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-amber-primary" />
                          <span>Profile & Preferences</span>
                        </Link>

                        <Link
                          to="/trips/compare"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-[#0F172A] hover:bg-white/60 transition-colors"
                        >
                          <Scale className="w-3.5 h-3.5 text-teal-accent" />
                          <span>Compare Drafts</span>
                        </Link>

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-white/60 transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            <span>Admin Console</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-300">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-5 py-2 rounded-2xl text-xs font-display font-extrabold transition-transform active:scale-95 ${
                    isAuthHeroPage
                      ? 'bg-white text-abyss hover:bg-white/90 shadow-md font-bold'
                      : 'neu-btn-primary text-white'
                  }`}
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex sm:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-colors ${
                isAuthHeroPage
                  ? 'bg-white/15 text-white border border-white/30'
                  : 'bg-[#DFE4EA] text-slate-700 hover:text-[#0F172A] border border-slate-300'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="sm:hidden pt-4 pb-2 border-t border-white/20 mt-3 space-y-2 animate-fade-in">
            {currentNavLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-xl text-xs font-display font-bold ${
                  isAuthHeroPage ? 'text-white/90 hover:bg-white/10' : 'text-slate-700 hover:bg-white/60'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/20">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-xs font-display font-bold ${
                      isAuthHeroPage ? 'text-white/90 hover:bg-white/10' : 'text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    Profile & Preferences
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-2xl bg-white text-abyss text-xs font-display font-extrabold shadow-md"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
