import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, Eye, FileText, Download, ShieldCheck, Mail, Phone, MapPin, User, GraduationCap, Briefcase, FileCheck, Check, MoreVertical, ZoomIn } from 'lucide-react';
import { UserRecord, ViewMode } from '../../types';

interface AdminApplicationReviewPageProps {
  applicant?: {
    id: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    location: string;
    dob: string;
    gender: string;
    languages: string[];
    address: string;
    education: Array<{
      degree: string;
      institution: string;
      period: string;
      honours?: string;
    }>;
    experience: Array<{
      role: string;
      organization: string;
      period: string;
      description: string;
    }>;
    motivation: string;
    avatar: string;
    documents: Array<{
      id: string;
      title: string;
      type: string;
      size: string;
      verified: boolean;
      previewUrl?: string;
    }>;
    declarationSignedDate: string;
  };
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason: string) => void;
  onNavigate?: (view: ViewMode) => void;
}

export const AdminApplicationReviewPage: React.FC<AdminApplicationReviewPageProps> = ({
  applicant: initialApplicant,
  onApprove,
  onReject,
  onNavigate,
}) => {
  // Default sample applicant if none supplied
  const defaultApplicant = {
    id: 'AST-2023-8942',
    name: 'Priya Sharma',
    role: 'Astha Didi (Community Leader)',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Jaipur, Rajasthan',
    dob: '15 Aug 1998 (25 yrs)',
    gender: 'Female',
    languages: ['Hindi', 'English', 'Marwari'],
    address: '42, Shyam Nagar, Jaipur, Rajasthan 302019',
    education: [
      {
        degree: 'Master of Social Work (MSW)',
        institution: 'University of Rajasthan',
        period: '2020 - 2022',
        honours: 'First Class Honours',
      },
      {
        degree: 'B.A. Sociology',
        institution: 'Maharani College',
        period: '2017 - 2020',
      },
    ],
    experience: [
      {
        role: 'Community Outreach Coordinator',
        organization: 'Pratham NGO',
        period: 'Jan 2023 - Present',
        description: 'Led rural education initiatives impacting 500+ children.',
      },
      {
        role: 'Volunteer Teacher',
        organization: 'Teach for India',
        period: '2021 - 2022',
        description: 'Guided primary students in foundational literacy and arithmetic.',
      },
    ],
    motivation:
      'Having grown up in a semi-urban environment, I have witnessed firsthand the challenges faced by young girls in accessing quality education and mentorship. I am applying for the Astha Didi program because I strongly believe in Astha Foundation\'s community-led approach. I want to leverage my academic background in social work and my experience in community outreach to empower the next generation of girls in my local community, helping them navigate their educational and personal journeys with confidence.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300',
    documents: [
      {
        id: 'doc-1',
        title: 'National ID (Aadhaar)',
        type: 'PDF',
        size: '1.2 MB',
        verified: true,
        previewUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'doc-2',
        title: 'MSW Degree Certificate',
        type: 'PDF',
        size: '2.4 MB',
        verified: false,
        previewUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400',
      },
      {
        id: 'doc-3',
        title: 'Reference Letter',
        type: 'PDF',
        size: '0.8 MB',
        verified: false,
        previewUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=400',
      },
    ],
    declarationSignedDate: '24 Oct 2023, 14:30 IST',
  };

  const applicant = initialApplicant || defaultApplicant;

  const [documents, setDocuments] = useState(applicant.documents);
  const [status, setStatus] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [previewDoc, setPreviewDoc] = useState<typeof documents[0] | null>(null);

  const verifiedCount = documents.filter((d) => d.verified).length;
  const verifiedPercentage = Math.round((verifiedCount / documents.length) * 100);

  const toggleVerifyDoc = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, verified: !d.verified } : d))
    );
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleApprove = () => {
    setStatus('Approved');
    triggerToast(`🎉 Success! ${applicant.name} has been successfully onboarded as ${applicant.role}!`);
    if (onApprove) onApprove(applicant.id);
  };

  const handleConfirmReject = () => {
    setStatus('Rejected');
    setRejectModalOpen(false);
    if (onReject) onReject(applicant.id, rejectReason);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col relative pb-28">
      {/* Top Bar Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate && onNavigate('admin-users')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-950 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Applications</span>
          </button>
          <div className="h-5 w-px bg-slate-200 hidden sm:block"></div>
          <h2 className="text-base sm:text-lg font-bold text-blue-950 tracking-tight truncate max-w-xs sm:max-w-md">
            Application Review - {applicant.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${
              status === 'Approved'
                ? 'bg-emerald-100 text-emerald-800'
                : status === 'Rejected'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'Approved'
                  ? 'bg-emerald-600'
                  : status === 'Rejected'
                  ? 'bg-rose-600'
                  : 'bg-amber-500'
              }`}
            ></span>
            {status === 'Pending' ? 'Pending Review' : status}
          </span>
          <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100 cursor-pointer">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (2 cols): Profile & Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Applicant Header Card */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-full -z-10 pointer-events-none" />
              
              <img
                src={applicant.avatar}
                alt={applicant.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              />

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-blue-950 mb-1">{applicant.name}</h3>
                <p className="text-xs text-slate-500 mb-4 font-medium">
                  Applying for: <span className="font-bold text-slate-800">{applicant.role}</span>
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg">
                    <Mail className="w-3.5 h-3.5 text-blue-950" />
                    <span>{applicant.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg">
                    <Phone className="w-3.5 h-3.5 text-blue-950" />
                    <span>{applicant.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-lg">
                    <MapPin className="w-3.5 h-3.5 text-blue-950" />
                    <span>{applicant.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-950" />
                <h4 className="text-xs font-bold text-blue-950 tracking-wide uppercase">Personal Information</h4>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-xs">
                <div>
                  <span className="block text-slate-400 font-medium mb-0.5">Date of Birth</span>
                  <span className="block font-bold text-slate-800">{applicant.dob}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium mb-0.5">Gender</span>
                  <span className="block font-bold text-slate-800">{applicant.gender}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium mb-0.5">Languages Spoken</span>
                  <span className="block font-bold text-slate-800">{applicant.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-medium mb-0.5">Current Address</span>
                  <span className="block font-bold text-slate-800">{applicant.address}</span>
                </div>
              </div>
            </div>

            {/* Education & Experience Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Education */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-950" />
                  <h4 className="text-xs font-bold text-blue-950 tracking-wide uppercase">Education</h4>
                </div>
                <div className="p-6 space-y-5">
                  {applicant.education.map((edu, idx) => (
                    <div key={idx} className="relative pl-5 border-l-2 border-amber-400">
                      <div className="absolute w-2.5 h-2.5 bg-amber-500 rounded-full -left-[6px] top-1" />
                      <h5 className="text-xs font-bold text-slate-900">{edu.degree}</h5>
                      <p className="text-[11px] text-slate-500">{edu.institution} • {edu.period}</p>
                      {edu.honours && (
                        <p className="text-[11px] font-bold text-emerald-600 mt-0.5">{edu.honours}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-950" />
                  <h4 className="text-xs font-bold text-blue-950 tracking-wide uppercase">Experience</h4>
                </div>
                <div className="p-6 space-y-5">
                  {applicant.experience.map((exp, idx) => (
                    <div key={idx} className="relative pl-5 border-l-2 border-blue-900">
                      <div className="absolute w-2.5 h-2.5 bg-blue-950 rounded-full -left-[6px] top-1" />
                      <h5 className="text-xs font-bold text-slate-900">{exp.role}</h5>
                      <p className="text-[11px] text-slate-500">{exp.organization} • {exp.period}</p>
                      <p className="text-[11px] text-slate-700 mt-1 leading-relaxed">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Motivation Statement */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-950" />
                <h4 className="text-xs font-bold text-blue-950 tracking-wide uppercase">Motivation Statement</h4>
              </div>
              <div className="p-6">
                <p className="text-xs text-slate-700 italic border-l-4 border-amber-500/50 pl-4 py-1 leading-relaxed bg-slate-50/50 rounded-r-lg">
                  "{applicant.motivation}"
                </p>
              </div>
            </div>

          </div>

          {/* Right Column (1 col): Verification & Documents */}
          <div className="space-y-6">
            
            {/* Verification Status Card */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto text-amber-600">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-base font-bold text-blue-950">
                  {verifiedCount === documents.length ? 'All Documents Verified' : 'Verification Pending'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Please review all submitted documents before approving this application.
                </p>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-3">
                <div
                  className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${verifiedPercentage}%` }}
                />
              </div>
              <p className="text-[11px] font-bold text-slate-500 text-right">
                {verifiedCount}/{documents.length} Documents Verified
              </p>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-950" />
                  <h4 className="text-xs font-bold text-blue-950 tracking-wide uppercase">Submitted Documents</h4>
                </div>
                <span className="text-[11px] font-bold text-slate-400">{documents.length} Files</span>
              </div>

              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 hover:bg-slate-50/80 transition-colors flex items-start gap-3">
                    {/* Document Thumbnail / Icon */}
                    <div
                      onClick={() => setPreviewDoc(doc)}
                      className="w-12 h-16 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center shrink-0 relative overflow-hidden group cursor-pointer"
                    >
                      {doc.previewUrl ? (
                        <img src={doc.previewUrl} alt={doc.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-6 h-6 text-blue-950" />
                      )}
                      <div className="absolute inset-0 bg-blue-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <h5 className="text-xs font-bold text-slate-900">{doc.title}</h5>
                      <p className="text-[10px] text-slate-400 font-medium">{doc.type} • {doc.size}</p>
                      
                      <button
                        type="button"
                        onClick={() => toggleVerifyDoc(doc.id)}
                        className={`text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                          doc.verified
                            ? 'text-emerald-600 hover:text-emerald-700'
                            : 'text-slate-400 hover:text-blue-950'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{doc.verified ? 'Marked Verified' : 'Mark Verified'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Declaration Status */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-5 space-y-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Declaration Accepted</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    The applicant has digitally signed and accepted the Astha Foundation code of conduct and background check consent.
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-2">
                    Signed on: {applicant.declarationSignedDate}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-4 z-40 shadow-lg">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500 font-medium">
            Application ID: <span className="font-mono font-bold text-slate-900">{applicant.id}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setRejectModalOpen(true)}
              disabled={status === 'Rejected'}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg border border-rose-500 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <XCircle className="w-4 h-4" />
              <span>{status === 'Rejected' ? 'Application Rejected' : 'Reject with Feedback'}</span>
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={status === 'Approved'}
              className="flex-1 sm:flex-initial px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{status === 'Approved' ? 'Application Approved' : 'Approve Application'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Document Zoom Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">{previewDoc.title}</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="w-full h-80 rounded-xl overflow-hidden bg-slate-100 flex items-center justify-center">
              {previewDoc.previewUrl ? (
                <img src={previewDoc.previewUrl} alt={previewDoc.title} className="w-full h-full object-contain" />
              ) : (
                <FileText className="w-16 h-16 text-slate-300" />
              )}
            </div>
            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => toggleVerifyDoc(previewDoc.id)}
                className="px-4 py-2 bg-blue-950 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                {previewDoc.verified ? 'Mark Unverified' : 'Mark Verified'}
              </button>
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Reject Application</h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Provide feedback or missing requirement notes for {applicant.name}.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Please re-upload a clearer copy of your National ID..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs outline-none focus:ring-2 focus:ring-rose-500"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

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
