import React, { useState, useEffect } from 'react';
import { ViewMode } from '../../types';
import { ASSETS } from '../../data';
import { 
  Award, 
  Download, 
  Share2, 
  Search, 
  Filter, 
  CheckCircle2, 
  Loader2,
  Sparkles, 
  Star, 
  FolderCheck, 
  Eye, 
  ArrowLeft, 
  Printer, 
  ShieldCheck, 
  X, 
  Copy, 
  Check, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface UserCertificatesPageProps {
  onNavigate: (view: ViewMode) => void;
  /** Certificate ID passed in from a direct share link (/verify/<ID>). */
  initialVerifyCertId?: string | null;
}

interface CertificateData {
  id: string;
  title: string;
  category: 'Community' | 'Skills' | 'Mentorship' | 'Health' | 'Leadership';
  date: string;
  year: string;
  certId: string;
  description: string;
  projectName: string;
  badgeType: 'verified' | 'school' | 'diversity' | 'health' | 'award';
  featured?: boolean;
}

const INITIAL_CERTIFICATES: CertificateData[] = [
  {
    id: 'cert-1',
    title: 'Community Service Excellence',
    category: 'Community',
    date: 'Oct 2024',
    year: '2024',
    certId: 'AST-24-091',
    description: "Awarded for completing over 100 hours of dedicated community outreach and support during the 'Winter Warmth' initiative in New Delhi.",
    projectName: 'Winter Warmth Drive',
    badgeType: 'verified',
    featured: true
  },
  {
    id: 'cert-2',
    title: 'Digital Literacy Lead',
    category: 'Skills',
    date: 'Aug 2024',
    year: '2024',
    certId: 'AST-24-082',
    description: 'Successfully trained 50+ seniors and young adults in basic smartphone usage, online banking, and cyber safety.',
    projectName: 'Digital Empowerment Initiative',
    badgeType: 'school'
  },
  {
    id: 'cert-3',
    title: 'Youth Mentor Badge',
    category: 'Mentorship',
    date: 'Mar 2024',
    year: '2024',
    certId: 'AST-24-045',
    description: 'Guided a cohort of 10 rural students through the six-month career readiness and higher education program.',
    projectName: 'Shiksha Mentorship Program',
    badgeType: 'diversity'
  },
  {
    id: 'cert-4',
    title: 'Basic First Aid & Maternal Support',
    category: 'Health',
    date: 'Sep 2024',
    year: '2024',
    certId: 'AST-24-077',
    description: 'Certified in primary health support, emergency first aid, and nutrition oversight for rural mothers and infants.',
    projectName: 'Arogya Swasthya Drive',
    badgeType: 'health'
  },
  {
    id: 'cert-5',
    title: 'Community Leadership & Management',
    category: 'Leadership',
    date: 'Jun 2023',
    year: '2023',
    certId: 'AST-23-061',
    description: 'Recognized for outstanding leadership in coordinating grassroots volunteer teams across 5 districts.',
    projectName: 'Grassroots Leadership Program',
    badgeType: 'award'
  }
];

export const UserCertificatesPage: React.FC<UserCertificatesPageProps> = ({ onNavigate, initialVerifyCertId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Modal states
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<CertificateData | null>(null);
  const [shareCert, setShareCert] = useState<CertificateData | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // If we were opened from a direct /verify/<ID> link, auto-open the matching
  // certificate in the preview/verification modal once the component mounts.
  useEffect(() => {
    if (!initialVerifyCertId) return;
    const matched = INITIAL_CERTIFICATES.find(
      (c) => c.certId.toLowerCase() === initialVerifyCertId.toLowerCase()
    );
    if (matched) {
      setSelectedCertForPreview(matched);
    } else {
      showToast(`Certificate ${initialVerifyCertId} not found.`);
    }
  }, [initialVerifyCertId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredCertificates = INITIAL_CERTIFICATES.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.certId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          cert.projectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesYear = selectedYear === 'all' || cert.year === selectedYear;
    const matchesCategory = selectedCategory === 'all' || cert.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesYear && matchesCategory;
  });

  const handleDownload = (cert: CertificateData) => {
    // Guard against double-clicks while a download is already in progress.
    if (isDownloading) return;
    setIsDownloading(true);
    showToast(`Preparing certificate ${cert.certId} for download...`);

    // Render the certificate to an offscreen canvas and download it as an image.
    // try/catch/finally guarantees isDownloading is always reset so the button
    // never gets stuck on the "Downloading..." state, even if an error occurs.
    try {
      const W = 1600;
      const H = 1130;
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        showToast('Sorry, your browser does not support certificate download.');
        return;
      }

      const navy = '#172554';
      const amber = '#f59e0b';
      const ink = '#0f172a';
      const muted = '#64748b';

      // Background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#fef3c7');
      bg.addColorStop(1, '#fffbeb');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Outer border
      ctx.strokeStyle = navy;
      ctx.lineWidth = 18;
      ctx.strokeRect(50, 50, W - 100, H - 100);
      ctx.lineWidth = 4;
      ctx.strokeRect(84, 84, W - 168, H - 168);

      // Header: logo circle + foundation name
      ctx.fillStyle = navy;
      ctx.beginPath();
      ctx.arc(W / 2 - 430, 210, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = amber;
      ctx.font = 'bold 44px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('AVA', W / 2 - 430, 222);

      ctx.fillStyle = navy;
      ctx.font = 'bold 60px Georgia, serif';
      ctx.fillText('AVA FOUNDATION', W / 2 + 40, 195);
      ctx.fillStyle = muted;
      ctx.font = '22px Georgia, serif';
      ctx.fillText('Youth Empowerment & Community Trust', W / 2 + 40, 235);

      // Credential ID
      ctx.textAlign = 'right';
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = amber;
      ctx.fillText(cert.certId, W - 150, 235);
      ctx.fillStyle = muted;
      ctx.font = '16px Georgia, serif';
      ctx.fillText('Credential ID', W - 150, 258);

      // Body
      ctx.textAlign = 'center';
      ctx.fillStyle = muted;
      ctx.font = '28px Georgia, serif';
      ctx.fillText('CERTIFICATE OF APPRECIATION & RECOGNITION', W / 2, 420);

      ctx.fillStyle = ink;
      ctx.font = 'italic 30px Georgia, serif';
      ctx.fillText('This certificate is proudly presented to', W / 2, 500);

      ctx.fillStyle = navy;
      ctx.font = 'bold 64px Georgia, serif';
      ctx.fillText('Anjali Sharma', W / 2, 590);
      ctx.strokeStyle = amber;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 260, 615);
      ctx.lineTo(W / 2 + 260, 615);
      ctx.stroke();

      ctx.fillStyle = ink;
      ctx.font = '28px Georgia, serif';
      ctx.fillText(`Volunteer Lead  |  ${cert.title}`, W / 2, 670);

      // Description wrapped
      ctx.font = '25px Georgia, serif';
      ctx.fillStyle = '#334155';
      const words = cert.description.split(' ');
      const maxWidth = 1180;
      const lines: string[] = [];
      let line = '';
      for (const w of words) {
        const test = line ? line + ' ' + w : w;
        if (ctx.measureText(test).width > maxWidth) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      const shown = lines.slice(0, 3).join(' ');
      ctx.fillText(shown, W / 2, 730);
      if (lines.length > 3) ctx.fillText('...', W / 2, 765);

      // Bottom: signatures + seal + date
      ctx.textAlign = 'left';
      ctx.fillStyle = ink;
      ctx.font = 'bold 26px Georgia, serif';
      ctx.fillText(cert.date, 180, 940);
      ctx.fillStyle = muted;
      ctx.font = '18px Georgia, serif';
      ctx.fillText('Date of Issuance', 180, 970);

      ctx.textAlign = 'right';
      ctx.fillStyle = ink;
      ctx.font = 'italic bold 30px Georgia, serif';
      ctx.fillText('Dr. R. K. Sharma', W - 180, 940);
      ctx.fillStyle = muted;
      ctx.font = '18px Georgia, serif';
      ctx.fillText('Trustee, AVA Foundation', W - 180, 970);

      // Seal
      ctx.textAlign = 'center';
      ctx.strokeStyle = navy;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(W / 2, 940, 62, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = navy;
      ctx.beginPath();
      ctx.arc(W / 2, 940, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = amber;
      ctx.font = 'bold 20px Georgia, serif';
      ctx.fillText('SEAL', W / 2, 945);

      // Trigger download
      const link = document.createElement('a');
      link.download = `${cert.certId}-certificate.png`;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Certificate downloaded!');
    } catch (err) {
      console.error('Download failed', err);
      showToast('Download failed. Please try again.');
    } finally {
      // Always reset the loading state so the UI never stays stuck.
      setIsDownloading(false);
    }
  };

  const handleCopyShareLink = (cert: CertificateData) => {
    const shareUrl = `https://astha.foundation/verify/${cert.certId}`;
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    showToast('Verification link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation & Top Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('user-dashboard')}
            className="p-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <span className="text-slate-400">/</span>
          <span className="text-xs font-extrabold text-slate-900">Certificates & Recognition</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Volunteer Credentials
          </span>
        </div>
      </div>

      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              Official Records
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              My Certificates
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              View, download, and share official recognition earned through your active participation, training, and community impact with Astha Foundation.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-black text-white">{INITIAL_CERTIFICATES.length} Certificates</p>
              <p className="text-[11px] text-amber-300 font-medium">100% Verified Credentials</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search certificate title, project or ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-40">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold py-2.5 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
            >
              <option value="all">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>

          <div className="relative flex-1 sm:w-48">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold py-2.5 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-900 cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="community">Community</option>
              <option value="mentorship">Mentorship</option>
              <option value="skills">Skills</option>
              <option value="health">Health</option>
              <option value="leadership">Leadership</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>

      </div>

      {/* Certificate Bento Grid */}
      {filteredCertificates.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No certificates match your filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or reset filters to view all your foundation credentials.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedYear('all');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {filteredCertificates.map((cert) => {
            if (cert.featured) {
              return (
                <div
                  key={cert.id}
                  className="col-span-1 md:col-span-2 lg:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-all group"
                >
                  <div className="w-full md:w-2/5 bg-gradient-to-br from-blue-950 to-indigo-900 p-8 text-white relative flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200/20 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 to-transparent opacity-60" />
                    
                    <div className="absolute top-4 left-4 bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-slate-950" /> Featured Recognition
                    </div>

                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-amber-400 border border-white/20 my-6 shadow-inner relative z-10">
                      <Award className="w-10 h-10" />
                    </div>

                    <p className="text-xs font-bold text-amber-300 relative z-10">{cert.certId}</p>
                    <p className="text-[11px] text-slate-300 relative z-10">Verified Digital Credential</p>
                  </div>

                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                          {cert.category} • {cert.date}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          ID: {cert.certId}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
                        {cert.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {cert.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <FolderCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Project: {cert.projectName}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                      <button
                        onClick={() => setSelectedCertForPreview(cert)}
                        className="bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View & Verify</span>
                      </button>

                      <button
                        onClick={() => handleDownload(cert)}
                        disabled={isDownloading}
                        className="bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
                      >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        <span>{isDownloading ? 'Downloading...' : 'Download Certificate'}</span>
                      </button>

                      <button
                        onClick={() => setShareCert(cert)}
                        className="border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={cert.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-blue-900/40 hover:shadow-md transition-all group"
              >
                <div className="h-32 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 relative flex items-center justify-center border-b border-slate-100">
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-amber-400 border border-white/20">
                    <Award className="w-7 h-7" />
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold text-amber-300 bg-white/10 px-2 py-0.5 rounded-full border border-white/15">
                    {cert.certId}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {cert.category} • {cert.date}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug mb-2">
                      {cert.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {cert.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setSelectedCertForPreview(cert)}
                      className="text-xs font-extrabold text-blue-900 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDownload(cert)}
                        disabled={isDownloading}
                        className="p-2 text-slate-700 hover:bg-amber-100 hover:text-amber-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isDownloading ? 'Downloading...' : 'Download Certificate'}
                      >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setShareCert(cert)}
                        className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl transition-colors cursor-pointer"
                        title="Share"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Earn More Teaser Card */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 rounded-3xl border-2 border-dashed border-amber-400/60 p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left justify-between">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <div className="w-16 h-16 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-md shrink-0">
                <Sparkles className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Want to earn more certificates?</h3>
                <p className="text-xs text-slate-600 max-w-xl">
                  Join upcoming volunteer projects, complete skill development training modules, or lead community drives to unlock new recognition badges and verified certificates.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('join-community')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold px-6 py-3 rounded-2xl transition-colors shrink-0 shadow-md cursor-pointer"
            >
              Explore Opportunities
            </button>
          </div>

        </div>
      )}

      {/* Certificate Preview / Verification Modal */}
      {selectedCertForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-extrabold">Official Certificate Preview</span>
              </div>
              <button
                onClick={() => setSelectedCertForPreview(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Display Paper Canvas */}
            <div className="p-8 sm:p-12 bg-amber-50/40 relative font-serif">
              <div className="border-8 border-double border-slate-900 p-8 sm:p-10 bg-white shadow-xl relative text-slate-900 space-y-6">
                
                {/* Certificate Decorative Seal */}
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={ASSETS.logoCircle}
                      alt="Astha Foundation Logo"
                      crossOrigin="anonymous"
                      className="w-14 h-14 rounded-full border border-slate-300"
                    />
                    <div>
                      <h2 className="text-xl font-bold font-sans tracking-tight text-blue-950">
                        ASTHA FOUNDATION
                      </h2>
                      <p className="text-[10px] font-sans text-slate-500 uppercase tracking-widest">
                        Youth Empowerment & Community Trust
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-sans">
                    <p className="text-xs font-bold text-slate-900">Credential ID</p>
                    <p className="text-xs font-mono font-bold text-amber-600">{selectedCertForPreview.certId}</p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="text-center space-y-4 py-4">
                  <p className="text-xs font-sans uppercase tracking-widest text-slate-500 font-semibold">
                    Certificate of Appreciation & Recognition
                  </p>
                  
                  <p className="text-sm italic text-slate-600">
                    This certificate is proudly presented to
                  </p>

                  <h3 className="text-2xl sm:text-3xl font-bold text-blue-950 underline decoration-amber-400 decoration-2 underline-offset-8">
                    Anjali Sharma / Volunteer Lead
                  </h3>

                  <p className="text-xs text-slate-700 max-w-lg mx-auto leading-relaxed pt-2 font-sans">
                    {selectedCertForPreview.description}
                  </p>
                </div>

                {/* Signatures & Issue Info */}
                <div className="flex justify-between items-end border-t border-slate-200 pt-6 font-sans text-xs">
                  <div>
                    <p className="font-bold text-slate-900">{selectedCertForPreview.date}</p>
                    <p className="text-[10px] text-slate-500">Date of Issuance</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-full flex items-center justify-center font-bold text-[10px] mx-auto mb-1 border-2 border-amber-400">
                      SEAL
                    </div>
                    <p className="text-[9px] font-extrabold text-slate-600 uppercase tracking-wider">Official Verification</p>
                  </div>

                  <div className="text-right">
                    <div className="h-8 font-serif italic text-sm text-slate-800 font-bold border-b border-slate-400">
                      Dr. R. K. Sharma
                    </div>
                    <p className="text-[10px] text-slate-500 pt-0.5">Trustee, Astha Foundation</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 p-4 px-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified in Foundation Registry</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="px-4 py-2 border border-slate-300 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print</span>
                </button>

                <button
                  onClick={() => handleDownload(selectedCertForPreview)}
                  disabled={isDownloading}
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 text-xs font-extrabold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloading ? 'Downloading...' : 'Download Certificate'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">Share Certificate</h3>
              </div>
              <button onClick={() => setShareCert(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-800">{shareCert.title}</p>
              <p className="text-[11px] text-slate-500">ID: {shareCert.certId}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-600">Verification Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`https://astha.foundation/verify/${shareCert.certId}`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-700"
                />
                <button
                  onClick={() => handleCopyShareLink(shareCert)}
                  className="bg-slate-900 hover:bg-slate-800 text-white p-2.5 rounded-xl transition-colors cursor-pointer"
                  title="Copy Link"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShareCert(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
