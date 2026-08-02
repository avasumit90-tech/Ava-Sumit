import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { FileText, Download, Plus, Shield, Trash2 } from 'lucide-react';

interface AdminLegalPageProps {
  onNavigate: (view: ViewMode) => void;
}

interface LegalDoc {
  id: string;
  title: string;
  category: string;
  fileSize: string;
  uploadDate: string;
  docNumber?: string;
  issuer?: string;
  details?: string;
}

export const AdminLegalPage: React.FC<AdminLegalPageProps> = ({ onNavigate }) => {
  const [docs, setDocs] = useState<LegalDoc[]>([
    { 
      id: 'LEG-PAN', 
      title: 'Permanent Account Number (PAN) Card', 
      category: 'Tax & Financial', 
      fileSize: '480 KB', 
      uploadDate: '2019-08-27',
      docNumber: 'AAHTA5416F',
      issuer: 'Income Tax Department, Govt. of India',
      details: 'Incorporation/Formation Date: 27/08/2019 | Name: AVA FOUNDATION'
    },
    { 
      id: 'LEG-MSME', 
      title: 'Udyog Aadhaar MSME Registration Certificate', 
      category: 'Govt Registration', 
      fileSize: '1.2 MB', 
      uploadDate: '2020-02-13',
      docNumber: 'AS03D0003712',
      issuer: 'Ministry of Micro, Small & Medium Enterprises (Govt. of India)',
      details: 'Enterprise: AVA FOUNDATION | Type: Micro Services (Social Work Activities) | Location: Guwahati, Kamrup Metro, Assam'
    },
    { 
      id: 'LEG-BANK', 
      title: 'ICICI Bank Current Account & Cancelled Cheque', 
      category: 'Banking & Audit', 
      fileSize: '850 KB', 
      uploadDate: '2020-07-31',
      docNumber: 'A/C: 413605000147',
      issuer: 'ICICI Bank Ltd, Hatigaon Branch Guwahati',
      details: 'IFSC: ICIC0004136 | Business Banking Current Account | A/C Name: AVA FOUNDATION'
    },
    { id: 'LEG-1', title: 'Trust Deed & Incorporation Charter', category: 'Registration', fileSize: '2.4 MB', uploadDate: '2019-08-27' },
    { id: 'LEG-2', title: '80G Tax Exemption Certificate', category: 'Tax Exemption', fileSize: '1.1 MB', uploadDate: '2020-04-15' },
    { id: 'LEG-3', title: '12A Income Tax Registration', category: 'Tax Exemption', fileSize: '980 KB', uploadDate: '2020-04-15' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Registration');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newDoc: LegalDoc = {
      id: `LEG-${Date.now()}`,
      title,
      category,
      fileSize: '1.5 MB',
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocs([...docs, newDoc]);
    setShowAddModal(false);
    setTitle('');
  };

  const handleDelete = (id: string) => {
    setDocs(docs.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Compliance & Legal
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-600" />
            <span>Legal Documents Repository</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Upload Legal Document</span>
          </button>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 sm:px-6">Document Title</th>
                <th className="p-4 sm:px-6">Category</th>
                <th className="p-4 sm:px-6">File Size</th>
                <th className="p-4 sm:px-6">Upload Date</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {docs.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:px-6">
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{doc.title}</span>
                          {doc.docNumber && (
                            <span className="font-mono bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded border border-amber-300">
                              {doc.docNumber}
                            </span>
                          )}
                        </div>
                        {doc.issuer && (
                          <p className="text-[11px] text-slate-500 mt-0.5">{doc.issuer}</p>
                        )}
                        {doc.details && (
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">{doc.details}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 sm:px-6">
                    <span className="bg-blue-50 text-blue-800 font-bold px-2.5 py-1 rounded-full text-[10px] whitespace-nowrap">
                      {doc.category}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 font-mono text-slate-500">{doc.fileSize}</td>
                  <td className="p-4 sm:px-6 text-slate-500">{doc.uploadDate}</td>
                  <td className="p-4 sm:px-6 text-right space-x-2">
                    <button
                      onClick={() => alert(`Downloading ${doc.title}...`)}
                      className="bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl border border-slate-100 space-y-6 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 font-black text-lg cursor-pointer"
            >
              ✕
            </button>
            <h2 className="text-xl font-black text-slate-900">Upload Legal Document</h2>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Annual Audit Report 2025-26"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="Registration">Registration</option>
                  <option value="Tax Exemption">Tax Exemption</option>
                  <option value="Tax & Financial">Tax & Financial</option>
                  <option value="Compliance">Compliance</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl shadow-md"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
