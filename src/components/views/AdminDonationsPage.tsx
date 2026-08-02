import React, { useState, useEffect, useMemo } from 'react';
import { ViewMode } from '../../types';
import { 
  Heart, Search, Download, CheckCircle, Shield, Plus, DollarSign, FileText, 
  QrCode, Clock, Eye, Check, X, AlertCircle, Image as ImageIcon, Filter, RefreshCw,
  Award, Trophy, Crown, Sparkles, Medal, Bell
} from 'lucide-react';
import { 
  getAllDonations, 
  updateDonationStatus, 
  deleteDonation, 
  saveDonationSubmission,
  DonationSubmission 
} from '../../utils/donationStorage';

interface AdminDonationsPageProps {
  onNavigate: (view: ViewMode) => void;
}

export const AdminDonationsPage: React.FC<AdminDonationsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [donations, setDonations] = useState<DonationSubmission[]>([]);
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<DonationSubmission | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<DonationSubmission | null>(null);
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [realtimeAlert, setRealtimeAlert] = useState<DonationSubmission | null>(null);

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3500);
  };

  const loadDonations = () => {
    const list = getAllDonations();
    setDonations(list);
  };

  useEffect(() => {
    loadDonations();
    const handleUpdate = (e: Event) => {
      loadDonations();
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.donorName && customEvent.detail.amount) {
        const sub = customEvent.detail as DonationSubmission;
        if (sub.status === 'Pending (24 Hours)') {
          setRealtimeAlert(sub);
        }
      }
    };
    window.addEventListener('ava_donations_updated', handleUpdate);
    return () => window.removeEventListener('ava_donations_updated', handleUpdate);
  }, []);

  const simulateNewSubmission = () => {
    const mockNames = ['Vikram Sethi', 'Ananya Roy', 'Siddharth Nair', 'Kavita Iyer'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const mockAmounts = [2500, 5000, 10000, 15000];
    const randomAmount = mockAmounts[Math.floor(Math.random() * mockAmounts.length)];
    
    saveDonationSubmission({
      donorName: randomName,
      email: `${randomName.toLowerCase().replace(' ', '.')}@example.com`,
      amount: randomAmount,
      transactionId: 'UPI-' + Math.floor(100000000000 + Math.random() * 900000000000),
      screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      paymentMethod: 'upi',
      status: 'Pending (24 Hours)',
      donorPan: 'ABCDE1234F',
      remarks: 'Real-time submission with attached UPI payment verification screenshot.'
    });
  };

  const handleApprove = (id: string, donorName: string) => {
    updateDonationStatus(id, 'Approved', 'Verified bank credit & UPI Txn ID by Admin.');
    showToast(`Donation for ${donorName} APPROVED! 80G Tax Receipt generated.`);
    if (selectedSubmissionForReview?.id === id) {
      setSelectedSubmissionForReview(prev => prev ? { ...prev, status: 'Approved' } : null);
    }
  };

  const handleReject = (id: string, donorName: string) => {
    const reason = prompt('Enter rejection reason (e.g. Invalid UTR / Payment not credited):') || 'Payment credit unverified';
    updateDonationStatus(id, 'Rejected', reason);
    showToast(`Donation submission for ${donorName} set to REJECTED.`);
    if (selectedSubmissionForReview?.id === id) {
      setSelectedSubmissionForReview(prev => prev ? { ...prev, status: 'Rejected' } : null);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this donation record from the database?')) {
      deleteDonation(id);
      showToast('Donation record removed.');
      if (selectedSubmissionForReview?.id === id) {
        setSelectedSubmissionForReview(null);
      }
    }
  };

  const filteredDonations = donations.filter(d => {
    const matchesSearch = 
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedTab === 'Pending') return d.status === 'Pending (24 Hours)';
    if (selectedTab === 'Approved') return d.status === 'Approved';
    if (selectedTab === 'Rejected') return d.status === 'Rejected';
    return true;
  });

  const totalApprovedAmount = donations
    .filter(d => d.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingCount = donations.filter(d => d.status === 'Pending (24 Hours)').length;

  const topDonors = useMemo(() => {
    const map: Record<string, { donorName: string; email: string; totalAmount: number; count: number; lastDate: string; pan?: string }> = {};

    donations.forEach(d => {
      const key = (d.email || d.donorName || 'unknown').toLowerCase().trim();
      if (!map[key]) {
        map[key] = {
          donorName: d.donorName || 'Valued Donor',
          email: d.email || 'donor@example.com',
          totalAmount: 0,
          count: 0,
          lastDate: d.date || 'Recent',
          pan: d.donorPan
        };
      }
      map[key].totalAmount += d.amount || 0;
      map[key].count += 1;
      if (d.date && d.date > map[key].lastDate) {
        map[key].lastDate = d.date;
      }
      if (d.donorPan && !map[key].pan) {
        map[key].pan = d.donorPan;
      }
    });

    return Object.values(map)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);
  }, [donations]);

  const exportToCSV = () => {
    if (filteredDonations.length === 0) {
      alert('No donation records available to export.');
      return;
    }

    const headers = [
      'Receipt Number',
      'Donor Name',
      'Email',
      'Amount (INR)',
      'Transaction ID / UTR',
      'Payment Method',
      'Status',
      'Submission Date',
      '80G Reg Number',
      'PAN Number',
      'Remarks'
    ];

    const rows = filteredDonations.map(d => [
      `"${d.receiptNumber || ''}"`,
      `"${(d.donorName || '').replace(/"/g, '""')}"`,
      `"${(d.email || '').replace(/"/g, '""')}"`,
      d.amount || 0,
      `"${(d.transactionId || '').replace(/"/g, '""')}"`,
      `"${(d.paymentMethod || '').toUpperCase()}"`,
      `"${d.status || ''}"`,
      `"${d.date || ''}"`,
      `"${d.reg80gNumber || ''}"`,
      `"${d.donorPan || ''}"`,
      `"${(d.remarks || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `donations_database_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Donations database exported to CSV successfully!');
  };

  return (
    <div className="space-y-6">
      
      {/* Real-Time Toast Alert for New Donation Submissions */}
      {realtimeAlert && (
        <div className="fixed top-6 right-6 z-50 max-w-md w-full bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border-2 border-amber-400/80 animate-in slide-in-from-top-4 duration-300 space-y-3">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider">
                Real-Time New Submission
              </span>
            </div>
            <button
              onClick={() => setRealtimeAlert(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3 items-center">
            {realtimeAlert.screenshotUrl ? (
              <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 relative group">
                <img 
                  src={realtimeAlert.screenshotUrl} 
                  alt="Payment Screenshot" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] text-white font-bold">
                  <ImageIcon className="w-3.5 h-3.5" />
                </div>
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                <Bell className="w-6 h-6" />
              </div>
            )}

            <div className="space-y-0.5 text-xs">
              <p className="font-black text-white text-sm flex items-center gap-1.5">
                <span>{realtimeAlert.donorName}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  ₹{realtimeAlert.amount.toLocaleString('en-IN')}
                </span>
              </p>
              <p className="text-slate-400 font-mono text-[11px]">
                Txn: {realtimeAlert.transactionId}
              </p>
              {realtimeAlert.screenshotUrl ? (
                <p className="text-emerald-400 font-extrabold text-[10px] flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" /> Payment Screenshot Attached
                </p>
              ) : (
                <p className="text-slate-400 text-[10px]">Submitted for verification</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setSelectedSubmissionForReview(realtimeAlert);
                setRealtimeAlert(null);
              }}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Review Screenshot</span>
            </button>
            <button
              onClick={() => {
                handleApprove(realtimeAlert.id, realtimeAlert.donorName);
                setRealtimeAlert(null);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold py-2 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Toast Alert */}
      {actionToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Financial Audit Database
            </span>
            <span className="text-xs text-slate-400">Admin Control Panel</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <span>Donations & QR Payment Verification Database</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={simulateNewSubmission}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-3.5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
            title="Simulate a real-time incoming donation with payment screenshot"
          >
            <Bell className="w-4 h-4" />
            <span>Test Real-Time Alert</span>
          </button>
          <button
            onClick={exportToCSV}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export to CSV</span>
          </button>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Approved Funds</p>
            <p className="text-3xl font-black text-emerald-600 mt-1">₹{totalApprovedAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-xs flex items-center justify-between bg-gradient-to-r from-amber-50/50 to-white">
          <div>
            <p className="text-xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Approvals (24H)</span>
            </p>
            <p className="text-3xl font-black text-amber-700 mt-1">{pendingCount} Submissions</p>
          </div>
          <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total DB Submissions</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{donations.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Top Donors Leaderboard Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-600" />
                Top Donors
              </span>
              <span className="text-xs text-slate-400 font-semibold">Generosity Leaderboard</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Most Generous Contributors</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Highlighting philanthropic leaders supporting community welfare and emergency programs.
            </p>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Top 5 Total Contributed</span>
            <span className="text-lg font-black text-amber-600">
              ₹{topDonors.reduce((acc, curr) => acc + curr.totalAmount, 0).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Top Donors Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-3 sm:px-4">Rank</th>
                <th className="p-3 sm:px-4">Donor Name & Contact</th>
                <th className="p-3 sm:px-4">Contributions</th>
                <th className="p-3 sm:px-4">PAN Ref</th>
                <th className="p-3 sm:px-4">Last Active</th>
                <th className="p-3 sm:px-4 text-right">Total Donated</th>
                <th className="p-3 sm:px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {topDonors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400 font-bold">
                    No donor contributions logged yet.
                  </td>
                </tr>
              ) : (
                topDonors.map((donor, idx) => {
                  const rankBadges = [
                    'bg-amber-100 text-amber-900 border-amber-300 font-black',
                    'bg-slate-200 text-slate-800 border-slate-300 font-black',
                    'bg-orange-100 text-orange-900 border-orange-300 font-black',
                    'bg-slate-100 text-slate-700 border-slate-200 font-bold',
                    'bg-slate-100 text-slate-700 border-slate-200 font-bold',
                  ];
                  return (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="p-3 sm:px-4">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-xl border text-xs ${rankBadges[idx] || 'bg-slate-100'}`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="p-3 sm:px-4">
                        <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                          <span>{donor.donorName}</span>
                          {idx === 0 && <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">{donor.email}</p>
                      </td>
                      <td className="p-3 sm:px-4">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2.5 py-1 rounded-lg text-[11px] border border-slate-200">
                          {donor.count} {donor.count === 1 ? 'donation' : 'donations'}
                        </span>
                      </td>
                      <td className="p-3 sm:px-4 font-mono text-[11px] text-slate-600">
                        {donor.pan || 'N/A'}
                      </td>
                      <td className="p-3 sm:px-4 text-slate-500 text-[11px]">
                        {donor.lastDate}
                      </td>
                      <td className="p-3 sm:px-4 text-right">
                        <span className="font-black text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl">
                          ₹{donor.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="p-3 sm:px-4 text-right">
                        <button
                          onClick={() => setSearchTerm(donor.donorName)}
                          className="text-[11px] font-extrabold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer inline-flex items-center gap-1"
                        >
                          <Search className="w-3 h-3" />
                          <span>Filter DB</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Table & Search */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search donor, TXT ID, receipt #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedTab('All')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedTab === 'All' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({donations.length})
            </button>
            <button
              onClick={() => setSelectedTab('Pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                selectedTab === 'Pending' ? 'bg-amber-500 text-slate-950 font-black shadow-2xs' : 'text-slate-600 hover:text-amber-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending (24H)</span>
              {pendingCount > 0 && (
                <span className="bg-slate-950 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ml-1">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setSelectedTab('Approved')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedTab === 'Approved' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Approved ({donations.filter(d => d.status === 'Approved').length})
            </button>
            <button
              onClick={() => setSelectedTab('Rejected')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedTab === 'Rejected' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-rose-800'
              }`}
            >
              Rejected ({donations.filter(d => d.status === 'Rejected').length})
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 sm:px-6">Receipt / Ref #</th>
                <th className="p-4 sm:px-6">Donor Info</th>
                <th className="p-4 sm:px-6">Amount</th>
                <th className="p-4 sm:px-6">Transaction ID (TXT ID)</th>
                <th className="p-4 sm:px-6">Payment Proof</th>
                <th className="p-4 sm:px-6">Verification Status</th>
                <th className="p-4 sm:px-6 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDonations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                    No donation records found matching filter "{selectedTab}".
                  </td>
                </tr>
              ) : (
                filteredDonations.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 sm:px-6 font-bold text-blue-600 font-mono">{d.receiptNumber}</td>
                    <td className="p-4 sm:px-6">
                      <p className="font-extrabold text-slate-900">{d.donorName}</p>
                      <p className="text-[11px] text-slate-400">{d.email}</p>
                    </td>
                    <td className="p-4 sm:px-6 font-black text-slate-900">₹{d.amount.toLocaleString('en-IN')}</td>
                    <td className="p-4 sm:px-6">
                      <span className="font-mono bg-slate-100 text-slate-800 px-2 py-1 rounded border border-slate-200 font-bold text-[11px]">
                        {d.transactionId}
                      </span>
                    </td>
                    <td className="p-4 sm:px-6">
                      {d.screenshotUrl ? (
                        <button
                          onClick={() => setSelectedSubmissionForReview(d)}
                          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-bold text-[11px] cursor-pointer transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No File</span>
                      )}
                    </td>
                    <td className="p-4 sm:px-6">
                      {d.status === 'Approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle className="w-3 h-3 text-emerald-600" /> Approved
                        </span>
                      )}
                      {d.status === 'Pending (24 Hours)' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                          <Clock className="w-3 h-3 text-amber-700 animate-pulse" /> 24 Hours Pending
                        </span>
                      )}
                      {d.status === 'Rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                          <X className="w-3 h-3 text-rose-600" /> Rejected
                        </span>
                      )}
                    </td>
                    <td className="p-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {d.status === 'Pending (24 Hours)' && (
                          <>
                            <button
                              onClick={() => handleApprove(d.id, d.donorName)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg font-extrabold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Approve & Verify Payment"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => handleReject(d.id, d.donorName)}
                              className="bg-rose-100 hover:bg-rose-200 text-rose-800 px-2 py-1.5 rounded-lg font-extrabold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1"
                              title="Reject Submission"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                        {d.status === 'Approved' && (
                          <button
                            onClick={() => setSelectedReceipt(d)}
                            className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>80G Receipt</span>
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedSubmissionForReview(d)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-lg transition-colors cursor-pointer"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Payment Screenshot & Verification Audit Modal */}
      {selectedSubmissionForReview && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 relative">
            <button
              onClick={() => setSelectedSubmissionForReview(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 font-black text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">QR Payment Verification Audit</h3>
                <p className="text-xs text-slate-500">Review TXT ID & Payment Proof Screenshot</p>
              </div>
            </div>

            {/* Proof Screenshot Canvas */}
            <div className="bg-slate-900 rounded-2xl p-3 border border-slate-800 max-h-64 overflow-hidden flex items-center justify-center">
              {selectedSubmissionForReview.screenshotUrl ? (
                <img
                  src={selectedSubmissionForReview.screenshotUrl}
                  alt="Payment Proof"
                  className="max-h-56 w-auto object-contain rounded-xl shadow-lg"
                />
              ) : (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <ImageIcon className="w-12 h-12 mx-auto opacity-50" />
                  <p className="text-xs font-bold">No payment screenshot attached.</p>
                </div>
              )}
            </div>

            {/* Submission Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Donor Name</span>
                <p className="font-extrabold text-slate-900">{selectedSubmissionForReview.donorName}</p>
                <p className="text-[11px] text-slate-500">{selectedSubmissionForReview.email}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Donation Amount</span>
                <p className="font-black text-amber-700 text-sm">₹{selectedSubmissionForReview.amount.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Transaction ID / UTR</span>
                <p className="font-mono font-bold text-blue-900">{selectedSubmissionForReview.transactionId}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Current Status</span>
                <div className="mt-0.5">
                  <span className={`inline-block font-extrabold text-[10px] px-2 py-0.5 rounded-full ${
                    selectedSubmissionForReview.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                    selectedSubmissionForReview.status === 'Pending (24 Hours)' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {selectedSubmissionForReview.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Approval Controls */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDelete(selectedSubmissionForReview.id)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
              >
                Delete Record
              </button>

              <div className="flex items-center gap-2">
                {selectedSubmissionForReview.status === 'Pending (24 Hours)' && (
                  <>
                    <button
                      onClick={() => handleReject(selectedSubmissionForReview.id, selectedSubmissionForReview.donorName)}
                      className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-extrabold text-xs rounded-xl cursor-pointer transition-colors"
                    >
                      Reject Submission
                    </button>
                    <button
                      onClick={() => handleApprove(selectedSubmissionForReview.id, selectedSubmissionForReview.donorName)}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approve & Issue 80G</span>
                    </button>
                  </>
                )}
                {selectedSubmissionForReview.status === 'Approved' && (
                  <button
                    onClick={() => {
                      setSelectedReceipt(selectedSubmissionForReview);
                      setSelectedSubmissionForReview(null);
                    }}
                    className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>View 80G Receipt</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 80G Receipt Modal Preview */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 font-black text-lg cursor-pointer"
            >
              ✕
            </button>

            <div className="text-center border-b border-slate-100 pb-4">
              <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider">
                Official Tax Exemption Receipt (80G)
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-2">Astha Foundation</h2>
              <p className="text-xs text-slate-500">Registered Charitable Trust • 80G No: {selectedReceipt.reg80gNumber}</p>
            </div>

            <div className="space-y-3 bg-slate-50 p-6 rounded-2xl text-xs border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Receipt Number:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Date & Time:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Donor Name:</span>
                <span className="font-bold text-slate-900">{selectedReceipt.donorName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">{selectedReceipt.transactionId}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 text-sm">
                <span className="font-bold text-slate-700">Donation Amount:</span>
                <span className="font-black text-emerald-600">₹{selectedReceipt.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <QrCode className="w-8 h-8 text-slate-700" />
                <span>Verified 80G QR Code</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400">Authorized Signatory</p>
                <p className="font-bold text-xs text-slate-900 mt-1">Astha Foundation Trust</p>
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Downloading 80G Receipt PDF for ${selectedReceipt.receiptNumber}...`);
                setSelectedReceipt(null);
              }}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white font-black py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download Official PDF Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

