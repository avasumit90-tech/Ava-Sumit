import React, { useState, useEffect } from 'react';
import { 
  UserDocument, 
  getDocumentsForUser, 
  saveUserDocument, 
  deleteUserDocument, 
  updateDocumentStatus 
} from '../utils/documentStorage';
import { 
  FileText, Cloud, Upload, Download, Eye, Trash2, ShieldCheck, 
  Clock, CheckCircle2, AlertCircle, HardDrive, FilePlus, X, Filter, 
  Check, Lock, ExternalLink, Sparkles, Folder
} from 'lucide-react';

interface UserDocumentDriveProps {
  userId: string;
  userName: string;
  userEmail?: string;
  isAdminView?: boolean;
}

export const UserDocumentDrive: React.FC<UserDocumentDriveProps> = ({
  userId,
  userName,
  userEmail,
  isAdminView = false
}) => {
  const [documents, setDocuments] = useState<UserDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<UserDocument | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Upload Modal State
  const [newDocLabel, setNewDocLabel] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<UserDocument['category']>('Identity');
  const [newDocFile, setNewDocFile] = useState<File | null>(null);
  const [newDocPreviewUrl, setNewDocPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadDocs = () => {
    const docs = getDocumentsForUser(userId);
    setDocuments(docs);
  };

  useEffect(() => {
    loadDocs();

    const handleUpdate = () => {
      loadDocs();
    };

    window.addEventListener('ava_documents_updated', handleUpdate);
    return () => window.removeEventListener('ava_documents_updated', handleUpdate);
  }, [userId]);

  const filteredDocs = documents.filter(d => {
    if (selectedCategory === 'All') return true;
    return d.category === selectedCategory;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewDocFile(file);
      if (!newDocLabel) {
        setNewDocLabel(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewDocPreviewUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Strict validation: highlight missing required fields instead of silently proceeding.
    const box = document.getElementById('cloud-file-upload-box');
    if (box) {
      box.querySelectorAll('.inline-error').forEach((n) => n.remove());
      box.classList.remove('field-error');
    }
    if (!newDocFile && !newDocPreviewUrl) {
      if (box) {
        box.classList.add('field-error');
        const p = document.createElement('p');
        p.className = 'inline-error';
        p.textContent = 'Please select a file to upload';
        box.appendChild(p);
      }
      return;
    }

    setIsUploading(true);

    setTimeout(() => {
      const fileSizeMB = newDocFile ? (newDocFile.size / (1024 * 1024)).toFixed(1) + ' MB' : '1.8 MB';
      const fileType = newDocFile?.type || (newDocFile?.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

      saveUserDocument({
        userId,
        userName,
        userEmail: userEmail || `${userName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        documentType: 'other',
        documentTypeLabel: newDocLabel || 'Uploaded Document',
        fileName: newDocFile?.name || `${newDocLabel.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        fileSize: fileSizeMB,
        fileType,
        fileDataUrl: newDocPreviewUrl || 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&q=80&w=600',
        status: 'Under Review',
        category: newDocCategory
      });

      setIsUploading(false);
      setShowUploadModal(false);
      setNewDocFile(null);
      setNewDocLabel('');
      setNewDocPreviewUrl(null);
      showToast('Document uploaded successfully to Cloud Storage Vault!');
    }, 600);
  };

  const handleDelete = (docId: string, docName: string) => {
    if (confirm(`Are you sure you want to delete "${docName}" from Cloud Storage?`)) {
      deleteUserDocument(docId);
      showToast('Document removed from Cloud Vault.');
      if (selectedDocForPreview?.id === docId) {
        setSelectedDocForPreview(null);
      }
    }
  };

  const handleStatusChange = (docId: string, status: UserDocument['status']) => {
    updateDocumentStatus(docId, status);
    showToast(`Document status updated to ${status}`);
    if (selectedDocForPreview?.id === docId) {
      setSelectedDocForPreview(prev => prev ? { ...prev, status } : null);
    }
  };

  // Calculate total cloud space used
  const totalSpaceMB = documents.reduce((acc, d) => {
    const num = parseFloat(d.fileSize) || 1.5;
    return acc + num;
  }, 0).toFixed(1);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cloud Storage Storage Vault Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Cloud className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white tracking-tight">
                Mock Cloud Storage Vault
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" /> AES-256 Encrypted
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Bucket: <span className="font-mono text-amber-300 font-bold">gs://ava-foundation-vault/users/{userId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
          <div className="text-left md:text-right">
            <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Cloud Capacity</p>
            <p className="text-xs font-bold text-slate-200">
              <span className="text-amber-300 font-extrabold">{totalSpaceMB} MB</span> / 100 MB Used
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Category Tabs & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Folder className="w-5 h-5 text-blue-900" />
            <span>User Verification Documents ({documents.length})</span>
          </h4>
          <p className="text-xs text-slate-500">Official government proofs, educational certificates & identity credentials</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {['All', 'Identity', 'Education', 'Address', 'Tax/Financial'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      {filteredDocs.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-dashed border-slate-200 space-y-3">
          <div className="w-12 h-12 bg-slate-200/70 text-slate-400 rounded-full flex items-center justify-center mx-auto">
            <HardDrive className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-700">No documents found in category "{selectedCategory}"</p>
          <p className="text-[11px] text-slate-500">Upload identity or education documents to populate this cloud vault.</p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 cursor-pointer"
          >
            Upload Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-50/70 hover:bg-white border border-slate-200 rounded-2xl p-4.5 flex flex-col justify-between hover:border-blue-900/40 hover:shadow-md transition-all group space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-950/10 text-blue-950 flex items-center justify-center shrink-0 font-bold">
                    <FileText className="w-5 h-5 text-blue-900" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {doc.status === 'Verified' && (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                      </span>
                    )}
                    {doc.status === 'Under Review' && (
                      <span className="bg-amber-100 text-amber-800 border border-amber-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> Under Review
                      </span>
                    )}
                    {doc.status === 'Rejected' && (
                      <span className="bg-rose-100 text-rose-800 border border-rose-200 font-extrabold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600" /> Action Req.
                      </span>
                    )}
                  </div>
                </div>

                <h5 className="font-extrabold text-xs text-slate-900 line-clamp-1 group-hover:text-blue-950 transition-colors">
                  {doc.documentTypeLabel}
                </h5>
                <p className="text-[11px] font-mono text-slate-500 truncate mt-0.5">
                  {doc.fileName}
                </p>

                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span>Size: {doc.fileSize}</span>
                  <span>Uploaded: {doc.uploadDate}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedDocForPreview(doc)}
                  className="px-3 py-1.5 bg-blue-950/10 hover:bg-blue-950 hover:text-white text-blue-950 font-extrabold text-[11px] rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>

                <div className="flex items-center gap-1">
                  <a
                    href={doc.fileDataUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={doc.fileName}
                    className="p-1.5 text-slate-600 hover:text-blue-950 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id, doc.documentTypeLabel)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                  <Upload className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-slate-900">Upload to Mock Cloud Drive</h3>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-950"
                >
                  <option value="Identity">Identity Proof (Aadhaar / Passport / Voter ID)</option>
                  <option value="Education">Education Proof (Degree / Marks Sheet)</option>
                  <option value="Address">Address Proof (Utility Bill / Rent Agreement)</option>
                  <option value="Tax/Financial">Tax / Financial Proof (PAN Card / Passbook)</option>
                  <option value="Other">Other Certificate / Volunteer Log</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Name / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aadhaar Card Front Side"
                  value={newDocLabel}
                  onChange={(e) => setNewDocLabel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-none focus:ring-2 focus:ring-blue-950"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select File (PDF, JPG, PNG)</label>
                <div id="cloud-file-upload-box" className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                    id="cloud-file-upload"
                  />
                  <label htmlFor="cloud-file-upload" className="cursor-pointer space-y-2 block">
                    <Cloud className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="font-extrabold text-slate-800">
                      {newDocFile ? newDocFile.name : 'Click to select file from device'}
                    </p>
                    <p className="text-[11px] text-slate-400">Max size: 10MB • AES-256 Encrypted on upload</p>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2.5 border border-slate-300 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  {isUploading ? 'Uploading to Vault...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Full Document Preview & Verification Details */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 my-8">
            <div className="bg-slate-900 text-white p-5 px-6 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-black text-white">{selectedDocForPreview.documentTypeLabel}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Bucket: {selectedDocForPreview.storageBucketUrl}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 bg-slate-50">
              {/* Image / Document Canvas */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 max-h-[360px] flex items-center justify-center overflow-hidden shadow-inner">
                {selectedDocForPreview.fileType.includes('image') || selectedDocForPreview.fileDataUrl.startsWith('data:image') || selectedDocForPreview.fileDataUrl.includes('unsplash') ? (
                  <img
                    src={selectedDocForPreview.fileDataUrl}
                    alt={selectedDocForPreview.documentTypeLabel}
                    className="max-h-[320px] w-auto object-contain rounded-lg shadow-sm"
                  />
                ) : (
                  <div className="text-center space-y-3 py-8">
                    <FileText className="w-16 h-16 text-blue-900 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">{selectedDocForPreview.fileName}</p>
                    <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-mono px-3 py-1 rounded-full border border-slate-200">
                      PDF Document • {selectedDocForPreview.fileSize}
                    </span>
                  </div>
                )}
              </div>

              {/* File Info Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">User Name</span>
                  <p className="font-extrabold text-slate-900">{selectedDocForPreview.userName}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Category</span>
                  <p className="font-extrabold text-slate-900">{selectedDocForPreview.category}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Upload Date</span>
                  <p className="font-bold text-slate-800">{selectedDocForPreview.uploadDate}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Verification Status</span>
                  <div className="mt-0.5">
                    {selectedDocForPreview.status === 'Verified' && (
                      <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                    {selectedDocForPreview.status === 'Under Review' && (
                      <span className="text-amber-700 font-extrabold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Under Review
                      </span>
                    )}
                    {selectedDocForPreview.status === 'Rejected' && (
                      <span className="text-rose-700 font-extrabold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Admin Quick Audit Controls */}
              {isAdminView && (
                <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-2">
                  <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">Admin Verification Controls</h5>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleStatusChange(selectedDocForPreview.id, 'Verified')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex justify-center items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve & Verify
                    </button>
                    <button
                      onClick={() => handleStatusChange(selectedDocForPreview.id, 'Rejected')}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex justify-center items-center gap-1 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject Document
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white p-4 px-6 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => handleDelete(selectedDocForPreview.id, selectedDocForPreview.documentTypeLabel)}
                className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete File</span>
              </button>

              <a
                href={selectedDocForPreview.fileDataUrl}
                target="_blank"
                rel="noreferrer"
                download={selectedDocForPreview.fileName}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
