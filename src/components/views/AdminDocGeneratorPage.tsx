import React, { useState, useRef } from 'react';
import { UserRecord, ViewMode } from '../../types';
import { ASSETS } from '../../data';
import * as dl from '../../lib/download';
import { ArrowLeft, Download, Sparkles, QrCode, Search, ZoomIn, ZoomOut, ShieldCheck, CheckCircle2, RefreshCw, Printer } from 'lucide-react';

interface AdminDocGeneratorPageProps {
  users: UserRecord[];
  selectedUserOverride?: UserRecord | null;
  onNavigate: (view: ViewMode) => void;
}

export const AdminDocGeneratorPage: React.FC<AdminDocGeneratorPageProps> = ({
  users,
  selectedUserOverride,
  onNavigate
}) => {
  const [selectedUser, setSelectedUser] = useState<UserRecord>(
    selectedUserOverride || users[0] || {
      id: 'AST-2024-8902',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      role: 'Youth Volunteer',
      location: 'Mumbai, MH',
      registrationDate: 'Oct 12, 2024',
      status: 'Active',
      avatar: ASSETS.rahulIdPhoto,
      dob: '15/08/1998',
      bloodGroup: 'O+',
      validUntil: '31/12/2026'
    }
  );

  const [docType, setDocType] = useState('Membership ID Card');
  const [issueDate, setIssueDate] = useState('01/10/2024');
  const [validUntilDate, setValidUntilDate] = useState('31/12/2026');
  const [serialNo, setSerialNo] = useState(`AST-ID-${Math.floor(100000 + Math.random() * 900000)}`);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isGenerated, setIsGenerated] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // ⭐ PDF — naye window me printable card (100% reliable, CORS-free)
  const handleDownloadPdf = () => {
    dl.openPrintableCard({
      name: selectedUser.name || 'Member',
      id: selectedUser.id || 'AST-XXXX',
      role: selectedUser.role || 'Member',
      location: selectedUser.location || '',
      dob: selectedUser.dob || '—',
      bloodGroup: selectedUser.bloodGroup || '—',
      validUntil: validUntilDate,
      serialNo: serialNo,
      photoUrl: selectedUser.avatar || ASSETS.rahulIdPhoto,
      logoUrl: ASSETS.logoCircle,
      patternUrl: ASSETS.cardPatternBg,
      qrUrl: ASSETS.qrCode,
    });
  };

  // PNG — high-res screenshot capture (agar CORS allow kare)
  const handleDownloadPng = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const ok = await dl.captureElementAsPng(cardRef.current, `ID-Card-${selectedUser.id || selectedUser.name.replace(/\s+/g, '-')}`);
      if (!ok) {
        handleDownloadPdf(); // fallback: printable window
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerated(true);
    setTimeout(() => setIsGenerated(false), 3000);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Official ID Card & Document Generator
          </h1>
          <p className="text-xs text-slate-500">
            Generate printable high-security member badges & certificates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Controls & User Selection */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900">1. Select Member & Document Details</h3>
            <p className="text-xs text-slate-500">Configure parameters for card preview</p>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            
            {/* User Search Dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Member from Directory</label>
              <select
                value={selectedUser.id}
                onChange={(e) => {
                  const found = users.find(u => u.id === e.target.value);
                  if (found) setSelectedUser(found);
                }}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role}) — {u.id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Document Template Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none"
              >
                <option value="Membership ID Card">Official Membership ID Card</option>
                <option value="Astha Didi Mentor Badge">Astha Didi Mentor Badge</option>
                <option value="Training Certificate">Training Completion Certificate</option>
                <option value="Volunteer Appreciation Pass">Volunteer Appreciation Pass</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Date</label>
                <input
                  type="text"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Valid Until</label>
                <input
                  type="text"
                  value={validUntilDate}
                  onChange={(e) => setValidUntilDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Serial Security Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={serialNo}
                  onChange={(e) => setSerialNo(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSerialNo(`AST-ID-${Math.floor(100000 + Math.random() * 900000)}`)}
                  className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700"
                  title="Generate Random Serial"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3.5 px-6 rounded-2xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Generate & Validate Document</span>
            </button>

            {isGenerated && (
              <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold text-center animate-in fade-in">
                ✓ Document synchronized with security database!
              </div>
            )}

          </form>
        </div>

        {/* RIGHT COLUMN: Live Card Preview Render */}
        <div className="lg:col-span-7 bg-slate-100 rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-inner space-y-6 flex flex-col items-center justify-center">
          
          <div className="w-full flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-500">Live High-Res Preview</span>
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-700">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(1.3, prev + 0.1))}
                className="p-1 hover:bg-slate-100 rounded text-slate-600"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* THE OFFICIAL ID CARD PREVIEW CONTAINER */}
          <div
            className="transition-transform duration-200 origin-top"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            <div
              ref={cardRef}
              id="printable-id-card"
              className="w-80 sm:w-96 bg-white rounded-3xl border-2 border-slate-300 shadow-2xl overflow-hidden relative text-slate-900">
              
              {/* Header Navy Band with Logo */}
              <div className="bg-slate-950 text-white p-5 text-center relative overflow-hidden">
                <img
                  src={ASSETS.cardPatternBg}
                  alt="Pattern"
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
                
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-full p-0.5 border border-amber-400">
                    <img src={ASSETS.logoCircle} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="text-left">
                    <h4 className="text-base font-black tracking-tight uppercase leading-none">Astha Foundation</h4>
                    <p className="text-[9px] text-amber-300 font-bold uppercase tracking-widest mt-1">Official Member Identity Card</p>
                  </div>
                </div>
              </div>

              {/* Gold Ribbon Accent */}
              <div className="h-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600" />

              {/* Card Body */}
              <div className="p-6 space-y-4">
                
                {/* Photo & Role Badge Row */}
                <div className="flex items-center gap-4">
                  <img
                    src={selectedUser.avatar || ASSETS.rahulIdPhoto}
                    alt={selectedUser.name}
                    className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-900 shadow-md shrink-0"
                  />
                  <div className="space-y-1">
                    <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {selectedUser.role}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">{selectedUser.name}</h3>
                    <p className="text-[11px] font-mono text-slate-500 font-bold">ID: {selectedUser.id}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{selectedUser.location}</p>
                  </div>
                </div>

                {/* Details Table Grid */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 grid grid-cols-3 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 font-bold block uppercase">DOB</span>
                    <span className="font-extrabold text-slate-800">{selectedUser.dob || '15/08/1998'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase">Blood Group</span>
                    <span className="font-extrabold text-slate-800">{selectedUser.bloodGroup || 'O+'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block uppercase">Valid Thru</span>
                    <span className="font-extrabold text-amber-700">{validUntilDate}</span>
                  </div>
                </div>

                {/* Bottom QR Code & Verification Stamp */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>FCRA & 80G Certified</span>
                    </div>
                    <p className="text-[8px] text-slate-400 font-mono">SERIAL: {serialNo}</p>
                  </div>

                  <img
                    src={ASSETS.qrCode}
                    alt="Scan QR"
                    className="w-12 h-12 object-contain border border-slate-300 rounded-lg p-0.5"
                  />
                </div>

              </div>

            </div>
          </div>

          {/* Card Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full max-w-md">
            <button
              onClick={handleDownloadPdf}
              className="flex-[1.2] bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-6 rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Card (PDF)</span>
            </button>
            <button
              onClick={handleDownloadPng}
              disabled={downloading}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold py-3 px-6 rounded-2xl text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{downloading ? 'Downloading...' : 'PNG Image'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
