import React from 'react';
import { ViewMode, RoleType } from '../../types';
import { Users, Heart, BookOpen, GraduationCap, Building2, Search, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface JoinCommunityPageProps {
  onSelectRole: (role: RoleType) => void;
  onOpenCheckStatus: () => void;
  onNavigate: (view: ViewMode) => void;
}

export const JoinCommunityPage: React.FC<JoinCommunityPageProps> = ({ onSelectRole, onOpenCheckStatus, onNavigate }) => {
  const roles: {
    id: RoleType;
    title: string;
    badge: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    benefits: string[];
  }[] = [
    {
      id: 'didi',
      title: 'Astha Didi',
      badge: 'Female Student Mentor',
      description: 'Mentorship role for senior female students guiding junior peers through academic & personal growth.',
      icon: <Heart className="w-6 h-6 text-rose-600" />,
      color: 'border-rose-200 bg-rose-50/50 hover:border-rose-400',
      benefits: ['Stipend & Scholarship Support', 'Leadership Certification', '1-on-1 Peer Mentoring']
    },
    {
      id: 'maa',
      title: 'Astha Maa',
      badge: 'Community Maternal Leader',
      description: 'Community leaders providing maternal care, nutrition oversight, and emotional support to children in rural areas.',
      icon: <Users className="w-6 h-6 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/50 hover:border-amber-400',
      benefits: ['Community Healthcare Toolkit', 'Monthly Honorarium', 'District Honor Recognition']
    },
    {
      id: 'teacher',
      title: 'Teacher',
      badge: 'Educator & Instructor',
      description: 'Educators participating in our affiliated digital learning programs, special coaching, and literacy camps.',
      icon: <BookOpen className="w-6 h-6 text-blue-600" />,
      color: 'border-blue-200 bg-blue-50/50 hover:border-blue-400',
      benefits: ['Digital Teaching Aids', 'Professional Training', 'School Network Access']
    },
    {
      id: 'student',
      title: 'Student',
      badge: 'Educational Beneficiary',
      description: 'Beneficiaries enrolling in educational initiatives, scholarship programs, and free skill workshops.',
      icon: <GraduationCap className="w-6 h-6 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-400',
      benefits: ['Free School Stationery & Tablet', 'Didi Mentorship', 'Scholarship Portal']
    },
    {
      id: 'coordinator',
      title: 'District/Block Coordinator',
      badge: 'Regional Administrator',
      description: 'Regional managers overseeing grassroots operations, team logistics, and foundation activities across blocks.',
      icon: <Building2 className="w-6 h-6 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50/50 hover:border-purple-400',
      benefits: ['Official Foundation ID & Kit', 'District Admin Dashboard', 'Full-time Operational Role']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Community Onboarding
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Join the Community
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Select your role below to begin the registration process and become part of our mission to empower youth, build trust, and uplift families across India.
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {roles.map((role) => (
          <div
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`bg-white rounded-3xl p-8 border-2 ${role.color} shadow-xs hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-6 group transform hover:-translate-y-1`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                  {role.icon}
                </div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-3 py-1 rounded-full">
                  {role.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors">
                  {role.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {role.description}
                </p>
              </div>

              {/* Benefits checklist */}
              <div className="pt-2 space-y-1.5 border-t border-slate-100">
                {role.benefits.map((b, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="w-full bg-slate-900 group-hover:bg-amber-500 group-hover:text-slate-950 text-white font-bold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-md"
            >
              <span>Apply for {role.title}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Existing Application Banner Card */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">Already Applied?</span>
              <h3 className="text-xl font-extrabold text-white tracking-tight mt-1">
                Check Application Status
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Track your registration verification, background check, and official ID card issuance status with your Application ID.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenCheckStatus}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search Application ID</span>
          </button>
        </div>

      </div>

    </div>
  );
};
