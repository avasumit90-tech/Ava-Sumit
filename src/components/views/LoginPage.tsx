import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { ASSETS } from '../../data';
import * as api from '../../lib/api';
import { Shield, Mail, Lock, LogIn, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2, ArrowLeft, Heart } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (view: ViewMode) => void;
  onLogin: (email: string) => void;
  onSignUpClick: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, onLogin, onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email.trim() || !password) {
      setError('Email aur password dono bharo.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.signIn(email.trim(), password);
      if (res.error) {
        const msg = (res.error as any)?.message ?? '';
        setError(
          msg.includes('Invalid login') || msg.includes('invalid_credentials')
            ? 'Galat email ya password. Dobara try karo.'
            : msg.includes('Email not confirmed')
            ? 'Email confirm nahi hua hai — pehle apne inbox me confirmation link click karo.'
            : msg || 'Login failed. Dobara try karo.'
        );
      } else {
        setInfo('Login successful! Welcome back. 👋');
        setTimeout(() => {
          onLogin(email.trim());
          onNavigate('home');
        }, 800);
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail('test@asthafoundation.org');
    setPassword('Astha@Test#2026');
    setError(null);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-4xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* LEFT: Brand panel */}
        <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-10">
              <img src={ASSETS.logoCircle} alt="Astha Foundation" className="w-12 h-12 rounded-full bg-white p-0.5" />
              <div>
                <p className="font-extrabold text-lg leading-tight">Astha Foundation</p>
                <p className="text-xs text-slate-400">Empowering Youth Since 2019</p>
              </div>
            </div>
            <h2 className="text-3xl font-black leading-tight mb-4">
              Welcome Back to the<br />Astha Community 🤝
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Sign in to access your volunteer dashboard, track applications,
              view certificates, and manage your community contributions.
            </p>
          </div>
          <div className="relative flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-300">
              <span className="font-bold text-white">50K+ beneficiaries</span> impacted across
              education, health & community programs.
            </p>
          </div>
        </div>

        {/* RIGHT: Login form */}
        <div className="p-8 sm:p-10">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-2xl flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In</h1>
              <p className="text-xs text-slate-500">Apne account me login karo</p>
            </div>
          </div>

          {info && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {info}
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

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-700 cursor-pointer"
                  aria-label="Toggle password"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-3.5 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-slate-900/20 disabled:opacity-60 inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4 text-amber-400" />}
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-5 p-3.5 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-[11px] text-amber-900 font-bold mb-1.5">Demo Admin account</p>
            <button
              onClick={fillDemo}
              className="text-[11px] font-mono text-amber-800 bg-white border border-amber-300 rounded-lg px-2.5 py-1 hover:bg-amber-100 transition-colors cursor-pointer"
            >
              test@asthafoundation.org
            </button>
            <p className="text-[10px] text-amber-700 mt-1.5">Click karke bharo → Sign In</p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            Naya account?{' '}
            <button
              onClick={onSignUpClick}
              className="font-bold text-slate-900 hover:text-amber-700 underline underline-offset-2 cursor-pointer"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
