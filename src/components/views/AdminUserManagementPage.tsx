import React, { useState, useMemo } from 'react';
import { UserRecord, ViewMode } from '../../types';
import { ASSETS } from '../../data';
import { 
  Search, Download, CheckCircle, XCircle, Trash2, Filter, Eye, ArrowLeft, 
  Mail, Shield, UserCheck, Sparkles, Plus, Edit2, Ban, Check, ChevronLeft, ChevronRight,
  UserPlus, X, Phone, MapPin, Building, Users, Clock, Send
} from 'lucide-react';

interface AdminUserManagementPageProps {
  users: UserRecord[];
  onUpdateUserStatus: (id: string, status: 'Active' | 'Pending' | 'Inactive') => void;
  onDeleteUser: (id: string) => void;
  onAddUser?: (newUser: UserRecord) => void;
  onNavigate: (view: ViewMode) => void;
  onSelectUserForCardGen?: (user: UserRecord) => void;
  onSelectUserProfile?: (user: UserRecord) => void;
}

export const AdminUserManagementPage: React.FC<AdminUserManagementPageProps> = ({
  users,
  onUpdateUserStatus,
  onDeleteUser,
  onAddUser,
  onNavigate,
  onSelectUserForCardGen,
  onSelectUserProfile
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tabFilter, setTabFilter] = useState<'All' | 'Astha Didis' | 'Staff'>('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Unique departments for category filter
  const availableDepartments = useMemo(() => {
    const depts = new Set<string>();
    users.forEach((u) => {
      if (u.department) depts.add(u.department);
    });
    return Array.from(depts);
  }, [users]);
  
  // Modals state
  const [viewingUser, setViewingUser] = useState<UserRecord | null>(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);

  // Contact Selected Modal State
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState('Astha Didi Foundation - Volunteer Update');
  const [contactMessage, setContactMessage] = useState('');
  const [contactTemplate, setContactTemplate] = useState('custom');
  const [contactSentSuccess, setContactSentSuccess] = useState(false);

  // Selected Users list for contact modal
  const selectedUsers = useMemo(() => {
    return users.filter((u) => selectedIds.includes(u.id));
  }, [users, selectedIds]);

  const handleSelectTemplate = (type: string) => {
    setContactTemplate(type);
    if (type === 'status_update') {
      setContactSubject('Verification Status Update - Astha Didi Network');
      setContactMessage(
        'Dear Volunteer,\n\nWe are writing to update you regarding your registration status with the Astha Didi Foundation network. Please review your account profile and verify that your contact details and ID documents are up to date.\n\nWarm regards,\nAstha Didi Admin Team'
      );
    } else if (type === 'meeting_invite') {
      setContactSubject('Invitation: Upcoming Volunteer Monthly Sync & Orientation');
      setContactMessage(
        'Dear Volunteer,\n\nYou are invited to join our upcoming monthly coordinator and volunteer orientation session. Please confirm your availability by replying to this notification.\n\nBest regards,\nAstha Didi Administration'
      );
    } else if (type === 'training_reminder') {
      setContactSubject('Reminder: Community Health & Education Training Module');
      setContactMessage(
        'Hello Astha Didi / Volunteer,\n\nThis is a friendly reminder to complete your assigned community training module before the end of the month.\n\nThank you for your dedicated service!'
      );
    } else {
      setContactSubject('Astha Didi Foundation - Volunteer Notice');
      setContactMessage('');
    }
  };

  // New user form state
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Astha Didi',
    department: 'Education',
    location: 'Jaipur, RJ',
    qualification: 'Bachelor\'s Degree',
    organization: 'Astha Foundation',
    status: 'Active' as 'Active' | 'Pending' | 'Inactive',
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Status Counts Summary
  const statusCounts = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === 'Active').length;
    const pending = users.filter((u) => u.status === 'Pending').length;
    const inactive = users.filter((u) => u.status === 'Inactive').length;
    return { total, active, pending, inactive };
  }, [users]);

  // Filtered Users Logic
  const filtered = useMemo(() => {
    return users.filter((u) => {
      // Tab filter
      if (tabFilter === 'Astha Didis' && !u.role.toLowerCase().includes('didi')) {
        return false;
      }
      if (tabFilter === 'Staff' && (u.role.toLowerCase().includes('didi') || u.role.toLowerCase().includes('student'))) {
        return false;
      }

      // Search term (real-time across name, email, id, location, phone, role, department)
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term) ||
        u.id.toLowerCase().includes(term) ||
        u.location.toLowerCase().includes(term) ||
        (u.phone && u.phone.includes(term)) ||
        (u.department && u.department.toLowerCase().includes(term)) ||
        (u.role && u.role.toLowerCase().includes(term));

      // Role & Status & Category/Dept filters
      const matchesRole = roleFilter === 'All' || u.role.toLowerCase().includes(roleFilter.toLowerCase());
      const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
      const matchesDept = deptFilter === 'All' || (u.department && u.department.toLowerCase().includes(deptFilter.toLowerCase()));

      return matchesSearch && matchesRole && matchesStatus && matchesDept;
    });
  }, [users, searchTerm, tabFilter, roleFilter, statusFilter, deptFilter]);

  const hasActiveFilters = searchTerm !== '' || roleFilter !== 'All' || statusFilter !== 'All' || deptFilter !== 'All' || tabFilter !== 'All';

  const handleResetAllFilters = () => {
    setSearchTerm('');
    setRoleFilter('All');
    setStatusFilter('All');
    setDeptFilter('All');
    setTabFilter('All');
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedUsers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map(u => u.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Add User Form Submit
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.name || !newUserForm.email) {
      alert('Please fill in required fields (Name and Email).');
      return;
    }

    const newId = `AST-${Date.now().toString().slice(-4)}`;
    const createdUser: UserRecord = {
      id: newId,
      name: newUserForm.name,
      email: newUserForm.email,
      phone: newUserForm.phone || '+91 98765 00000',
      role: newUserForm.role,
      department: newUserForm.department,
      location: newUserForm.location,
      qualification: newUserForm.qualification,
      organization: newUserForm.organization,
      registrationDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: newUserForm.status,
      lastActive: 'Just now',
      avatar: ASSETS.adminAvatar,
      bloodGroup: 'O+'
    };

    if (onAddUser) {
      onAddUser(createdUser);
    }
    setIsAddUserModalOpen(false);
    setNewUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'Astha Didi',
      department: 'Education',
      location: 'Jaipur, RJ',
      qualification: 'Bachelor\'s Degree',
      organization: 'Astha Foundation',
      status: 'Active',
    });
  };

  // CSV Export Logic
  const handleExportCSV = (mode: 'all' | 'filtered' | 'selected' = 'filtered') => {
    let listToExport: UserRecord[] = users;
    if (mode === 'selected' && selectedIds.length > 0) {
      listToExport = users.filter(u => selectedIds.includes(u.id));
    } else if (mode === 'filtered') {
      listToExport = filtered;
    } else {
      listToExport = users;
    }

    if (listToExport.length === 0) {
      alert('No user records available to export.');
      return;
    }

    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Phone',
      'Role',
      'Department',
      'Location',
      'Qualification',
      'Organization',
      'Blood Group',
      'Valid Until',
      'Registration Date',
      'Last Active',
      'Status'
    ];

    const rows = listToExport.map(u => [
      `"${(u.id || '').replace(/"/g, '""')}"`,
      `"${(u.name || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${(u.phone || '').replace(/"/g, '""')}"`,
      `"${(u.role || '').replace(/"/g, '""')}"`,
      `"${(u.department || 'Education').replace(/"/g, '""')}"`,
      `"${(u.location || '').replace(/"/g, '""')}"`,
      `"${(u.qualification || '').replace(/"/g, '""')}"`,
      `"${(u.organization || '').replace(/"/g, '""')}"`,
      `"${(u.bloodGroup || '').replace(/"/g, '""')}"`,
      `"${(u.validUntil || '').replace(/"/g, '""')}"`,
      `"${(u.registrationDate || '').replace(/"/g, '""')}"`,
      `"${(u.lastActive || 'Recently').replace(/"/g, '""')}"`,
      `"${u.status || 'Active'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Astha_Users_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // PDF Export / Printable Record View
  const handleExportPDF = () => {
    const listToExport = filtered.length > 0 ? filtered : users;
    if (listToExport.length === 0) {
      alert('No user records available to export.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to generate the PDF report.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Astha Foundation - User Management Report (${new Date().toLocaleDateString()})</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; padding: 30px; margin: 0; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
            .header h1 { font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 5px 0; }
            .header p { font-size: 12px; color: #64748b; margin: 0; }
            .meta { display: flex; justify-content: space-between; font-size: 11px; color: #475569; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background-color: #f8fafc; color: #334155; font-weight: 800; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; }
            td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; color: #334155; }
            tr:nth-child(even) { background-color: #fcfcfc; }
            .badge { display: inline-block; padding: 3px 8px; border-radius: 9999px; font-size: 9px; font-weight: 700; background: #e0f2fe; color: #0369a1; }
            .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print {
              button { display: none !important; }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ASTHA FOUNDATION TRUST</h1>
            <p>Official User Management & Offline Records Report</p>
          </div>
          <div class="meta">
            <div><strong>Generated Date:</strong> ${new Date().toLocaleString()}</div>
            <div><strong>Total Records:</strong> ${listToExport.length}</div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Role</th>
                <th>Department</th>
                <th>Location</th>
                <th>Phone</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${listToExport.map(u => `
                <tr>
                  <td><strong>${u.id}</strong></td>
                  <td>${u.name}<br/><span style="color:#64748b; font-size:10px;">${u.email}</span></td>
                  <td><span class="badge">${u.role}</span></td>
                  <td>${u.department || 'Education'}</td>
                  <td>${u.location}</td>
                  <td>${u.phone || 'N/A'}</td>
                  <td><strong>${u.status}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>© Astha Foundation Management System • Confidential Offline Record</p>
          </div>
          <script>
            window.onload = function() {
              setTimeout(() => {
                window.print();
              }, 500);
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 pb-16 font-sans">
      
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="text-xs font-bold text-slate-500 hover:text-blue-950 flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </button>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
            User Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage platform access, roles, and user details.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExportCSV('filtered')}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download CSV file containing current user records"
          >
            <Download className="w-4 h-4 text-slate-700" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Export PDF document for offline records"
          >
            <Download className="w-4 h-4 text-rose-600" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="bg-blue-950 hover:bg-blue-900 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* Status Summary Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Users */}
        <button
          onClick={() => setStatusFilter('All')}
          className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between ${
            statusFilter === 'All'
              ? 'bg-blue-950 text-white border-blue-950 shadow-md ring-2 ring-blue-950/20'
              : 'bg-white text-slate-900 border-slate-200/80 hover:border-slate-300 shadow-2xs'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              statusFilter === 'All' ? 'text-blue-200' : 'text-slate-400'
            }`}>
              Total Users
            </span>
            <div className={`p-2 rounded-xl ${
              statusFilter === 'All' ? 'bg-blue-900/80 text-amber-400' : 'bg-slate-100 text-blue-950'
            }`}>
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black block leading-none">
              {statusCounts.total}
            </span>
            <span className={`text-[11px] font-medium mt-1.5 block ${
              statusFilter === 'All' ? 'text-blue-200' : 'text-slate-500'
            }`}>
              Registered in database
            </span>
          </div>
        </button>

        {/* Active Users */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Active' ? 'All' : 'Active')}
          className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between ${
            statusFilter === 'Active'
              ? 'bg-emerald-950 text-white border-emerald-900 shadow-md ring-2 ring-emerald-600/30'
              : 'bg-white text-slate-900 border-slate-200/80 hover:border-emerald-300 shadow-2xs'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              statusFilter === 'Active' ? 'text-emerald-200' : 'text-slate-400'
            }`}>
              Active Users
            </span>
            <div className={`p-2 rounded-xl ${
              statusFilter === 'Active' ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-50 text-emerald-700'
            }`}>
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className={`text-2xl sm:text-3xl font-black block leading-none ${
              statusFilter === 'Active' ? 'text-white' : 'text-emerald-600'
            }`}>
              {statusCounts.active}
            </span>
            <span className={`text-[11px] font-medium mt-1.5 block ${
              statusFilter === 'Active' ? 'text-emerald-200' : 'text-slate-500'
            }`}>
              Verified & active ({Math.round((statusCounts.active / (statusCounts.total || 1)) * 100)}%)
            </span>
          </div>
        </button>

        {/* Pending Approvals */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Pending' ? 'All' : 'Pending')}
          className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between ${
            statusFilter === 'Pending'
              ? 'bg-amber-950 text-white border-amber-900 shadow-md ring-2 ring-amber-500/30'
              : 'bg-white text-slate-900 border-slate-200/80 hover:border-amber-300 shadow-2xs'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              statusFilter === 'Pending' ? 'text-amber-200' : 'text-slate-400'
            }`}>
              Pending Approvals
            </span>
            <div className={`p-2 rounded-xl ${
              statusFilter === 'Pending' ? 'bg-amber-900 text-amber-300' : 'bg-amber-50 text-amber-600'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className={`text-2xl sm:text-3xl font-black block leading-none ${
              statusFilter === 'Pending' ? 'text-white' : 'text-amber-600'
            }`}>
              {statusCounts.pending}
            </span>
            <span className={`text-[11px] font-medium mt-1.5 block ${
              statusFilter === 'Pending' ? 'text-amber-200' : 'text-slate-500'
            }`}>
              Awaiting admin review
            </span>
          </div>
        </button>

        {/* Inactive Users */}
        <button
          onClick={() => setStatusFilter(statusFilter === 'Inactive' ? 'All' : 'Inactive')}
          className={`p-4 rounded-2xl border transition-all text-left cursor-pointer flex flex-col justify-between ${
            statusFilter === 'Inactive'
              ? 'bg-rose-950 text-white border-rose-900 shadow-md ring-2 ring-rose-500/30'
              : 'bg-white text-slate-900 border-slate-200/80 hover:border-rose-300 shadow-2xs'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              statusFilter === 'Inactive' ? 'text-rose-200' : 'text-slate-400'
            }`}>
              Inactive Users
            </span>
            <div className={`p-2 rounded-xl ${
              statusFilter === 'Inactive' ? 'bg-rose-900 text-rose-300' : 'bg-rose-50 text-rose-600'
            }`}>
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className={`text-2xl sm:text-3xl font-black block leading-none ${
              statusFilter === 'Inactive' ? 'text-white' : 'text-rose-600'
            }`}>
              {statusCounts.inactive}
            </span>
            <span className={`text-[11px] font-medium mt-1.5 block ${
              statusFilter === 'Inactive' ? 'text-rose-200' : 'text-slate-500'
            }`}>
              Deactivated / suspended
            </span>
          </div>
        </button>
      </div>

      {/* Main Data Table Container (Matching html design) */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col">
        
        {/* Filters & Tabs Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-slate-50/50">
          
          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-200/80 p-1 rounded-xl w-full lg:w-auto">
            {(['All', 'Astha Didis', 'Staff'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setTabFilter(tab);
                  setCurrentPage(1);
                }}
                className={`flex-1 lg:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tabFilter === tab
                    ? 'bg-white text-blue-950 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                {tab === 'All' ? 'All Users' : tab}
              </button>
            ))}
          </div>

          {/* Search & Filter Selects */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            
            {/* Real-time Search Input */}
            <div className="relative flex-1 lg:flex-initial lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search name, email, ID, location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium outline-none focus:ring-2 focus:ring-blue-950 transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded-full cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category / Department Filter */}
            <div className="relative flex-1 lg:flex-initial">
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer"
              >
                <option value="All">All Categories / Depts</option>
                {availableDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="relative flex-1 lg:flex-initial">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Didi">Astha Didi</option>
                <option value="Maa">Astha Maa</option>
                <option value="Teacher">Teacher</option>
                <option value="Student">Student</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Coordinator">Coordinator</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="relative flex-1 lg:flex-initial">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-950 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>
        </div>

        {/* Active Filter Badges & Search Results Bar */}
        <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-500 text-[11px] uppercase tracking-wider">
              Filter Results:
            </span>
            <span className="bg-blue-950/10 text-blue-950 font-extrabold px-2.5 py-0.5 rounded-md border border-blue-950/20 text-[11px]">
              Showing {filtered.length} of {users.length} volunteers
            </span>

            {searchTerm && (
              <span className="bg-white text-slate-800 font-semibold px-2 py-0.5 rounded-lg border border-slate-300 flex items-center gap-1 text-[11px]">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {deptFilter !== 'All' && (
              <span className="bg-white text-slate-800 font-semibold px-2 py-0.5 rounded-lg border border-slate-300 flex items-center gap-1 text-[11px]">
                Dept: {deptFilter}
                <button onClick={() => setDeptFilter('All')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {roleFilter !== 'All' && (
              <span className="bg-white text-slate-800 font-semibold px-2 py-0.5 rounded-lg border border-slate-300 flex items-center gap-1 text-[11px]">
                Role: {roleFilter}
                <button onClick={() => setRoleFilter('All')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {statusFilter !== 'All' && (
              <span className="bg-white text-slate-800 font-semibold px-2 py-0.5 rounded-lg border border-slate-300 flex items-center gap-1 text-[11px]">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')} className="hover:text-rose-600 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetAllFilters}
              className="text-rose-600 hover:text-rose-700 font-extrabold text-[11px] underline cursor-pointer"
            >
              Reset All Filters
            </button>
          )}
        </div>

        {/* Selected Action Bar & Floating Bulk Action Toolbar */}
        {selectedIds.length > 0 && (
          <div className="bg-blue-950 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-bold animate-in fade-in slide-in-from-top-2 border-b border-blue-900 shadow-inner">
            <div className="flex items-center gap-3">
              <span className="bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full text-[11px] font-black">
                {selectedIds.length} Selected
              </span>
              <button
                onClick={() => setSelectedIds([])}
                className="text-blue-200 hover:text-white underline text-[11px] font-medium cursor-pointer"
              >
                Clear selection
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Batch Active */}
              <button
                onClick={() => {
                  selectedIds.forEach(id => onUpdateUserStatus(id, 'Active'));
                  setSelectedIds([]);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Mark Active</span>
              </button>

              {/* Batch Pending */}
              <button
                onClick={() => {
                  selectedIds.forEach(id => onUpdateUserStatus(id, 'Pending'));
                  setSelectedIds([]);
                }}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span>Set Pending</span>
              </button>

              {/* Batch Inactive */}
              <button
                onClick={() => {
                  selectedIds.forEach(id => onUpdateUserStatus(id, 'Inactive'));
                  setSelectedIds([]);
                }}
                className="bg-rose-900/80 hover:bg-rose-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Deactivate</span>
              </button>

              <span className="text-blue-800/80">|</span>

              {/* Contact Selected */}
              <button
                onClick={() => {
                  setContactSentSuccess(false);
                  setIsContactModalOpen(true);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                title="Send pre-filled email notification to selected volunteers"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact Selected ({selectedIds.length})</span>
              </button>

              {/* Export Selected */}
              <button
                onClick={() => handleExportCSV('selected')}
                className="bg-blue-900 hover:bg-blue-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer border border-blue-800"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export ({selectedIds.length})</span>
              </button>

              {/* Delete Selected */}
              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${selectedIds.length} selected user(s)? This action cannot be undone.`)) {
                    selectedIds.forEach(id => onDeleteUser(id));
                    setSelectedIds([]);
                  }
                }}
                className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs ml-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Batch</span>
              </button>
            </div>
          </div>
        )}

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                <th className="p-4 pl-6 w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="accent-blue-950 w-4 h-4 rounded cursor-pointer"
                  />
                </th>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                    No users match your filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user) => {
                  const isChecked = selectedIds.includes(user.id);
                  const dept = user.department || 'Education';
                  const lastAct = user.lastActive || 'Today, 09:41 AM';

                  return (
                    <tr 
                      key={user.id} 
                      onClick={() => setViewingUser(user)}
                      className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      
                      {/* Checkbox */}
                      <td className="p-4 pl-6" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectOne(user.id)}
                          className="accent-blue-950 w-4 h-4 rounded cursor-pointer"
                        />
                      </td>

                      {/* User Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || ASSETS.adminAvatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-blue-950 text-xs leading-tight group-hover:text-amber-600 transition-colors">{user.name}</p>
                            <p className="text-[11px] text-slate-400">{user.email || user.phone}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="p-4">
                        {user.role.toLowerCase().includes('coordinator') && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-blue-950/10 text-blue-950">
                            Coordinator
                          </span>
                        )}
                        {user.role.toLowerCase().includes('didi') && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-orange-500/10 text-orange-700">
                            Astha Didi
                          </span>
                        )}
                        {user.role.toLowerCase().includes('maa') && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-purple-500/10 text-purple-700">
                            Astha Maa
                          </span>
                        )}
                        {!user.role.toLowerCase().includes('coordinator') &&
                         !user.role.toLowerCase().includes('didi') &&
                         !user.role.toLowerCase().includes('maa') && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-slate-100 text-slate-800">
                            {user.role}
                          </span>
                        )}
                      </td>

                      {/* Department */}
                      <td className="p-4 font-semibold text-slate-800">
                        {dept}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          user.status === 'Active'
                            ? 'bg-emerald-600/10 text-emerald-800'
                            : user.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-600/10 text-rose-800'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Active'
                              ? 'bg-emerald-600'
                              : user.status === 'Pending'
                              ? 'bg-amber-500'
                              : 'bg-rose-600'
                          }`} />
                          {user.status}
                        </span>
                      </td>

                      {/* Last Active */}
                      <td className="p-4 text-slate-500 font-medium">
                        {lastAct}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          
                          {/* View Profile */}
                          <button
                            onClick={() => setViewingUser(user)}
                            className="p-1.5 text-slate-500 hover:text-blue-950 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="View Profile Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Edit/Status Toggle */}
                          {user.status === 'Active' ? (
                            <button
                              onClick={() => onUpdateUserStatus(user.id, 'Inactive')}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Deactivate Member"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onUpdateUserStatus(user.id, 'Active')}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              title="Activate Member"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* ID Card Generator Shortcut */}
                          {onSelectUserForCardGen && (
                            <button
                              onClick={() => {
                                onSelectUserForCardGen(user);
                                onNavigate('admin-doc-generator');
                              }}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                              title="Generate Official ID Card"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => onDeleteUser(user.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50 text-xs font-medium text-slate-500">
          <p>
            Showing <span className="font-bold text-slate-900">{filtered.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> to <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of <span className="font-bold text-slate-900">{filtered.length}</span> results
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  currentPage === num
                    ? 'bg-blue-950 text-white shadow-2xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-300 rounded-lg bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* View User Detail Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header Banner */}
            <div className="bg-blue-950 text-white p-6 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-900">
              <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                  <img
                    src={viewingUser.avatar || ASSETS.adminAvatar}
                    alt={viewingUser.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-amber-400 shadow-md"
                  />
                  <span className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-blue-950 ${
                    viewingUser.status === 'Active' ? 'bg-emerald-500' : viewingUser.status === 'Pending' ? 'bg-amber-400' : 'bg-rose-500'
                  }`} />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-white tracking-tight">{viewingUser.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
                      {viewingUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 font-medium flex items-center gap-2">
                    <span>ID: <strong className="font-mono text-white">{viewingUser.id}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {viewingUser.location}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setViewingUser(null)}
                className="absolute top-4 right-4 text-blue-200 hover:text-white p-1.5 rounded-full hover:bg-blue-900/60 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              
              {/* Status and Department Quick Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Current Status</p>
                  <p className={`font-black text-xs mt-0.5 flex items-center gap-1.5 ${
                    viewingUser.status === 'Active' ? 'text-emerald-700' : viewingUser.status === 'Pending' ? 'text-slate-700' : 'text-rose-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      viewingUser.status === 'Active' ? 'bg-emerald-600' : viewingUser.status === 'Pending' ? 'bg-slate-400' : 'bg-rose-600'
                    }`} />
                    {viewingUser.status}
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Department</p>
                  <p className="font-black text-slate-900 text-xs mt-0.5">{viewingUser.department || 'Education'}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Blood Group</p>
                  <p className="font-black text-rose-600 text-xs mt-0.5">{viewingUser.bloodGroup || 'O+'}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Last Active</p>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{viewingUser.lastActive || 'Today, 09:41 AM'}</p>
                </div>
              </div>

              {/* Personal & Contact Details */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-blue-950" />
                  <span>Contact & Profile Attributes</span>
                </h4>
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 divide-y divide-slate-200/60 space-y-2">
                  <div className="flex justify-between items-center pt-1 pb-1">
                    <span className="font-bold text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      Email Address:
                    </span>
                    <a href={`mailto:${viewingUser.email}`} className="font-bold text-blue-950 hover:underline">
                      {viewingUser.email}
                    </a>
                  </div>

                  <div className="flex justify-between items-center pt-2 pb-1">
                    <span className="font-bold text-slate-500 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      Phone Number:
                    </span>
                    <a href={`tel:${viewingUser.phone || '+919876543210'}`} className="font-bold text-slate-900 hover:underline">
                      {viewingUser.phone || '+91 98765 43210'}
                    </a>
                  </div>

                  <div className="flex justify-between items-center pt-2 pb-1">
                    <span className="font-bold text-slate-500 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      Organization / Institute:
                    </span>
                    <span className="font-semibold text-slate-900">{viewingUser.organization || 'Astha Foundation Wing'}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 pb-1">
                    <span className="font-bold text-slate-500 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      Highest Qualification:
                    </span>
                    <span className="font-semibold text-slate-900">{viewingUser.qualification || 'Bachelor\'s Degree'}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2 pb-0.5">
                    <span className="font-bold text-slate-500">ID Validity Period:</span>
                    <span className="font-mono text-slate-800 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-bold">
                      {viewingUser.validUntil || '31/12/2026'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Responsibilities Summary */}
              <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <Shield className="w-4 h-4 text-blue-950 shrink-0" />
                  <h5 className="font-black text-blue-950 text-xs">Role Capabilities & Platform Permissions</h5>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {viewingUser.role.toLowerCase().includes('didi') && 'Authorized field representative for community outreach, health awareness drives, women empowerment programs, and grassroots data collection.'}
                  {viewingUser.role.toLowerCase().includes('coordinator') && 'District supervisor responsible for volunteer management, project scheduling, resource allocation, and administrative approval workflows.'}
                  {viewingUser.role.toLowerCase().includes('maa') && 'Community leader and senior advisor overseeing local maternal health initiatives and village level support networks.'}
                  {!viewingUser.role.toLowerCase().includes('didi') && !viewingUser.role.toLowerCase().includes('coordinator') && !viewingUser.role.toLowerCase().includes('maa') && 'Active foundation member with standard portal access, certificate generation privileges, and project participation tracking.'}
                </p>
              </div>

            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center gap-2">
                {viewingUser.status === 'Active' ? (
                  <button
                    onClick={() => {
                      onUpdateUserStatus(viewingUser.id, 'Inactive');
                      setViewingUser(prev => prev ? { ...prev, status: 'Inactive' } : null);
                    }}
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Deactivate</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onUpdateUserStatus(viewingUser.id, 'Active');
                      setViewingUser(prev => prev ? { ...prev, status: 'Active' } : null);
                    }}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Activate User</span>
                  </button>
                )}

                {onSelectUserForCardGen && (
                  <button
                    onClick={() => {
                      onSelectUserForCardGen(viewingUser);
                      setViewingUser(null);
                      onNavigate('admin-doc-generator');
                    }}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    <span>Generate ID Card</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectUserProfile) {
                      onSelectUserProfile(viewingUser);
                    }
                    setViewingUser(null);
                    onNavigate('admin-user-profile');
                  }}
                  className="px-3.5 py-2 bg-blue-950 hover:bg-blue-900 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Profile Page</span>
                </button>

                <button
                  onClick={() => setViewingUser(null)}
                  className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-950" />
                <h3 className="text-base font-bold text-blue-950">Add New User / Member</h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meena Kumari"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="meena@example.com"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 00000"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-bold text-slate-800"
                  >
                    <option value="Astha Didi">Astha Didi</option>
                    <option value="Astha Maa">Astha Maa</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Volunteer">Volunteer</option>
                    <option value="District Coordinator">District Coordinator</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <select
                    value={newUserForm.department}
                    onChange={(e) => setNewUserForm({ ...newUserForm, department: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-bold text-slate-800"
                  >
                    <option value="Education">Education</option>
                    <option value="Health - Rural">Health - Rural</option>
                    <option value="Management">Management</option>
                    <option value="Events">Events</option>
                    <option value="Community">Community</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Jaipur, Rajasthan"
                    value={newUserForm.location}
                    onChange={(e) => setNewUserForm({ ...newUserForm, location: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Status</label>
                  <select
                    value={newUserForm.status}
                    onChange={(e) => setNewUserForm({ ...newUserForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-950 font-bold text-slate-800"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-950 hover:bg-blue-900 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contact Selected Users Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200/80 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-2xl">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Contact Selected Volunteers</h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Send a pre-filled email notification or announcement to {selectedUsers.length} selected user(s)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {contactSentSuccess ? (
              <div className="text-center py-8 px-4 animate-in zoom-in-95">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">Notification Sent Successfully!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto mb-6">
                  Email notification dispatched to <strong className="text-slate-900">{selectedUsers.length} selected volunteer(s)</strong>.
                </p>
                <button
                  onClick={() => {
                    setIsContactModalOpen(false);
                    setContactSentSuccess(false);
                    setSelectedIds([]);
                  }}
                  className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  Done & Clear Selection
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!contactSubject.trim() || !contactMessage.trim()) {
                    alert('Please provide both a subject line and a message body.');
                    return;
                  }
                  setContactSentSuccess(true);
                }}
                className="space-y-4"
              >
                {/* Recipients List */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Recipients ({selectedUsers.length})
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 max-h-28 overflow-y-auto flex flex-wrap gap-1.5">
                    {selectedUsers.length > 0 ? (
                      selectedUsers.map((u) => (
                        <span
                          key={u.id}
                          className="inline-flex items-center gap-1 bg-white border border-slate-300 text-slate-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-2xs"
                        >
                          <span className="font-bold">{u.name}</span>
                          <span className="text-slate-400 text-[10px]">({u.email})</span>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No volunteers selected</span>
                    )}
                  </div>
                </div>

                {/* Quick Templates */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Quick Templates
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'custom', label: 'Custom Message' },
                      { id: 'status_update', label: 'Status Verification' },
                      { id: 'meeting_invite', label: 'Orientation Invite' },
                      { id: 'training_reminder', label: 'Training Reminder' },
                    ].map((tpl) => (
                      <button
                        type="button"
                        key={tpl.id}
                        onClick={() => handleSelectTemplate(tpl.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          contactTemplate === tpl.id
                            ? 'bg-blue-950 text-white border-blue-950 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        {tpl.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    placeholder="Enter email subject..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-950"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Message Body
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Type your message to the selected volunteers here..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-blue-950 resize-y"
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end items-center gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Notification ({selectedUsers.length})</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
