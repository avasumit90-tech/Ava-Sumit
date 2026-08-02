import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { Image as ImageIcon, Plus, Trash2, Search, Video, Eye } from 'lucide-react';

interface AdminGalleryPageProps {
  onNavigate: (view: ViewMode) => void;
}

interface GalleryItem {
  id: string;
  title: string;
  category: string;
  image: string;
  date: string;
}

export const AdminGalleryPage: React.FC<AdminGalleryPageProps> = ({ onNavigate }) => {
  const [items, setItems] = useState<GalleryItem[]>([
    { id: 'GAL-1', title: 'Astha Didi Skill Training Camp', category: 'Training', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800', date: '2026-07-28' },
    { id: 'GAL-2', title: 'Women Empowerment Workshop', category: 'Empowerment', image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800', date: '2026-07-25' },
    { id: 'GAL-3', title: 'Rural Student Digital Literacy Camp', category: 'Education', image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800', date: '2026-07-20' },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Training');
  const [imageUrl, setImageUrl] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newItem: GalleryItem = {
      id: `GAL-${Date.now()}`,
      title,
      category,
      image: imageUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800',
      date: new Date().toISOString().split('T')[0]
    };
    setItems([newItem, ...items]);
    setShowAddModal(false);
    setTitle('');
    setImageUrl('');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Media CMS
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-blue-600" />
            <span>Gallery Management</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Photo / Video</span>
          </button>
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-xs flex flex-col">
            <div className="relative h-48 overflow-hidden bg-slate-100">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                {item.category}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-[11px] text-slate-400 mt-1">Uploaded: {item.date}</p>
              </div>
              <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-4">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Active</span>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
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
            <h2 className="text-xl font-black text-slate-900">Upload Gallery Image</h2>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rural Camp Distribution"
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
                  <option value="Training">Training</option>
                  <option value="Empowerment">Empowerment</option>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL (Unsplash or direct)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
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
                  Upload & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
