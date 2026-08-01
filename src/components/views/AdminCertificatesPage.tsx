import React, { useState, useEffect } from 'react';
import { ViewMode, UserRecord } from '../../types';
import * as api from '../../lib/api';
import { Award, Search, Download, Shield, Plus, CheckCircle, QrCode, FileText } from 'lucide-react';

interface AdminCertificatesPageProps {
  onNavigate: (view: ViewMode) => void;
  users: UserRecord[];
}

interface CertificateRecord {
  id: string;
  recipientName: string;
  type: 'Training Certificate' | 'Internship Certificate';
  certificateNumber: string;
  issueDate: string;
  qrCode: string;
}

export const AdminCertificatesPage: React.FC<AdminCertificatesPageProps> = ({ onNavigate, users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<CertificateRecord[]>([
    { id: 'CERT-501', recipientName: 'Anita Deshmukh', type: 'Training Certificate', certificateNumber: 'ASTHA/TRN/2026/401', issueDate: '2026-07-15', qrCode: 'VERIFIED-QR-401' },
    { id: 'CERT-502', recipientName: 'Pooja Verma', type: 'Internship Certificate', certificateNumber: 'ASTHA/INT/2026/402', issueDate: '2026-07-20', qrCode: 'VERIFIED-QR-402' },
  ]);

  // Live certificates from Supabase — fallback to demo list
  useEffect(() => {
    api.fetchCertificates().then((live) => {
      if (live && live.length > 0) setCertificates(live as CertificateRecord[]);
    });
  }, []);

  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(users[0]?.name || 'Rahul Kumar');
  const [certType, setCertType] = useState<'Training Certificate' | 'Internship Certificate'>('Training Certificate');
  const [activePreviewCert, setActivePreviewCert] = useState<CertificateRecord | null>(null);

  const handleGenerateCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCert: CertificateRecord = {
      id: `CERT-${Math.floor(100 + Math.random() * 900)}`,
      recipientName: selectedUser,
      type: certType,
      certificateNumber: `ASTHA/${certType === 'Training Certificate' ? 'TRN' : 'INT'}/2026/${Math.floor(500 + Math.random() * 500)}`,
      issueDate: new Date().toISOString().split('T')[0],
      qrCode: `VERIFIED-QR-${Math.floor(1000 + Math.random() * 9000)}`
    };

    // Live DB me certificate save (agar configured hai)
    api.addCertificate({
      recipientName: newCert.recipientName,
      type: newCert.type,
      certificateNumber: newCert.certificateNumber,
      issueDate: newCert.issueDate,
      qrCode: newCert.qrCode,
    });
    setCertificates([newCert, ...certificates]);
    setShowGenerateModal(false);
    setActivePreviewCert(newCert);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Admin Exclusive
            </span>
            <span className="text-xs text-slate-400">Certification Authority</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Certificate Management & Verification</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Generate Certificate</span>
          </button>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search recipient or certificate #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Issued: <span className="font-bold text-slate-900">{certificates.length}</span> certificates
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 sm:px-6">Certificate #</th>
                <th className="p-4 sm:px-6">Recipient Name</th>
                <th className="p-4 sm:px-6">Certificate Type</th>
                <th className="p-4 sm:px-6">Issue Date</th>
                <th className="p-4 sm:px-6">QR Code</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {certificates.filter(c => c.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) || c.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase())).map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:px-6 font-bold text-blue-600">{cert.certificateNumber}</td>
                  <td className="p-4 sm:px-6 font-bold text-slate-900">{cert.recipientName}</td>
                  <td className="p-4 sm:px-6">
                    <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-full text-[10px]">
                      {cert.type}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-slate-500 font-medium">{cert.issueDate}</td>
                  <td className="p-4 sm:px-6 font-mono text-slate-400 text-[11px] flex items-center gap-1">
                    <QrCode className="w-4 h-4 text-slate-600" />
                    <span>{cert.qrCode}</span>
                  </td>
                  <td className="p-4 sm:px-6 text-right">
                    <button
                      onClick={() => setActivePreviewCert(cert)}
                      className="bg-blue-950 hover:bg-blue-900 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            <button
              onClick={() => setShowGenerateModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 font-black text-lg cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <span>Generate New Certificate</span>
            </h2>

            <form onSubmit={handleGenerateCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select User / Recipient</label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.name}>{u.name} ({u.role})</option>
                  ))}
                  <option value="Aarav Sharma">Aarav Sharma (Student)</option>
                  <option value="Neha Gupta">Neha Gupta (Astha Didi)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Certificate Type</label>
                <select
                  value={certType}
                  onChange={(e) => setCertType(e.target.value as any)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Training Certificate">Training Certificate</option>
                  <option value="Internship Certificate">Internship Certificate</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Generate & Sign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate PDF Preview Modal */}
      {activePreviewCert && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-amber-50/90 border-8 border-amber-500 rounded-3xl max-w-3xl w-full p-10 shadow-2xl space-y-6 relative text-center">
            <button
              onClick={() => setActivePreviewCert(null)}
              className="absolute top-6 right-6 text-slate-600 hover:text-slate-900 font-black text-xl cursor-pointer bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-md"
            >
              ✕
            </button>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest font-black text-amber-800">Astha Foundation Trust</span>
              <h2 className="text-3xl font-black font-serif text-slate-900 tracking-wide">{activePreviewCert.type}</h2>
              <p className="text-xs text-slate-500">Certificate No: <span className="font-mono font-bold">{activePreviewCert.certificateNumber}</span></p>
            </div>

            <div className="py-6 space-y-4">
              <p className="text-xs text-slate-600 italic">This is proudly presented to</p>
              <h3 className="text-4xl font-black text-blue-950 font-serif underline decoration-amber-500 decoration-2 underline-offset-8">
                {activePreviewCert.recipientName}
              </h3>
              <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                For successfully completing the rigorous community leadership and women empowerment training program organized by Astha Foundation.
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-amber-300 text-xs text-left">
              <div>
                <p className="font-bold text-slate-800">Issue Date: {activePreviewCert.issueDate}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Verified via Astha Trust Blockchain / QR</p>
              </div>
              <div className="flex items-center gap-3">
                <QrCode className="w-12 h-12 text-slate-800" />
                <div className="text-right">
                  <p className="font-serif italic font-bold text-sm text-slate-900">Astha Director</p>
                  <p className="text-[10px] text-slate-500">Authorized Signature</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  alert(`Downloading ${activePreviewCert.certificateNumber}.pdf...`);
                  setActivePreviewCert(null);
                }}
                className="bg-blue-950 hover:bg-blue-900 text-white font-black px-8 py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-lg inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Download Printable PDF Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
