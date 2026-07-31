import React from 'react';
import { ViewMode } from '../types';
import { ASSETS } from '../data';
import { Heart, Shield, Mail, Phone, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: ViewMode) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Upper Newsletter & Impact Callout */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-10 border border-slate-800 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="bg-amber-500/20 text-amber-300 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5 border border-amber-500/30">
                <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                Join Our Movement
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Empower a child today with quality education and mentorship
              </h3>
              <p className="text-slate-400 text-sm max-w-xl">
                Your support directly finances school kits, digital classrooms, and women mentorship programs across rural districts.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('donate')}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Make a Donation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('registration')}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold py-3.5 px-6 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Join as Volunteer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full p-1 border border-slate-700">
                <img src={ASSETS.logoCircle} alt="Astha Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">Astha Foundation</h4>
                <p className="text-xs text-amber-400 font-medium">Youth Empowerment & Community Trust</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Astha Foundation is dedicated to youth empowerment, education, healthcare accessibility, and community mentorship. registered non-profit organization serving communities since 2019.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>80G Tax Exempt Certified</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Navigation</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Home Page
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('join-community')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Join Community & Roles
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('registration')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Registration Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('donate')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Donate & Tax Benefits
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('user-dashboard')} className="hover:text-amber-400 transition-colors cursor-pointer">
                  Volunteer Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Roles & Community */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Community Roles</h5>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('join-community')} className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
                  <span>Astha Didi Mentors</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('join-community')} className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
                  <span>Astha Maa Leaders</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('join-community')} className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
                  <span>Affiliated Teachers</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('join-community')} className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
                  <span>Enrolled Students</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('join-community')} className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1">
                  <span>District Coordinators</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Foundation HQ</h5>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>102, Trust Towers, Nariman Point, Mumbai, Maharashtra 400021</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>+91 (022) 2890-4412</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@asthafoundation.org</span>
              </div>
              <div className="pt-2">
                <button 
                  onClick={() => onNavigate('admin-dashboard')} 
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                >
                  <span>Administrative Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Astha Foundation. All rights reserved. Registered Trust Act 1882.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">FCRA Compliance</span>
            <span className="hover:text-slate-400 cursor-pointer">Audit Reports</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
