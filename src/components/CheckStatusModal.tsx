import React, { useState } from 'react';
import { ApplicationStatus } from '../types';
import { INITIAL_APPLICATIONS } from '../data';
import { Search, X, CheckCircle2, Clock, AlertCircle, FileText, UserCheck, Sparkles } from 'lucide-react';

interface CheckStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationsList?: ApplicationStatus[];
}

export const CheckStatusModal: React.FC<CheckStatusModalProps> = ({ isOpen, onClose, applicationsList = INITIAL_APPLICATIONS }) => {
  const [searchId, setSearchId] = useState('');
  const [searchedApp, setSearchedApp] = useState<ApplicationStatus | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Strict validation: do not proceed until an application ID is entered.
    const formEl = e.currentTarget as HTMLFormElement;
    const input = formEl.querySelector<HTMLInputElement>('#status-search-input');
    if (input && !input.value.trim()) {
      input.classList.add('field-error');
      const p = document.createElement('p');
      p.className = 'inline-error';
      p.textContent = 'This field is required';
      input.insertAdjacentElement('afterend', p);
      input.focus({ preventScroll: true });
      return;
    }
    if (input) input.classList.remove('field-error');
    if (!searchId.trim()) return;
    const found = applicationsList.find(app => app.id.toLowerCase().trim() === searchId.toLowerCase().trim());
    setSearchedApp(found || null);
    setHasSearched(true);
  };

  const fillSample = (id: string) => {
    setSearchId(id);
    const found = applicationsList.find(app => app.id === id);
    setSearchedApp(found || null);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden">
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Check Application Status</h3>
            <p className="text-xs text-slate-500">Track registration progress & verification stages</p>
          </div>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Enter Application ID / Reference No.
            </label>
            <div className="relative">
              <input
                id="status-search-input"
                type="text"
                required
                placeholder="e.g. AST-2024-8902 or AST-DID-9012"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-4 pr-24 py-3 bg-slate-50 border border-slate-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 rounded-2xl text-sm font-medium text-slate-900 outline-none transition-all"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>

          {/* Quick Demo ID Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-medium">Try ID:</span>
            {applicationsList.slice(0, 3).map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => fillSample(app.id)}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg font-mono text-[11px] transition-colors cursor-pointer"
              >
                {app.id}
              </button>
            ))}
          </div>
        </form>

        {/* Search Results Display */}
        {hasSearched && (
          <div className="mt-6 pt-6 border-t border-slate-100 animate-in slide-in-from-bottom-2 duration-200">
            {searchedApp ? (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applicant</span>
                    <h4 className="text-base font-extrabold text-slate-900">{searchedApp.applicantName}</h4>
                    <p className="text-xs text-amber-700 font-semibold">{searchedApp.role}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    searchedApp.status === 'Approved' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : searchedApp.status === 'Under Review'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-rose-100 text-rose-800 border border-rose-300'
                  }`}>
                    {searchedApp.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                    {searchedApp.status === 'Under Review' && <Clock className="w-3.5 h-3.5" />}
                    {searchedApp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/80">
                  <div>
                    <span className="text-slate-400">Application Ref:</span>
                    <p className="font-mono font-bold text-slate-800">{searchedApp.id}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Submitted Date:</span>
                    <p className="font-bold text-slate-800">{searchedApp.submittedDate}</p>
                  </div>
                </div>

                {/* Step Progress Visual */}
                <div className="pt-2">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                    <span>Verification Steps</span>
                    <span>{searchedApp.stepCompleted} of {searchedApp.totalSteps} Completed</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${(searchedApp.stepCompleted / searchedApp.totalSteps) * 100}%` }}
                    />
                  </div>
                </div>

                {searchedApp.remarks && (
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900">Official Note: </span>
                      {searchedApp.remarks}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 text-rose-900 rounded-2xl p-5 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <h4 className="font-bold text-sm">No Application Found</h4>
                <p className="text-xs text-rose-700">
                  We couldn't find an application matching "<span className="font-mono font-bold">{searchId}</span>". Please double-check your Application ID or submit a new registration.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
