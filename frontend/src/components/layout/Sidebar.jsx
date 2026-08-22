import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Compass,
  Calendar,
  Wallet,
  User,
  Sparkles,
  Layers
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { name: 'My Trips', path: '/trips', icon: MapPin, badge: 'Phase 2' },
  { name: 'Discover Cities', path: '/discover', icon: Compass, badge: 'Phase 2' },
  { name: 'Itinerary Planner', path: '/itinerary', icon: Layers, badge: 'Phase 2' },
  { name: 'Budget & Analytics', path: '/budget', icon: Wallet, badge: 'Phase 3' },
  { name: 'Trip Calendar', path: '/calendar', icon: Calendar, badge: 'Phase 3' },
  { name: 'User Profile', path: '/profile', icon: User },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden md:flex">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Hackathon Badge Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 border border-indigo-100/80 text-slate-800">
          <div className="flex items-center gap-2 text-brand-700 font-semibold text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Odoo x LDCE '26</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Phase 1 Foundation active. Multi-city, Itinerary & Smart Budget coming next!
          </p>
        </div>
      </div>

      <div className="px-3 py-2 border-t border-slate-100 text-slate-400 text-[11px] flex justify-between items-center">
        <span>GlobeTrotter v1.0.0</span>
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
      </div>
    </aside>
  );
};

export default Sidebar;
