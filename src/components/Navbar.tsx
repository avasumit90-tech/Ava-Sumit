import React, { useState, useEffect } from 'react';
import { ViewMode } from '../types';
import { ASSETS } from '../data';
import { Menu, Heart, Shield, UserCheck, LayoutDashboard, Search, Home, Users, Award, LogIn, LogOut } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { AdminLoginModal } from './AdminLoginModal';
import * as api from '../lib/api';

interface NavbarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenCheckStatus: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onOpenCheckStatus }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string } | null>(null);

  // Restore session on mount + react to auth changes
  useEffect(() => {
    api.getSessionUser().then(setCurrentUser);
    const unsub = api.onAuthStateChange((u) => setCurrentUser(u));
    return unsub;
  }, []);

  const navItems: { label: string; view: ViewMode; icon: React.ReactNode; badge?: string }[] = [
    { label: 'Home', view: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'Join Community', view: 'join-community', icon: <Users className="w-4 h-4" /> },
    { label: 'Register as Volunteer', view: 'registration', icon: <UserCheck className="w-4 h-4" />, badge: 'Apply' },
    { label: 'Donate', view: 'donate', icon: <Heart className="w-4 h-4 text-rose-500" /> },
    { label: 'My Certificates', view: 'user-certificates', icon: <Award className="w-4 h-4 text-amber-500" /> },
    { label: 'My Dashboard', view: 'user-dashboard', icon: <LayoutDashboard className="w-4 h-4 text-sky-500" /> },
    { label: 'Admin Portal', view: 'admin-dashboard', icon: <Shield className="w-4 h-4 text-slate-700" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded text-[10px] tracking-wide uppercase">Official</span>
            <span className="hidden sm:inline text-slate-300">Astha Foundation — Youth Empowerment & Community Trust Initiative</span>
            <span className="sm:hidden text-slate-300">Astha Foundation Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={onOpenCheckStatus}
              className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Check Application Status</span>
            </button>
            <span className="text-slate-600 hidden md:inline">|</span>
            <span className="text-slate-400 hidden md:inline">Toll Free: 1800-123-ASTHA</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Title */}
          <div 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-slate-900/10 shadow-sm transition-transform group-hover:scale-105 bg-white flex items-center justify-center p-0.5">
              <img 
                src={ASSETS.logoCircle} 
                alt="Astha Foundation Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 group-hover:text-blue-900 transition-colors">
                  Astha Foundation
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium tracking-wide">Empowering Youth & Communities</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
            {navItems.map((item) => {
              const isActive = currentView === item.view || 
                (item.view === 'admin-dashboard' && currentView.startsWith('admin-'));
              return (
                <button
                  key={item.view}
                  onClick={() => onNavigate(item.view)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* CTA Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onNavigate('donate')}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-orange-500/20 hover:shadow-lg transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Heart className="w-4 h-4 fill-white/20" />
              <span>Donate Now</span>
            </button>

            <button
              onClick={() => setLoginOpen(true)}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              {currentUser ? <LogOut className="w-3.5 h-3.5 text-amber-400" /> : <Shield className="w-3.5 h-3.5 text-amber-400" />}
              <span>{currentUser ? 'Sign Out' : 'Admin Login'}</span>
            </button>
          </div>

          {/* Mobile Hamburger Menu Icon Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onNavigate('donate')}
              className="sm:hidden flex items-center gap-1 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg font-extrabold text-xs shadow-xs"
            >
              <Heart className="w-3.5 h-3.5 fill-slate-950/20" />
              <span>Donate</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-btn"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

        </div>
      </div>

      {/* Slide-out Mobile Navigation Menu Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenCheckStatus={onOpenCheckStatus}
      />

      {/* Admin Login / Sign Out Modal */}
      <AdminLoginModal
        isOpen={loginOpen}
        onClose={() => setLoginOpen(false)}
        onLogin={(email) => setCurrentUser({ email })}
        onLogout={() => setCurrentUser(null)}
        currentUser={currentUser}
      />
    </header>
  );
};

