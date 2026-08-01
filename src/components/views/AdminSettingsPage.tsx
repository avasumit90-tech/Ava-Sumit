import React, { useState, useEffect } from 'react';
import { ViewMode } from '../../types';
import * as api from '../../lib/api';
import { Settings, Shield, Save, CheckCircle } from 'lucide-react';

interface AdminSettingsPageProps {
  onNavigate: (view: ViewMode) => void;
}

export const AdminSettingsPage: React.FC<AdminSettingsPageProps> = ({ onNavigate }) => {
  const [orgName, setOrgName] = useState('Astha Foundation');
  const [orgEmail, setOrgEmail] = useState('contact@asthafoundation.org');
  const [orgPhone, setOrgPhone] = useState('+91 98765 43210');
  const [didiFee, setDidiFee] = useState('500');
  const [maaFee, setMaaFee] = useState('500');
  const [teacherFee, setTeacherFee] = useState('1000');
  const [saved, setSaved] = useState(false);

  // Live settings from Supabase — fallback to defaults
  useEffect(() => {
    api.fetchSettings().then((s) => {
      if (s) {
        if (s.org) {
          if (s.org.orgName) setOrgName(s.org.orgName);
          if (s.org.orgEmail) setOrgEmail(s.org.orgEmail);
          if (s.org.orgPhone) setOrgPhone(s.org.orgPhone);
        }
        if (s.fees) {
          if (s.fees.didiFee != null) setDidiFee(String(s.fees.didiFee));
          if (s.fees.maaFee != null) setMaaFee(String(s.fees.maaFee));
          if (s.fees.teacherFee != null) setTeacherFee(String(s.fees.teacherFee));
        }
      }
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    api.saveSettings({
      org: { orgName, orgEmail, orgPhone },
      fees: { didiFee: Number(didiFee) || 0, maaFee: Number(maaFee) || 0, teacherFee: Number(teacherFee) || 0 },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Configuration
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>System Settings & Fees</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle className="w-4 h-4" />
          <span>System settings updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-4">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Organization Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Support Email</label>
              <input
                type="email"
                value={orgEmail}
                onChange={(e) => setOrgEmail(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={orgPhone}
                onChange={(e) => setOrgPhone(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-4">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Registration Fee Structure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Astha Didi Fee (₹)</label>
              <input
                type="number"
                value={didiFee}
                onChange={(e) => setDidiFee(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Astha Maa Fee (₹)</label>
              <input
                type="number"
                value={maaFee}
                onChange={(e) => setMaaFee(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Teacher Fee (₹)</label>
              <input
                type="number"
                value={teacherFee}
                onChange={(e) => setTeacherFee(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white font-black px-8 py-3.5 rounded-xl text-xs transition-colors cursor-pointer shadow-md inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-400" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
