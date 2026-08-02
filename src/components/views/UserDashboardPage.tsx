import React from 'react';
import { ViewMode } from '../../types';
import { ASSETS } from '../../data';
import { Award, Clock, Calendar, Download, Sparkles, CheckCircle2, User, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import { VolunteerLeaderboard } from '../VolunteerLeaderboard';

interface UserDashboardPageProps {
  onNavigate: (view: ViewMode) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pb-16">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-5 text-center sm:text-left">
            <img
              src={ASSETS.sarahAvatar}
              alt="Sarah Student"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-amber-400 shadow-xl shrink-0"
            />
            <div className="space-y-1">
              <span className="bg-amber-400 text-slate-950 font-extrabold text-[10px] px-3 py-0.5 rounded-full uppercase tracking-wider">
                Senior Volunteer & Project Lead
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, Sarah!
              </h1>
              <p className="text-xs text-slate-300">
                Member ID: <span className="font-mono text-amber-300 font-bold">AST-VOL-8820</span> | Region: Pune West
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('admin-doc-generator')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-3 rounded-2xl text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Member ID</span>
            </button>
          </div>

        </div>
      </div>

      {/* Bento Grid: Your Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">124 Hrs</p>
            <p className="text-xs font-bold text-slate-700 mt-1">Total Volunteered Time</p>
            <p className="text-[11px] text-slate-500">Mentoring 12 junior female students</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-3xl font-black text-slate-900">6 Badges</p>
            <p className="text-xs font-bold text-slate-700 mt-1">Certifications Earned</p>
            <p className="text-[11px] text-slate-500">First Aid, Leadership & Teaching</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center text-xs font-bold">
            <span className="text-slate-500 uppercase">Next Level Milestone</span>
            <span className="text-amber-700">80% Progress</span>
          </div>
          <p className="text-xl font-extrabold text-slate-900">Youth Lead Mentor</p>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[80%] rounded-full" />
          </div>
          <p className="text-[11px] text-slate-500">Complete 16 more mentorship hours to unlock Tier-1 Lead Badge.</p>
        </div>

      </div>

      {/* Main Section: Events & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Upcoming Events */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Upcoming Volunteer Events</h3>
              <p className="text-xs text-slate-500">Scheduled sessions and outreach drives</p>
            </div>
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>

          <div className="space-y-4">
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 text-slate-950 font-black rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs leading-none">OCT</span>
                  <span className="text-base leading-none">15</span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Rural Digital Literacy Drive</h4>
                  <p className="text-xs text-slate-500">Zilla Parishad High School, Ward 4</p>
                </div>
              </div>
              <button
                onClick={() => alert('RSVP Confirmed for Digital Literacy Drive!')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                RSVP Now
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-900 text-white font-black rounded-2xl flex flex-col items-center justify-center shrink-0">
                  <span className="text-xs leading-none">OCT</span>
                  <span className="text-base leading-none">22</span>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Astha Didi Mentorship Workshop</h4>
                  <p className="text-xs text-slate-500">Online Zoom Live Session</p>
                </div>
              </div>
              <button
                onClick={() => alert('RSVP Confirmed for Mentorship Workshop!')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs"
              >
                RSVP Now
              </button>
            </div>

          </div>
        </div>

        {/* Right: Downloadable Certificates */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">My Certificates</h3>
              <p className="text-xs text-slate-500">Verified credentials issued by Astha Foundation</p>
            </div>
            <button
              onClick={() => onNavigate('user-certificates')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Basic First Aid & Maternal Support</p>
                <p className="text-[10px] text-slate-400">Issued Sep 2024</p>
              </div>
              <button
                onClick={() => alert('Certificate PDF downloaded!')}
                className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl"
                title="Download Certificate"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-extrabold text-slate-900">Youth Mentorship Leadership 101</p>
                <p className="text-[10px] text-slate-400">Issued Aug 2024</p>
              </div>
              <button
                onClick={() => alert('Certificate PDF downloaded!')}
                className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl"
                title="Download Certificate"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Volunteer Leaderboard Section */}
      <section>
        <VolunteerLeaderboard 
          title="Youth Volunteer Honor Roll" 
          compact={false} 
        />
      </section>

    </div>
  );
};
