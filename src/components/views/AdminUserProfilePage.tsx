import React, { useState } from 'react';
import { UserRecord, ViewMode } from '../../types';
import { ASSETS } from '../../data';
import { 
  ArrowLeft, MapPin, Edit, Shield, Award, Clock, TrendingUp,
  FileText, CheckCircle, Mail, Phone, Calendar, School, Sparkles, 
  User, Check, ChevronRight, Download, Plus, LayoutDashboard, Folder, Group,
  ShieldCheck, UserCheck, LogOut, Search, Bell, Settings
} from 'lucide-react';

interface AdminUserProfilePageProps {
  user?: UserRecord | null;
  onNavigate: (view: ViewMode) => void;
  onSelectUserForCardGen?: (user: UserRecord) => void;
}

export const AdminUserProfilePage: React.FC<AdminUserProfilePageProps> = ({
  user,
  onNavigate,
  onSelectUserForCardGen
}) => {
  // Default fallback user if none passed
  const activeUser: UserRecord = user || {
    id: 'AST-DID-9012',
    name: 'Anita Sharma',
    email: 'anita.sharma@asthafoundation.org',
    phone: '+91 98765 43210',
    role: 'Astha Didi (Senior Mentor)',
    department: 'Health - Rural & Education',
    location: 'Mumbai Hub, Maharashtra',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    bloodGroup: 'B+',
    validUntil: '31/12/2026',
    qualification: 'MSW (Master of Social Work), TISS',
    organization: 'Astha Foundation Mumbai Chapter',
    registrationDate: '14 Jan 2021',
    lastActive: 'Today, 10:42 AM'
  };

  const [isEditing, setIsEditing] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [editableUser, setEditableUser] = useState(activeUser);

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    alert('User profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-[260px] lg:w-[280px] bg-blue-950 text-white shrink-0 hidden md:flex flex-col min-h-screen sticky top-0 shadow-md">
        <div className="p-6 border-b border-blue-900/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-blue-950 flex items-center justify-center font-bold text-lg shadow-sm">
            A
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight">Astha Admin</h1>
            <p className="text-[11px] text-blue-300">Management Portal</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition-colors cursor-pointer"
          >
            <Folder className="w-4 h-4" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => onNavigate('admin-users')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-amber-400 bg-blue-900/80 border-l-4 border-amber-500 shadow-2xs cursor-pointer"
          >
            <Group className="w-4 h-4 text-amber-400" />
            <span>Volunteers / Users</span>
          </button>

          <button
            onClick={() => onNavigate('admin-applications')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Applications List</span>
          </button>

          <button
            onClick={() => onNavigate('admin-doc-generator')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition-colors cursor-pointer"
          >
            <UserCheck className="w-4 h-4" />
            <span>ID Card Generator</span>
          </button>
        </nav>

        <div className="p-4 border-t border-blue-900/50 space-y-3">
          <button
            onClick={() => onNavigate('admin-users')}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-xl text-xs font-extrabold shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Users</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-300 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-users')}
              className="text-slate-600 hover:text-blue-950 p-2 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-xs font-bold">Back to Users</span>
            </button>
            <span className="text-slate-300">|</span>
            <h2 className="text-sm sm:text-base font-bold text-blue-950 truncate">User Profile Details</h2>
          </div>

          <div className="flex items-center gap-3">
            {onSelectUserForCardGen && (
              <button
                onClick={() => {
                  onSelectUserForCardGen(activeUser);
                  onNavigate('admin-doc-generator');
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-lg text-xs font-black transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-950" />
                <span>ID Card</span>
              </button>
            )}

            <button
              onClick={() => setIsEditing(true)}
              className="px-3.5 py-1.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Profile</span>
            </button>
          </div>
        </header>

        {/* Page Canvas */}
        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1280px] w-full mx-auto">
          
          {/* 1. Cover Banner & Avatar Header */}
          <section className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_rgba(26,35,126,0.05)] overflow-hidden relative">
            
            {/* Cover Banner */}
            <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-900 relative">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:20px_20px]" />
            </div>

            {/* Profile Bar */}
            <div className="px-6 pb-6 sm:px-8 sm:pb-8 relative flex flex-col sm:flex-row gap-5 sm:items-end -mt-14 sm:-mt-16">
              
              {/* Avatar */}
              <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-4 border-white shadow-md shrink-0 bg-slate-100 z-10">
                <img
                  src={activeUser.avatar || ASSETS.adminAvatar}
                  alt={activeUser.name}
                  className="w-full h-full object-cover rounded-full"
                />
                <button
                  onClick={() => setIsEditing(true)}
                  className="absolute bottom-1 right-1 bg-white text-blue-950 p-2 rounded-full shadow-md border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
                  title="Update Avatar"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Identity & Badges */}
              <div className="flex-1 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1 sm:pt-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight">{activeUser.name}</h1>
                    <span className="bg-emerald-600/10 text-emerald-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-600/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      {activeUser.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs font-medium">
                    <span className="bg-blue-950/10 text-blue-950 font-bold px-2.5 py-0.5 rounded-md border border-blue-950/20">
                      {activeUser.role}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {activeUser.location}
                    </span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setShowPermissionsModal(true)}
                    className="flex-1 sm:flex-none border border-slate-300 text-blue-950 font-bold text-xs px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors flex justify-center items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Shield className="w-3.5 h-3.5 text-blue-950" />
                    <span>Permissions</span>
                  </button>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 sm:flex-none bg-blue-950 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-blue-900 transition-colors flex justify-center items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* 2. Overview Metrics Cards (4 Bento Stats) */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Stat 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Total Projects</span>
                <div className="w-8 h-8 rounded-full bg-blue-950/10 text-blue-950 flex items-center justify-center">
                  <Folder className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-blue-950 block leading-none">12</span>
                <span className="text-emerald-700 font-bold text-[11px] flex items-center gap-1 mt-2">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +2 this quarter
                </span>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Total Hours</span>
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-3xl font-black text-blue-950 block leading-none">850</span>
                <span className="text-slate-400 font-medium text-[11px] mt-2 block">Since Jan 2021</span>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-500/10 rounded-full pointer-events-none" />
              <div className="flex justify-between items-start mb-3 relative z-10">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Impact Score</span>
                <div className="w-8 h-8 rounded-full bg-emerald-600/10 text-emerald-700 flex items-center justify-center">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="relative z-10">
                <span className="text-3xl font-black text-blue-950 block leading-none">9.4<span className="text-sm font-normal text-slate-400">/10</span></span>
                <span className="text-emerald-700 font-bold text-[11px] mt-2 block">Top 5% Mentor</span>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <span className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">Last Active</span>
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
                  <UserCheck className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-xl font-black text-blue-950 block leading-tight">Today</span>
                <span className="text-slate-400 font-medium text-[11px] mt-1 block">10:42 AM IST</span>
              </div>
            </div>

          </section>

          {/* 3. Two-Column Layout */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Personal Info & Education */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Personal Information */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <h3 className="text-sm font-black text-blue-950 uppercase tracking-wide mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-950" />
                  <span>Personal Information</span>
                </h3>

                <ul className="space-y-4 text-xs">
                  <li className="flex flex-col">
                    <span className="text-slate-400 font-bold text-[11px]">Email Address</span>
                    <span className="font-bold text-slate-900 mt-0.5 break-all">{activeUser.email}</span>
                  </li>

                  <li className="flex flex-col">
                    <span className="text-slate-400 font-bold text-[11px]">Phone Number</span>
                    <span className="font-bold text-slate-900 mt-0.5">{activeUser.phone || '+91 98765 43210'}</span>
                  </li>

                  <li className="flex flex-col">
                    <span className="text-slate-400 font-bold text-[11px]">Date of Birth</span>
                    <span className="font-bold text-slate-900 mt-0.5">14 Aug 1985</span>
                  </li>

                  <li className="flex flex-col">
                    <span className="text-slate-400 font-bold text-[11px]">Location Address</span>
                    <span className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                      402, Sunshine Apts, Andheri West, Mumbai, Maharashtra 400053
                    </span>
                  </li>

                  <li className="flex flex-col">
                    <span className="text-slate-400 font-bold text-[11px]">Spoken Languages</span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-lg border border-slate-200">Hindi</span>
                      <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-lg border border-slate-200">English</span>
                      <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-lg border border-slate-200">Marathi</span>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Education & Skills */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <h3 className="text-sm font-black text-blue-950 uppercase tracking-wide mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <School className="w-4 h-4 text-blue-950" />
                  <span>Education & Competencies</span>
                </h3>

                <div className="mb-4 text-xs">
                  <h4 className="font-extrabold text-blue-950">{activeUser.qualification || 'MSW (Master of Social Work)'}</h4>
                  <p className="text-slate-400 text-[11px] font-medium mt-0.5">Tata Institute of Social Sciences • 2008-2010</p>
                </div>

                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Core Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-blue-950/10 text-blue-950 font-bold px-2.5 py-1 rounded-lg border border-blue-950/20 text-[11px]">
                    Youth Counseling
                  </span>
                  <span className="bg-blue-950/10 text-blue-950 font-bold px-2.5 py-1 rounded-lg border border-blue-950/20 text-[11px]">
                    Project Management
                  </span>
                  <span className="bg-blue-950/10 text-blue-950 font-bold px-2.5 py-1 rounded-lg border border-blue-950/20 text-[11px]">
                    Community Outreach
                  </span>
                  <span className="bg-blue-950/10 text-blue-950 font-bold px-2.5 py-1 rounded-lg border border-blue-950/20 text-[11px]">
                    Crisis Intervention
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Projects & Activity Timeline */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Assigned Projects */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-black text-blue-950 uppercase tracking-wide flex items-center gap-2">
                    <Folder className="w-4 h-4 text-blue-950" />
                    <span>Assigned Projects</span>
                  </h3>
                  <button className="text-amber-600 font-bold text-xs hover:underline cursor-pointer">View All</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Project 1 */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:shadow-2xs transition-shadow">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="bg-emerald-600/10 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-md border border-emerald-600/20">
                        In Progress
                      </span>
                    </div>
                    <h4 className="font-extrabold text-blue-950 text-xs mb-1">Project Ujala (Education)</h4>
                    <p className="text-slate-500 text-[11px] mb-3 line-clamp-2 leading-relaxed">
                      Mentoring 15 high-school students in the Dharavi sector for board exams preparation.
                    </p>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '75%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>75% Complete</span>
                      <span>End: Dec 2026</span>
                    </div>
                  </div>

                  {/* Project 2 */}
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 hover:shadow-2xs transition-shadow">
                    <div className="flex justify-between items-start mb-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-950/10 text-blue-950 flex items-center justify-center font-bold">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <span className="bg-slate-200 text-slate-700 font-bold text-[10px] px-2 py-0.5 rounded-md">
                        On Hold
                      </span>
                    </div>
                    <h4 className="font-extrabold text-blue-950 text-xs mb-1">Community Health Camp</h4>
                    <p className="text-slate-500 text-[11px] mb-3 line-clamp-2 leading-relaxed">
                      Organizing quarterly health checkups and awareness drives for women and children.
                    </p>

                    <div className="w-full bg-slate-200 rounded-full h-1.5 mb-1.5 overflow-hidden">
                      <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: '30%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>30% Complete</span>
                      <span>Awaiting Funds</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
                <h3 className="text-sm font-black text-blue-950 uppercase tracking-wide mb-6 pb-3 border-b border-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-950" />
                  <span>Recent Activity Timeline</span>
                </h3>

                <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-2 text-xs">
                  
                  {/* Timeline 1 */}
                  <div className="relative pl-6">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-2 border-amber-500" />
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">Submitted Monthly Progress Report</span>
                      <span className="text-slate-400 text-[11px]">• 2 hours ago</span>
                    </div>
                    <p className="text-slate-500">Uploaded "Oct_2026_Ujala_Progress.pdf" for Project Ujala.</p>
                    <div className="mt-2 inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span className="text-[11px] font-bold text-slate-700">Oct_2026_Ujala_Progress.pdf</span>
                    </div>
                  </div>

                  {/* Timeline 2 */}
                  <div className="relative pl-6">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-2 border-blue-950" />
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">Completed Document Verification</span>
                      <span className="text-slate-400 text-[11px]">• Yesterday, 4:30 PM</span>
                    </div>
                    <p className="text-slate-500">Verified identity documents for 5 new student beneficiaries.</p>
                  </div>

                  {/* Timeline 3 */}
                  <div className="relative pl-6">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-white border-2 border-slate-300" />
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="font-extrabold text-slate-900">Joined Project Hope</span>
                      <span className="text-slate-400 text-[11px]">• 12 Oct 2026</span>
                    </div>
                    <p className="text-slate-500">Added as Lead Coordinator for upcoming winter drive.</p>
                  </div>

                </div>

                <button
                  onClick={() => alert('Loading additional timeline activities...')}
                  className="w-full mt-4 py-2 text-center text-blue-950 font-bold text-xs border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Load More Activity History
                </button>
              </div>

            </div>

          </section>

        </main>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <h3 className="text-lg font-black text-blue-950 border-b border-slate-100 pb-3">Edit User Profile</h3>
            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editableUser.name}
                  onChange={(e) => setEditableUser({ ...editableUser, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editableUser.email}
                    onChange={(e) => setEditableUser({ ...editableUser, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editableUser.phone || ''}
                    onChange={(e) => setEditableUser({ ...editableUser, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <input
                    type="text"
                    value={editableUser.role}
                    onChange={(e) => setEditableUser({ ...editableUser, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={editableUser.location}
                    onChange={(e) => setEditableUser({ ...editableUser, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-950 text-white font-extrabold rounded-xl shadow-md cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-black text-blue-950 border-b border-slate-100 pb-3">User Access Permissions</h3>
            <div className="space-y-2 text-slate-700">
              <label className="flex items-center gap-2 font-bold cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-200">
                <input type="checkbox" defaultChecked className="accent-blue-950 w-4 h-4" />
                <span>Field Data Collection & Entry</span>
              </label>
              <label className="flex items-center gap-2 font-bold cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-200">
                <input type="checkbox" defaultChecked className="accent-blue-950 w-4 h-4" />
                <span>View Regional Beneficiary Directory</span>
              </label>
              <label className="flex items-center gap-2 font-bold cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-200">
                <input type="checkbox" defaultChecked className="accent-blue-950 w-4 h-4" />
                <span>Generate Official Member Certificates</span>
              </label>
              <label className="flex items-center gap-2 font-bold cursor-pointer p-2 bg-slate-50 rounded-xl border border-slate-200">
                <input type="checkbox" className="accent-blue-950 w-4 h-4" />
                <span>Administrative Member Approvals (Coordinator privilege)</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-5 py-2 bg-blue-950 text-white font-bold rounded-xl cursor-pointer"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
