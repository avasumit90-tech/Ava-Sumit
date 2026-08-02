import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { Briefcase, Plus, Trash2, CheckCircle } from 'lucide-react';

interface AdminPartnersPageProps {
  onNavigate: (view: ViewMode) => void;
}

interface PartnerItem {
  id: string;
  name: string;
  logoUrl: string;
  website: string;
  displayOrder: number;
  status: 'Active' | 'Inactive';
}

export const AdminPartnersPage: React.FC<AdminPartnersPageProps> = ({ onNavigate }) => {
  const [partners, setPartners] = useState<PartnerItem[]>([
    { id: 'PAR-1', name: 'NABARD Rural Dev', logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200', website: 'https://nabard.org', displayOrder: 1, status: 'Active' },
    { id: 'PAR-2', name: 'Skill India Mission', logoUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=200', website: 'https://skillindia.gov.in', displayOrder: 2, status: 'Active' },
    { id: 'PAR-3', name: 'Ministry of Women & Child', logoUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=200', website: 'https://wcd.nic.in', displayOrder: 3, status: 'Active' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [website, setWebsite] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newPartner: PartnerItem = {
      id: `PAR-${Date.now()}`,
      name,
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=200',
      website: website || 'https://example.com',
      displayOrder: partners.length + 1,
      status: 'Active'
    };
    setPartners([...partners, newPartner]);
    setShowAddModal(false);
    setName('');
    setLogoUrl('');
    setWebsite('');
  };

  const handleDelete = (id: string) => {
    setPartners(partners.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Sponsorship & Partners
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-600" />
            <span>Partner Logo Management</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Partner Logo</span>
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
                <th className="p-4 sm:px-6">Partner Name</th>
                <th className="p-4 sm:px-6">Logo Preview</th>
                <th className="p-4 sm:px-6">Website URL</th>
                <th className="p-4 sm:px-6">Display Order</th>
                <th className="p-4 sm:px-6">Status</th>
                <th className="p-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {partners.map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:px-6 font-bold text-slate-900">{p.name}</td>
                  <td className="p-4 sm:px-6">
                    <img src={p.logoUrl} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                  </td>
                  <td className="p-4 sm:px-6 font-mono text-blue-600">{p.website}</td>
                  <td className="p-4 sm:px-6 font-bold text-slate-700">#{p.displayOrder}</td>
                  <td className="p-4 sm:px-6">
                    <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-rose-600 hover:text-rose-700 p-2 rounded-lg hover:bg-rose-50 cursor-pointer"
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
            <h2 className="text-xl font-black text-slate-900">Add Partner Logo</h2>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Partner Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ministry of Rural Development"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Logo Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://partner.gov.in"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
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
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
