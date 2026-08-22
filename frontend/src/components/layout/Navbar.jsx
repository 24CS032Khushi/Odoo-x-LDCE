import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronDown, Menu, X, Plane, Shield, Calendar, Wallet } from 'lucide-react';
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
    ...(user?.role === 'admin' ? [{ label: 'Admin', path: '/admin' }] : [])
  ];

  const currentNavLinks = isAuthenticated ? authNavLinks : publicNavLinks;

  return (
    <div className="w-full z-40 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 sticky top-0">
      <nav className="max-w-6xl mx-auto glass-navbar-floating px-5 sm:px-7 py-3 sm:py-3.5 transition-all duration-200">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/login'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white border border-white/25 shadow-inner group-hover:scale-105 transition-transform">
              <Plane className="w-4 h-4 text-white transform -rotate-45" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-white text-lg tracking-tight">
                GlobeTrotter
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-ocean-tint animate-pulse"></span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {currentNavLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`text-xs lg:text-sm font-medium tracking-tight transition-all duration-150 ${
                    isActive
                      ? 'text-white font-semibold underline underline-offset-8 decoration-white/70 decoration-2'
                      : 'text-white/80 hover:text-white'
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
                {/* User Pill Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full glass-pill-control text-white transition-all text-left shadow-sm"
                  >
                    <div className="w-6 h-6 rounded-full bg-white/20 text-white font-bold text-[11px] flex items-center justify-center border border-white/30">
                      {user?.photo_url ? (
                        <img
                          src={user.photo_url}
                          alt={user.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        getInitials(user?.name)
                      )}
                    </div>
                    <span className="text-xs font-medium text-white/95 truncate max-w-[110px]">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 glass-card-elevated text-white p-2 z-50 animate-scale-up">
                      <div className="px-3 py-2 border-b border-white/10">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-white truncate">{user?.name}</p>
                          {user?.role === 'admin' && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/30 text-amber-200 border border-amber-500/40">
                              Admin
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-white/60 truncate">{user?.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/90 hover:bg-white/15 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-white/70" />
                          Profile & Settings
                        </Link>

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-300 hover:bg-white/15 transition-colors"
                          >
                            <Shield className="w-3.5 h-3.5 text-amber-300" />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-white/10">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-300" />
                          Sign Out
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
                  className="px-5 py-2 rounded-full bg-white text-abyss font-bold text-xs tracking-tight hover:bg-foam transition-all shadow-md hover:shadow-lg active:scale-95 border border-white/20"
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
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="sm:hidden pt-4 pb-2 border-t border-white/10 mt-3 space-y-2 animate-fade-in">
            {currentNavLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-white/10">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-sm font-medium text-white/90 hover:bg-white/10"
                  >
                    Profile & Settings
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-500/20"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2.5 rounded-full bg-white text-abyss font-bold text-sm shadow-md"
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
