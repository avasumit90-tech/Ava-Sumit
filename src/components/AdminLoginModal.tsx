import React, { useState } from 'react';
import { X, Shield, LogIn, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import * as api from '../lib/api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
  onLogout: () => void;
  currentUser: { email?: string } | null;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onLogout,
  currentUser,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.signIn(email, password);
      if (res.error) {
        setError('Login failed — email ya password galat hai. (Admin account chahiye: test@asthafoundation.org)');
      } else {
        onLogin(email);
        setEmail('');
        setPassword('');
        onClose();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await api.signOut();
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Admin Login</h3>
            <p className="text-xs text-slate-500">Live database access — admin/super_admin account chahiye</p>
          </div>
        </div>

        {currentUser ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-emerald-900 truncate">{currentUser.email}</p>
                <p className="text-xs text-emerald-700">Logged in as admin — live data on hai</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold py-3 rounded-xl text-xs transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@asthafoundation.org"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3 rounded-xl text-xs transition-colors cursor-pointer shadow-md inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 text-amber-400" />}
              <span>{loading ? 'Signing in...' : 'Sign In to Admin Panel'}</span>
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              Test admin: <span className="font-mono">test@asthafoundation.org</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
