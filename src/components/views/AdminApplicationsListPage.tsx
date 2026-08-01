import React, { useState, useMemo } from 'react';
import { 
  Search, Download, ChevronLeft, ChevronRight, MoreVertical, 
  CheckCircle, XCircle, Clock, Eye, Filter, Plus, ArrowLeft,
  LayoutDashboard, Folder, Group, HeartHandshake, Settings, LogOut,
  UserCheck, ShieldCheck, Mail, Phone, Calendar
} from 'lucide-react';
import { ViewMode } from '../../types';

export interface ApplicationRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  appliedDate: string;
  status: 'Pending' | 'Verified' | 'Rejected';
  avatar?: string;
  location: string;
}

interface AdminApplicationsListPageProps {
  onNavigate: (view: ViewMode) => void;
  onSelectApplication?: (id: string) => void;
}

export const AdminApplicationsListPage: React.FC<AdminApplicationsListPageProps> = ({
  onNavigate,
  onSelectApplication,
}) => {
  // Sample applications dataset
  const [applications, setApplications] = useState<ApplicationRecord[]>([
    {
      id: 'APP-101',
      name: 'Priya Sharma',
      email: 'priya.s@example.com',
      phone: '+91 98765 43210',
      role: 'Astha Didi',
      appliedDate: 'Oct 12, 2023',
      status: 'Pending',
      location: 'Jaipur, Rajasthan',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 'APP-102',
      name: 'Rahul Verma',
      email: 'r.verma89@email.com',
      phone: '+91 98123 45678',
      role: 'General Volunteer',
      appliedDate: 'Oct 10, 2023',
      status: 'Verified',
      location: 'New Delhi',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 'APP-103',
      name: 'Anjali Gupta',
      email: 'anjali.g@mail.com',
      phone: '+91 97654 32109',
      role: 'Astha Didi',
      appliedDate: 'Oct 08, 2023',
      status: 'Rejected',
      location: 'Lucknow, UP',
    },
    {
      id: 'APP-104',
      name: 'Suresh Kumar',
      email: 'suresh.k@test.com',
      phone: '+91 91234 56789',
      role: 'General Volunteer',
      appliedDate: 'Oct 05, 2023',
      status: 'Pending',
      location: 'Patna, Bihar',
    },
    {
      id: 'APP-105',
      name: 'Kavita Joshi',
      email: 'kavita.j@ngo.org',
      phone: '+91 98234 11223',
      role: 'Field Educator',
      appliedDate: 'Oct 03, 2023',
      status: 'Verified',
      location: 'Ahmedabad, Gujarat',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    },
    {
      id: 'APP-106',
      name: 'Manish Singh',
      email: 'manish.s@domain.com',
      phone: '+91 99887 76655',
      role: 'Community Coordinator',
      appliedDate: 'Sep 28, 2023',
      status: 'Pending',
      location: 'Indore, MP',
    },
    {
      id: 'APP-107',
      name: 'Sunita Meena',
      email: 'sunita.m@gmail.com',
      phone: '+91 97112 33445',
      role: 'Astha Didi',
      appliedDate: 'Sep 25, 2023',
      status: 'Verified',
      location: 'Udaipur, Rajasthan',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filtered dataset
  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        app.name.toLowerCase().includes(q) ||
        app.email.toLowerCase().includes(q) ||
        app.location.toLowerCase().includes(q) ||
        app.id.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === 'all' || app.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesRole =
        roleFilter === 'all' || app.role.toLowerCase() === roleFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [applications, searchQuery, statusFilter, roleFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV Handler
  const handleExportCSV = () => {
    if (filtered.length === 0) {
      alert('No application records to export.');
      return;
    }

    const headers = ['Application ID', 'Name', 'Email', 'Phone', 'Program / Role', 'Applied Date', 'Location', 'Status'];
    const rows = filtered.map((app) => [
      `"${app.id}"`,
      `"${app.name.replace(/"/g, '""')}"`,
      `"${app.email.replace(/"/g, '""')}"`,
      `"${app.phone.replace(/"/g, '""')}"`,
      `"${app.role.replace(/"/g, '""')}"`,
      `"${app.appliedDate}"`,
      `"${app.location.replace(/"/g, '""')}"`,
      `"${app.status}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Astha_Volunteer_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const updateStatus = (id: string, newStatus: 'Pending' | 'Verified' | 'Rejected') => {
    const targetApp = applications.find(a => a.id === id);
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    setActiveMenuId(null);
    if (newStatus === 'Verified' && targetApp) {
      triggerToast(`🎉 Success! ${targetApp.name} has been successfully onboarded as ${targetApp.role}!`);
    }
  };

  const handleReviewClick = (id: string) => {
    if (onSelectApplication) onSelectApplication(id);
    onNavigate('admin-application-review');
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition-colors"
          >
            <Folder className="w-4 h-4" />
            <span>Projects</span>
          </button>

          <button
            onClick={() => onNavigate('admin-applications')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-amber-400 bg-blue-900/80 border-l-4 border-amber-500 shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Volunteers / Applications</span>
          </button>

          <button
            onClick={() => onNavigate('admin-users')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition-colors"
          >
            <Group className="w-4 h-4" />
            <span>All Members Database</span>
          </button>

          <button
            onClick={() => onNavigate('admin-doc-generator')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-blue-200 hover:bg-blue-900/60 transition-colors"
          >
            <UserCheck className="w-4 h-4" />
            <span>ID Card Generator</span>
          </button>
        </nav>

        <div className="p-4 border-t border-blue-900/50 space-y-3">
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-blue-950 rounded-xl text-xs font-extrabold shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-blue-300 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navigation Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="md:hidden text-slate-700 hover:text-blue-950 p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-blue-950 tracking-tight">Astha Foundation Admin</h2>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 w-48 sm:w-60 transition-all"
              />
            </div>

            <button
              onClick={() => onNavigate('donate')}
              className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-colors hidden sm:inline-block shadow-2xs"
            >
              Donate
            </button>

            <div className="w-9 h-9 rounded-full bg-blue-950 text-amber-400 font-bold text-xs flex items-center justify-center border-2 border-slate-200">
              AD
            </div>
          </div>
        </header>

        {/* Canvas Body */}
        <main className="p-4 sm:p-6 md:p-8 space-y-6 max-w-[1280px] w-full mx-auto">
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-blue-950 tracking-tight">Volunteer Applications</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Showing <span className="font-bold text-slate-800">{filtered.length}</span> total application record(s)
              </p>
            </div>

            {/* Controls / Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Search Bar Mobile/Desktop */}
              <div className="relative flex-1 sm:flex-initial min-w-[180px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search names or email..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>

              {/* Status Filter Dropdown */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer"
              >
                <option value="all">Status: All</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Role Filter Dropdown */}
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer hidden sm:block"
              >
                <option value="all">Program: All</option>
                <option value="Astha Didi">Astha Didi</option>
                <option value="General Volunteer">General Volunteer</option>
                <option value="Field Educator">Field Educator</option>
                <option value="Community Coordinator">Community Coordinator</option>
              </select>

              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-blue-950 font-bold text-xs rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-950" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Applications Data Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-[0_4px_20px_rgba(26,35,126,0.05)] overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="p-4">Applicant</th>
                    <th className="p-4">Program</th>
                    <th className="p-4">Applied Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-xs">
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No volunteer applications found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                        
                        {/* Applicant Name & Email */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {app.avatar ? (
                              <img
                                src={app.avatar}
                                alt={app.name}
                                className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-blue-950 text-amber-400 font-bold flex items-center justify-center shrink-0 border border-slate-200">
                                {app.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                            )}

                            <div>
                              <p className="font-bold text-blue-950 text-xs leading-tight">{app.name}</p>
                              <p className="text-[11px] text-slate-400">{app.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Program */}
                        <td className="p-4 font-semibold text-slate-800">
                          {app.role}
                        </td>

                        {/* Applied Date */}
                        <td className="p-4 text-slate-500 font-medium">
                          {app.appliedDate}
                        </td>

                        {/* Status Badge */}
                        <td className="p-4">
                          {app.status === 'Pending' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">
                              <Clock className="w-3 h-3 mr-1" />
                              Pending
                            </span>
                          )}
                          {app.status === 'Verified' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/10 text-emerald-700 border border-emerald-600/20">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </span>
                          )}
                          {app.status === 'Rejected' && (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-600/10 text-rose-700 border border-rose-600/20">
                              <XCircle className="w-3 h-3 mr-1" />
                              Rejected
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right relative">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleReviewClick(app.id)}
                              className="px-3 py-1.5 border border-slate-300 text-blue-950 hover:bg-blue-950 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs"
                            >
                              Review
                            </button>

                            <div className="relative">
                              <button
                                onClick={() => setActiveMenuId(activeMenuId === app.id ? null : app.id)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>

                              {/* Dropdown Menu */}
                              {activeMenuId === app.id && (
                                <div className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 w-44 text-left animate-in fade-in duration-150">
                                  <button
                                    onClick={() => handleReviewClick(app.id)}
                                    className="w-full px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-blue-950" />
                                    <span>Full Application</span>
                                  </button>

                                  <button
                                    onClick={() => updateStatus(app.id, 'Verified')}
                                    className="w-full px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>Mark Verified</span>
                                  </button>

                                  <button
                                    onClick={() => updateStatus(app.id, 'Rejected')}
                                    className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>Mark Rejected</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="bg-slate-50/80 border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-medium text-slate-500">
              <div>
                Showing{' '}
                <span className="font-bold text-slate-900">
                  {filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                </span>{' '}
                to{' '}
                <span className="font-bold text-slate-900">
                  {Math.min(currentPage * itemsPerPage, filtered.length)}
                </span>{' '}
                of <span className="font-bold text-slate-900">{filtered.length}</span> entries
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-blue-950 text-white shadow-2xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

        </main>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl border border-amber-500/30 flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">
            ✓
          </div>
          <div>
            <p className="text-xs font-bold text-amber-400">Onboarding Notification</p>
            <p className="text-xs text-slate-100 font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

    </div>
  );
};
