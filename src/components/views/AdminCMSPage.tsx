import React, { useState, useEffect } from 'react';
import { ViewMode } from '../../types';
import * as api from '../../lib/api';
import { Layout, Save, CheckCircle } from 'lucide-react';

interface AdminCMSPageProps {
  onNavigate: (view: ViewMode) => void;
}

export const AdminCMSPage: React.FC<AdminCMSPageProps> = ({ onNavigate }) => {
  const [heroTitle, setHeroTitle] = useState('Empowering Rural Women & Transforming Grassroots Communities');
  const [heroSubtitle, setHeroSubtitle] = useState('Join Astha Foundation as an Astha Didi, Astha Maa, or Teacher. Together we build self-reliance and education across India.');
  const [saved, setSaved] = useState(false);

  // Live CMS content from Supabase — fallback to defaults
  useEffect(() => {
    api.fetchCmsContent().then((c) => {
      setHeroTitle(c.heroTitle);
      setHeroSubtitle(c.heroSubtitle);
    });
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    api.saveCmsContent({ heroTitle, heroSubtitle });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Website Content
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Layout className="w-6 h-6 text-blue-600" />
            <span>Website CMS & Banner Management</span>
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
          <span>Website banner and CMS content updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-4">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Home Banner Section</h2>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Main Headline</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hero Subtitle Description</label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
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
            <span>Publish CMS Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
