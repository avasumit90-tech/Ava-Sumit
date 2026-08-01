import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { ASSETS } from '../../data';
import * as api from '../../lib/api';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowLeft, Heart, ShieldCheck } from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (view: ViewMode) => void;
  onSignUpDone: () => void;
  onLoginClick: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate, onSignUpDone, onLoginClick }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError('Sabhi fields bharo.');
      return;
    }
    if (password.length < 6) {
      setError('Password kam se kam 6 characters ka hona chahiye.');
      return;
    }
    if (password !== confirm) {
      setError('Password aur Confirm Password match nahi kar rahe.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.signUp(email.trim(), password, fullName.trim());
      if (res.error) {
        const msg = (res.error as any)?.message ?? '';
        setError(
          msg.includes('already registered') || msg.includes('already been registered')
            ? 'Ye email pehle se registered hai — Sign In karo.'
            : msg || 'Sign up failed. Dobara try karo.'
        );
      } else {
        setSuccess(
          'Account ban gaya! 🎉 Ab Sign In karke apna dashboard kholo.'
        );
        setTimeout(() => {
          onSignUpDone();
          onNavigate('login');
        }, 1800);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* LEFT: Brand panel */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-10 relative overflow-hidden">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-10">
              <img src={ASSETS.logoCircle} alt="Astha Foundation" className="w-12 h-12 rounded-full bg-white p-0.5" />
              <div>
                <p className="font-extrabold text-lg leading-tight">Astha Foundation</p>
                <p className="text-xs text-slate-400">Empowering Youth Since 2019</p>
              </div>
            </div>
            <h2 className="text-3xl font-black leading-tight mb-4">
              Join the Movement.<br />Create Your Account ✨
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Astha Didi, Astha Maa, Teacher, ya Volunteer — sabke liye ek
              account. Registration form se apni role application bharo aur
              community ka hissa bano.
            </p>
          </div>
          <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-300">
              <span className="font-bold text-white">Aapka data safe hai.</span> Profile
              sirf aap aur admins dekh sakte hain (RLS protected).
            </p>
          </div>
        </div>

        {/* RIGHT: Signup form */}
        <div className="p-8 sm:p-10">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-500 text-slate-950 rounded-2xl flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h1>
              <p className="text-xs text-slate-500">2 minute me account ban jayega</p>
            </div>
          </div>

          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-10 pr-9 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Confirm</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-[11px] text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPass}
                onChange={(e) => setShowPass(e.target.checked)}
                className="rounded border-slate-300 accent-slate-900"
              />
              Show password
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-amber-500/30 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
              <span>{loading ? 'Creating account...' : 'Create Account'}</span>
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            Pehle se account hai?{' '}
            <button
              onClick={onLoginClick}
              className="font-bold text-slate-900 hover:text-amber-700 underline underline-offset-2 cursor-pointer"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
