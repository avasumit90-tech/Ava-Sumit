import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ViewMode } from '../types';
import { ASSETS } from '../data';
import { 
  X, 
  Heart, 
  Shield, 
  UserCheck, 
  LayoutDashboard, 
  Search, 
  Home, 
  Users, 
  Award, 
  PhoneCall, 
  ChevronRight,
  User,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  onOpenCheckStatus: () => void;
  userProfile?: {
    name: string;
    role: string;
    avatarUrl: string;
    verified: boolean;
  };
}

export const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  currentView,
  onNavigate,
  onOpenCheckStatus,
  userProfile = {
    name: 'Anjali Sharma',
    role: 'Astha Didi • Volunteer Lead',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    verified: true,
  },
}) => {
  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Handle ESC key press to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems: { label: string; view: ViewMode; icon: React.ReactNode; badge?: string }[] = [
    { label: 'Home', view: 'home', icon: <Home className="w-4 h-4" /> },
    { label: 'Join Community', view: 'join-community', icon: <Users className="w-4 h-4" /> },
    { label: 'Register as Volunteer', view: 'registration', icon: <UserCheck className="w-4 h-4" />, badge: 'Apply' },
    { label: 'Donate', view: 'donate', icon: <Heart className="w-4 h-4 text-rose-400" /> },
    { label: 'My Certificates', view: 'user-certificates', icon: <Award className="w-4 h-4 text-amber-400" /> },
    { label: 'My Dashboard', view: 'user-dashboard', icon: <LayoutDashboard className="w-4 h-4 text-sky-400" /> },
    { label: 'Admin Portal', view: 'admin-dashboard', icon: <Shield className="w-4 h-4 text-slate-400" /> },
  ];

  const drawerContent = (
    <div className="fixed inset-0 z-[99999] lg:hidden flex justify-end" id="mobile-menu-container">
      {/* Full Screen Dark Backdrop with Blur */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer"
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <aside 
        className="relative w-full max-w-[320px] sm:max-w-[360px] h-full h-dvh bg-slate-950 text-white shadow-2xl z-[100000] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-800"
        aria-label="Mobile Navigation Drawer"
      >
        {/* Sticky Header Section */}
        <div className="bg-slate-950 border-b border-slate-800/90 p-4 space-y-3 shrink-0 shadow-sm">
          {/* Top Bar: Brand & Close Button */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-amber-400/40 shadow-xs shrink-0 flex items-center justify-center">
                <img 
                  src={ASSETS.logoCircle} 
                  alt="Astha Foundation Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-extrabold text-sm text-white leading-tight truncate">Astha Foundation</h3>
                  <span className="bg-amber-400/15 text-amber-300 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase border border-amber-400/30 tracking-wider shrink-0">
                    Official
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">Empowering Youth & Communities</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer shrink-0 border border-slate-800 hover:border-slate-700 active:scale-95"
              aria-label="Close menu"
              id="close-mobile-menu-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img 
                  src={userProfile.avatarUrl} 
                  alt={userProfile.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-xs" 
                />
                {userProfile.verified && (
                  <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full ring-2 ring-slate-900" title="Verified Member">
                    <CheckCircle2 className="w-3.5 h-3.5 fill-slate-950 text-amber-400" />
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-extrabold text-xs text-white truncate">{userProfile.name}</h4>
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded-md uppercase shrink-0">
                    Active
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 font-medium truncate mt-0.5">{userProfile.role}</p>
                
                <button
                  onClick={() => {
                    onNavigate('user-dashboard');
                    onClose();
                  }}
                  className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-extrabold text-amber-400 hover:text-amber-300 transition-colors cursor-pointer group"
                >
                  <User className="w-3 h-3 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>View Profile & Status</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {/* Check Status Quick Access */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-2.5">
            <button
              onClick={() => {
                onOpenCheckStatus();
                onClose();
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 border border-amber-500/30 p-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-between shadow-xs transition-all cursor-pointer group"
              id="mobile-check-status-btn"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0">
                  <Search className="w-3 h-3" />
                </div>
                <span>Check Application Status</span>
              </div>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Navigation Links List */}
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 py-1">
              Menu Options
            </p>

            {navItems.map((item) => {
              const isActive = currentView === item.view || 
                (item.view === 'admin-dashboard' && currentView.startsWith('admin-'));

              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-500/50'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-amber-300' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge ? (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                      {item.badge}
                    </span>
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fixed Bottom Actions Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md space-y-2.5 shrink-0">
          <button
            onClick={() => {
              onNavigate('donate');
              onClose();
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-2.5 rounded-xl font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <Heart className="w-4 h-4 fill-slate-950/20 text-slate-950" />
            <span>Support Us — Donate Now</span>
          </button>

          <button
            onClick={() => {
              onNavigate('admin-dashboard');
              onClose();
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white border border-slate-800 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Admin Portal</span>
          </button>

          <div className="pt-1 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 font-medium">
            <PhoneCall className="w-3 h-3 text-amber-400" />
            <span>Toll Free Support: 1800-123-ASTHA</span>
          </div>
        </div>
      </aside>
    </div>
  );

  return createPortal(drawerContent, document.body);
};


