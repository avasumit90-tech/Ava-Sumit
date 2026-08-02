import React, { useState, useEffect } from 'react';
import { ViewMode, UserRecord, ProjectItem, ActivityItem } from '../../types';
import { ASSETS } from '../../data';
import { UserDashboardPage } from './UserDashboardPage';
import { VolunteerLeaderboard } from '../VolunteerLeaderboard';
import { getAllDonations, DonationSubmission } from '../../utils/donationStorage';
import { 
  Users, Heart, Clock, FolderPlus, TrendingUp, Search, Plus, ArrowRight, 
  Shield, CheckCircle, FileText, Bell, Eye, RefreshCw, Sparkles, DollarSign,
  BarChart3, Calendar, Filter
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';

interface AdminDashboardPageProps {
  onNavigate: (view: ViewMode) => void;
  users: UserRecord[];
  projects: ProjectItem[];
  activities: ActivityItem[];
  onAddProject: (project: ProjectItem) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigate,
  users,
  projects,
  activities,
  onAddProject
}) => {
  const [perspective, setPerspective] = useState<'admin' | 'volunteer'>('admin');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Education' | 'Health' | 'Environment' | 'Community'>('Education');
  const [newGoal, setNewGoal] = useState('25000');
  const [newDesc, setNewDesc] = useState('');
  const [donations, setDonations] = useState<DonationSubmission[]>([]);
  const [chartMode, setChartMode] = useState<'area' | 'bar'>('area');

  useEffect(() => {
    const load = () => setDonations(getAllDonations());
    load();
    window.addEventListener('ava_donations_updated', load);
    return () => window.removeEventListener('ava_donations_updated', load);
  }, []);

  const augApproved = donations
    .filter(d => d.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const augPending = donations
    .filter(d => d.status === 'Pending (24 Hours)')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const donationTrendsData = [
    { month: 'Mar', Approved: 18500, Pending: 1200, Goal: 20000 },
    { month: 'Apr', Approved: 24200, Pending: 1800, Goal: 25000 },
    { month: 'May', Approved: 31000, Pending: 2400, Goal: 30000 },
    { month: 'Jun', Approved: 38500, Pending: 3100, Goal: 35000 },
    { month: 'Jul', Approved: 42000, Pending: 4500, Goal: 40000 },
    { month: 'Aug', Approved: Math.max(augApproved, 19700), Pending: augPending, Goal: 45000 },
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: ProjectItem = {
      id: `PRJ-${Math.floor(10 + Math.random() * 90)}`,
      title: newTitle,
      category: newCategory,
      description: newDesc || 'Community development initiative by Astha Foundation.',
      raised: 0,
      goal: parseFloat(newGoal) || 10000,
      image: newCategory === 'Education' ? ASSETS.ruralEduProject : ASSETS.cleanWaterProject,
      status: 'Active'
    };

    onAddProject(created);
    setShowAddProjectModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const pendingUsers = users.filter(u => u.status === 'Pending').length;

  return (
    <div className="space-y-8 pb-12">
      
      {/* Persistent Header Bar with Perspective Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {perspective === 'admin' ? 'System Admin' : 'Volunteer Preview'}
            </span>
            <span className="text-xs text-slate-400">Live Operation Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <span>Administrative Portal</span>
            {perspective === 'volunteer' && (
              <span className="text-xs bg-amber-500 text-slate-950 font-extrabold px-2.5 py-1 rounded-xl uppercase tracking-wider">
                Viewing as Volunteer
              </span>
            )}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Animated Perspective Switcher Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 relative">
            <div
              className={`absolute top-1 bottom-1 rounded-xl transition-all duration-300 ease-out shadow-xs ${
                perspective === 'admin'
                  ? 'left-1 w-[80px] bg-slate-900'
                  : 'left-[85px] w-[138px] bg-amber-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setPerspective('admin')}
              className={`relative px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer z-10 ${
                perspective === 'admin' ? 'text-white font-extrabold' : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setPerspective('volunteer')}
              className={`relative px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 cursor-pointer z-10 ${
                perspective === 'volunteer' ? 'text-slate-950 font-black' : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Volunteer / Didi</span>
            </button>
          </div>

          <button
            onClick={() => onNavigate('admin-applications')}
            className="bg-blue-950 hover:bg-blue-900 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Applications List</span>
          </button>

          <button
            onClick={() => onNavigate('admin-application-review')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
          >
            <Eye className="w-4 h-4 text-slate-950" />
            <span>Review Mode</span>
          </button>

          <button
            onClick={() => onNavigate('admin-users')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-slate-600" />
            <span>Manage Users</span>
          </button>

          <button
            onClick={() => onNavigate('admin-doc-generator')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>ID Card Generator</span>
          </button>

          <button
            onClick={() => setShowAddProjectModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Smoothly Animated Perspective View Transition */}
      <div className="transition-all duration-300 ease-in-out">
        {perspective === 'volunteer' ? (
          <div
            key="volunteer-perspective"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {/* Test Perspective Banner */}
            <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl font-bold text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md border border-amber-400">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-950 text-white flex items-center justify-center shrink-0">
                  <Eye className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="font-black text-sm text-slate-950">UI Perspective Test Mode Active</p>
                  <p className="text-[11px] text-slate-900 font-medium">
                    Currently testing the platform layout from a <strong>Volunteer / Astha Didi</strong> member view.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPerspective('admin')}
                className="bg-slate-950 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition-colors shadow-xs flex items-center gap-2 shrink-0"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Switch Back to Admin View</span>
              </button>
            </div>

            {/* Embedded Volunteer Dashboard */}
            <UserDashboardPage onNavigate={onNavigate} />
          </div>
        ) : (
          <div
            key="admin-perspective"
            className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {/* Overview KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Members</span>
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">12,450</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ +12% from last month</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Raised</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Heart className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">₹450.2k</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1">↑ +8% active donations</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3 cursor-pointer hover:border-amber-400 transition-colors" onClick={() => onNavigate('admin-users')}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Pending Review</span>
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{pendingUsers}</p>
                  <p className="text-[11px] text-amber-700 font-bold mt-1">Requires admin approval</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase">Active Projects</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                    <FolderPlus className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{projects.length}</p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-1">Across 45 Districts</p>
                </div>
              </div>

            </div>

            {/* Recharts Donation Trends & Monthly Giving Insights */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-900 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Financial Intelligence
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">Live Recharts Engine</span>
                  </div>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-emerald-600" />
                    <span>Donation Trends & Monthly Giving Patterns</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Analyzing approved funding vs. pending 24H verification against target funding goals.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Chart Type Toggle */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600 border border-slate-200">
                    <button
                      onClick={() => setChartMode('area')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        chartMode === 'area' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
                      }`}
                    >
                      Area Chart
                    </button>
                    <button
                      onClick={() => setChartMode('bar')}
                      className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        chartMode === 'bar' ? 'bg-white text-slate-900 shadow-2xs font-extrabold' : 'hover:text-slate-900'
                      }`}
                    >
                      Bar Chart
                    </button>
                  </div>

                  <button
                    onClick={() => onNavigate('admin-donations')}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-3.5 py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs shrink-0"
                  >
                    <span>Manage Database</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Monthly Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Avg Monthly Growth</span>
                  <p className="font-black text-emerald-700 text-base mt-0.5 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>+18.4%</span>
                  </p>
                </div>
                <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-800 uppercase">Current Month Target</span>
                  <p className="font-black text-blue-900 text-base mt-0.5">₹45,000</p>
                </div>
                <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-100">
                  <span className="text-[10px] font-bold text-amber-900 uppercase">Pending Review (24H)</span>
                  <p className="font-black text-amber-700 text-base mt-0.5">₹{augPending.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Avg Donation Size</span>
                  <p className="font-black text-slate-900 text-base mt-0.5">₹4,850</p>
                </div>
              </div>

              {/* Recharts Canvas */}
              <div className="w-full h-72 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  {chartMode === 'area' ? (
                    <AreaChart data={donationTrendsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05}/>
                        </linearGradient>
                        <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip 
                        formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="Approved" name="Approved Funds" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorApproved)" />
                      <Area type="monotone" dataKey="Pending" name="Pending Verification (24H)" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorPending)" />
                      <Area type="monotone" dataKey="Goal" name="Target Goal" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorGoal)" />
                    </AreaChart>
                  ) : (
                    <BarChart data={donationTrendsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val / 1000}k`} />
                      <Tooltip 
                        formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '12px', fontWeight: 'bold' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: 'bold' }} />
                      <Bar dataKey="Approved" name="Approved Funds" fill="#10b981" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Pending" name="Pending Verification (24H)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                      <Bar dataKey="Goal" name="Target Goal" fill="#93c5fd" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Main Grid: User Growth & Activity Log */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Visual User Distribution */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">User Registration Growth</h3>
                    <p className="text-xs text-slate-500">Monthly breakdown across roles</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> Mentors
                    <span className="w-3 h-3 rounded-full bg-blue-900 inline-block" /> Students
                  </div>
                </div>

                {/* Custom Styled Visual Bar Chart */}
                <div className="space-y-4 pt-2">
                  {[
                    { month: 'May', mentors: 120, students: 450 },
                    { month: 'Jun', mentors: 180, students: 620 },
                    { month: 'Jul', mentors: 250, students: 890 },
                    { month: 'Aug', mentors: 310, students: 1100 },
                    { month: 'Sep', mentors: 420, students: 1450 },
                    { month: 'Oct', mentors: 580, students: 1820 }
                  ].map((row, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{row.month}</span>
                        <span>{row.mentors + row.students} Registrations</span>
                      </div>
                      <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden flex">
                        <div className="bg-amber-500 h-full" style={{ width: `${(row.mentors / 2400) * 100}%` }} />
                        <div className="bg-blue-900 h-full" style={{ width: `${(row.students / 2400) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold">
                  <button onClick={() => onNavigate('admin-users')} className="text-amber-700 hover:underline flex items-center gap-1 cursor-pointer">
                    <span>View User Database</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-400">Database Synced</span>
                </div>
              </div>

              {/* Right Column: Live Activity Feed */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Recent Activity Feed</h3>
                    <p className="text-xs text-slate-500">Real-time foundation logs</p>
                  </div>
                  <Bell className="w-5 h-5 text-slate-400" />
                </div>

                <div className="space-y-4">
                  {activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        <span className="material-symbols-outlined text-base">{act.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 truncate">{act.title}</p>
                        <p className="text-[10px] text-slate-500 font-medium">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => onNavigate('admin-users')}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Review Registrations ({pendingUsers} Pending)
                </button>
              </div>

            </div>

            {/* Volunteer Leaderboard in Admin View */}
            <VolunteerLeaderboard 
              title="Top Volunteer Performance Directory" 
              compact={false}
            />
          </div>
        )}
      </div>

      {/* Add New Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900">Create New Foundation Project</h3>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Classroom Drive"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e: any) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                >
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Environment">Environment</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Funding Goal (₹)</label>
                <input
                  type="number"
                  required
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Summary of project goals and reach..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-extrabold shadow-md cursor-pointer"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
