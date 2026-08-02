import React from 'react';
import { ViewMode, ProjectItem } from '../../types';
import { ASSETS } from '../../data';
import { Heart, ArrowRight, ShieldCheck, Users, GraduationCap, Award, Sparkles, CheckCircle, Lightbulb, FileText, Building2, CreditCard, ExternalLink, Check } from 'lucide-react';
import { TestimonialSlider } from '../TestimonialSlider';
import { FAQSection } from '../FAQSection';

interface HomePageProps {
  onNavigate: (view: ViewMode) => void;
  projects: ProjectItem[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, projects }) => {
  return (
    <div className="space-y-16 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 bg-gradient-to-b from-slate-100 via-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-amber-600 fill-amber-500" />
                <span>Empowering Youth Since 2019</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Empowering Communities, <br />
                <span className="bg-gradient-to-r from-blue-900 via-indigo-900 to-amber-700 bg-clip-text text-transparent">
                  Building Trust & Futures.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                Building community, trust, and professional development opportunities for a brighter tomorrow. AVA FOUNDATION connects mentors, teachers, and youth to break rural educational barriers.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={() => onNavigate('donate')}
                  className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl shadow-amber-500/20 hover:shadow-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
                >
                  <Heart className="w-5 h-5 fill-white/20" />
                  <span>Donate Now</span>
                </button>

                <button
                  onClick={() => onNavigate('join-community')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-4 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-sm shadow-md"
                >
                  <span>Join Us / Select Role</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified 80G Charity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>50K+ Beneficiaries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Transparency First</span>
                </div>
              </div>

            </div>

            {/* Hero Right Visual Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-md w-full">
                
                {/* Decorative background glow */}
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-blue-600 rounded-3xl blur-2xl opacity-20 transform -rotate-3" />
                
                {/* Card Outer */}
                <div className="relative bg-white p-8 sm:p-10 rounded-3xl shadow-2xl border border-slate-200/80 text-center transform hover:rotate-0 transition-transform duration-300">
                  
                  <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto mb-6 p-2 rounded-full bg-gradient-to-tr from-amber-100 to-blue-50 shadow-inner flex items-center justify-center border border-slate-200">
                    <img
                      src={ASSETS.logoCircle}
                      alt="AVA Foundation Logo"
                      className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <span className="inline-block bg-slate-900 text-amber-300 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-2">
                    Official Community Trust
                  </span>

                  <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    AVA FOUNDATION
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Connecting grassroots leadership with youth education across Maharashtra and India.
                  </p>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-around text-center">
                    <div>
                      <p className="text-lg font-black text-slate-900">100%</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Transparent</p>
                    </div>
                    <div className="h-8 w-px bg-slate-200" />
                    <div>
                      <p className="text-lg font-black text-slate-900">5+ Yrs</p>
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Community Service</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BENTO IMPACT METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Our Real Impact</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Transforming Lives in Numbers</h2>
          <p className="text-xs text-slate-500">
            Real outcomes driven by our Astha Didi, Astha Maa, teachers, and volunteer network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">50K+</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Lives Touched</p>
            <p className="text-xs text-slate-500 mt-1">Youth and families empowered with mentorship & skills.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">120+</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Schools Built & Equipped</p>
            <p className="text-xs text-slate-500 mt-1">Digital classrooms and learning kits provided.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Lightbulb className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">300+</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Medical & Health Camps</p>
            <p className="text-xs text-slate-500 mt-1">Free health screenings and maternal care outreach.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-slate-900 tracking-tight">1,200+</p>
            <p className="text-xs font-bold text-slate-800 mt-1">Active Mentors & Volunteers</p>
            <p className="text-xs text-slate-500 mt-1">Dedicated leaders serving across 45+ districts.</p>
          </div>

        </div>
      </section>

      {/* CURRENT PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">Active Initiatives</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Current Projects Needing Support</h2>
          </div>
          <button
            onClick={() => onNavigate('donate')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1.5"
          >
            <span>View All Campaigns</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => {
            const percentage = Math.round((project.raised / project.goal) * 100);
            const needed = project.goal - project.raised;

            return (
              <div key={project.id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group">
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-xs text-amber-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wide">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2 group-hover:text-amber-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Funding Bar */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-baseline text-xs font-bold">
                      <span className="text-slate-900">₹{project.raised.toLocaleString('en-IN')} <span className="font-normal text-slate-500">raised</span></span>
                      <span className="text-amber-600">{percentage}% Funded</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                      <span>Goal: ₹{project.goal.toLocaleString('en-IN')}</span>
                      <span className="text-slate-700 font-semibold">₹{needed.toLocaleString('en-IN')} to go</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('donate')}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 text-xs"
                  >
                    <Heart className="w-4 h-4 text-amber-400" />
                    <span>Support This Project</span>
                  </button>

                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OFFICIAL LEGAL & REGISTRATION DOCUMENTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 relative z-10 border-b border-slate-800 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>100% Verified Govt. Registration & Compliance</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Official Organization Documents</h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                AVA FOUNDATION operates with complete government authorization, transparent tax compliance, and verified banking infrastructure for public accountability.
              </p>
            </div>
            <button
              onClick={() => onNavigate('admin-legal')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-2 cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>Explore Legal Repository</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {/* Card 1: PAN Card */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Verified PAN
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-white">Permanent Account Number (PAN)</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Income Tax Department, Govt. of India</p>
                
                <div className="mt-4 bg-slate-900/80 rounded-xl p-3 border border-slate-700 font-mono text-xs text-amber-300 font-bold flex justify-between items-center">
                  <span>PAN: AAHTA5416F</span>
                  <span className="text-[10px] font-sans text-slate-400 font-normal">Est. 27/08/2019</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal pt-2 border-t border-slate-700/50">
                Official PAN registered under trust name <strong className="text-slate-200">AVA FOUNDATION</strong> for statutory compliance and donation receipts.
              </p>
            </div>

            {/* Card 2: MSME Certificate */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> MSME Registered
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-white">Udyog Aadhaar MSME Certificate</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Ministry of MSME, Govt. of India</p>
                
                <div className="mt-4 bg-slate-900/80 rounded-xl p-3 border border-slate-700 font-mono text-xs text-amber-300 font-bold flex justify-between items-center">
                  <span>UAM: AS03D0003712</span>
                  <span className="text-[10px] font-sans text-slate-400 font-normal">Assam</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal pt-2 border-t border-slate-700/50">
                Classified under Social Work Services (NIC 88100) at Patarkuchi, Guwahati, Kamrup Metro, Assam.
              </p>
            </div>

            {/* Card 3: Banking Verification */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Bank Account
                  </span>
                </div>
                <h3 className="font-extrabold text-sm text-white">ICICI Bank Current Account</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Hatigaon Branch, Guwahati - 781038</p>
                
                <div className="mt-4 bg-slate-900/80 rounded-xl p-3 border border-slate-700 font-mono text-[11px] text-emerald-300 font-bold space-y-0.5">
                  <div className="flex justify-between"><span>A/C No:</span> <span>413605000147</span></div>
                  <div className="flex justify-between text-slate-400 font-normal"><span>IFSC:</span> <span className="font-mono text-amber-300">ICIC0004136</span></div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-normal pt-2 border-t border-slate-700/50">
                Verified Business Banking Current Account & Cancelled Cheque on record for authentic operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SLIDER SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <TestimonialSlider autoPlayInterval={6000} />
      </section>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQSection />
      </section>

    </div>
  );
};
