import React, { useState, useEffect } from 'react';
import { ViewMode } from '../../types';
import * as api from '../../lib/api';
import * as dl from '../../lib/download';
import { Heart, Search, Download, CheckCircle, Shield, Plus, DollarSign, FileText, QrCode } from 'lucide-react';

interface AdminDonationsPageProps {
  onNavigate: (view: ViewMode) => void;
}

interface DonationRecord {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  transactionId: string;
  status: 'Success' | 'Pending' | 'Refunded';
  date: string;
  reg80gNumber: string;
  receiptNumber: string;
}

export const AdminDonationsPage: React.FC<AdminDonationsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [donations, setDonations] = useState<DonationRecord[]>([
    { id: 'DON-1001', donorName: 'Rajesh Sharma', email: 'rajesh.sharma@example.com', amount: 5000, transactionId: 'TXN983427182', status: 'Success', date: '2026-07-28 14:20', reg80gNumber: 'AAATA1234F/80G/2025', receiptNumber: 'ASTHA/REC/2026/089' },
    { id: 'DON-1002', donorName: 'Priya Verma', email: 'priya.v@example.com', amount: 12000, transactionId: 'TXN983427183', status: 'Success', date: '2026-07-29 11:05', reg80gNumber: 'AAATA1234F/80G/2025', receiptNumber: 'ASTHA/REC/2026/090' },
    { id: 'DON-1003', donorName: 'Amit Patel', email: 'amit.patel@example.com', amount: 2500, transactionId: 'TXN983427184', status: 'Success', date: '2026-07-30 09:45', reg80gNumber: 'AAATA1234F/80G/2025', receiptNumber: 'ASTHA/REC/2026/091' },
    { id: 'DON-1004', donorName: 'Sunita Gupta', email: 'sunita.g@example.com', amount: 10000, transactionId: 'TXN983427185', status: 'Pending', date: '2026-07-31 08:30', reg80gNumber: 'AAATA1234F/80G/2025', receiptNumber: 'ASTHA/REC/2026/092' },
  ]);

  // Live donations from Supabase (admin-only read) — fallback to demo list
  useEffect(() => {
    api.fetchDonations().then((live) => {
      if (live && live.length > 0) setDonations(live as DonationRecord[]);
    });
  }, []);

  const [selectedReceipt, setSelectedReceipt] = useState<DonationRecord | null>(null);

  const filteredDonations = donations.filter(d => 
    d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = donations.filter(d => d.status === 'Success').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Financial Module
            </span>
            <span className="text-xs text-slate-400">Admin Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" />
            <span>Donations & 80G Receipts Management</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
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
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Donations Received</p>
            <p className="text-3xl font-black text-slate-900 mt-1">₹{totalAmount.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Successful Transactions</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{donations.filter(d => d.status === 'Success').length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">80G Tax Exempted</p>
            <p className="text-3xl font-black text-slate-900 mt-1">100% Eligible</p>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
            <Shield className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Table & Search */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search donor, receipt #, txn ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filteredDonations.length}</span> donation records
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 sm:px-6">Receipt #</th>
                <th className="p-4 sm:px-6">Donor Details</th>
                <th className="p-4 sm:px-6">Amount</th>
                <th className="p-4 sm:px-6">Transaction ID</th>
                <th className="p-4 sm:px-6">Status</th>
                <th className="p-4 sm:px-6">Date</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredDonations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:px-6 font-bold text-blue-600">{d.receiptNumber}</td>
                  <td className="p-4 sm:px-6">
                    <p className="font-bold text-slate-900">{d.donorName}</p>
                    <p className="text-[11px] text-slate-400">{d.email}</p>
                  </td>
                  <td className="p-4 sm:px-6 font-black text-slate-900">₹{d.amount.toLocaleString('en-IN')}</td>
                  <td className="p-4 sm:px-6 font-mono text-slate-600 text-[11px]">{d.transactionId}</td>
                  <td className="p-4 sm:px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      d.status === 'Success' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-slate-500 font-medium">{d.date}</td>
                  <td className="p-4 sm:px-6 text-right">
                    <button
                      onClick={() => setSelectedReceipt(d)}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>80G Receipt</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal Preview */}
      {selectedReceipt && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div id="printable-receipt" className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 space-y-6 relative">
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
              onClick={async () => {
                const el = document.getElementById('printable-receipt');
                if (el) {
                  await dl.captureElementAsPng(el, `${selectedReceipt.receiptNumber}-receipt`);
                } else {
                  dl.downloadSimplePdf(
                    '80G Tax Exemption Receipt',
                    [
                      { label: 'Receipt Number:', value: selectedReceipt.receiptNumber },
                      { label: 'Date:', value: selectedReceipt.date },
                      { label: 'Donor Name:', value: selectedReceipt.donorName },
                      { label: 'Transaction ID:', value: selectedReceipt.transactionId },
                      { label: 'Amount:', value: `Rs. ${selectedReceipt.amount.toLocaleString('en-IN')}` },
                      { label: '80G Number:', value: selectedReceipt.reg80gNumber },
                    ],
                    `${selectedReceipt.receiptNumber}-receipt`
                  );
                }
                setSelectedReceipt(null);
              }}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white font-black py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Download Official Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
