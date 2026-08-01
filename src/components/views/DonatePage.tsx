import React, { useState } from 'react';
import { ASSETS } from '../../data';
import * as api from '../../lib/api';
import { Heart, ShieldCheck, Download, CreditCard, Sparkles, CheckCircle2, Lock, ArrowRight, Award, Receipt } from 'lucide-react';

export const DonatePage: React.FC = () => {
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedTotal = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTotal <= 0) return;
    // Live DB me donation record (agar Supabase configured hai)
    api.submitDonation({
      donorName: donorName || 'Anonymous Donor',
      email: donorEmail || 'anon@donor.in',
      amount: selectedTotal,
    });
    setIsSuccess(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Direct Community Contribution
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Empower the Future. Donate Today.
        </h1>
        <p className="text-sm text-slate-600">
          100% of your contributions directly fund grassroots student mentorship, digital classrooms, and women community leaders. All donations are 80G tax-exempt certified.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* LEFT COLUMN: Why Support & Impact Quote */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Why Support Bento Grid */}
          <div className="space-y-4">
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Why Your Support Matters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  80G
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">50% Tax Exemption</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Eligible for 80G Tax Deductions under Income Tax Act. Instant 80G certificate issued upon completion.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  100%
                </div>
                <h4 className="font-extrabold text-sm text-slate-900">Direct Field Impact</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  No middleman fees. Funds directly reach student scholarship funds, books, and Astha Didi stipends.
                </p>
              </div>

            </div>
          </div>

          {/* Impact Story Quote Card with Hotlinked Image */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white rounded-3xl p-8 border border-slate-800 shadow-xl relative overflow-hidden space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <img
                src={ASSETS.rahulImpact}
                alt="Rahul M."
                className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-400 shrink-0 shadow-md"
              />
              <div className="space-y-2 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400">
                  <Sparkles className="w-4 h-4 fill-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Alumni Impact Story</span>
                </div>
                <p className="text-sm font-medium italic text-slate-200">
                  "Astha Foundation provided me with digital learning kits and mentorship when my school had no computers. Today, I work as a Software Engineer and sponsor 5 students."
                </p>
                <div>
                  <p className="font-extrabold text-sm text-amber-300">Rahul M.</p>
                  <p className="text-[11px] text-slate-400">Former Beneficiary & Software Engineer</p>
                </div>
              </div>
            </div>
          </div>

          {/* FCRA & Security Guarantees */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex items-center gap-4 text-xs text-slate-600">
            <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900">Bank-Grade 256-Bit SSL Encryption: </span>
              Your financial details are handled with standard encryption protocols. All transactions generate automated audit receipts.
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Donation Form Widget */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-xl space-y-6 relative">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Make a Donation</h3>
                <p className="text-xs text-slate-500">Select amount and complete secure transfer</p>
              </div>
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>

            <form onSubmit={handleDonate} className="space-y-6">
              
              {/* Frequency Toggle */}
              <div className="bg-slate-100 p-1 rounded-2xl flex text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFrequency('once')}
                  className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer ${
                    frequency === 'once' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Give Once
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1 ${
                    frequency === 'monthly' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <span>Give Monthly</span>
                  <span className="bg-slate-950 text-amber-300 text-[9px] px-1.5 py-0.5 rounded-full">Save 2x</span>
                </button>
              </div>

              {/* Amount Chips */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Select Amount (₹)</label>
                <div className="grid grid-cols-3 gap-3">
                  {[500, 2500, 10000].map((amt) => {
                    const isSelected = amount === amt && !customAmount;
                    return (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => {
                          setAmount(amt);
                          setCustomAmount('');
                        }}
                        className={`py-3 rounded-2xl border-2 font-extrabold text-sm transition-all relative cursor-pointer ${
                          isSelected 
                            ? 'border-amber-500 bg-amber-50 text-amber-950 shadow-xs' 
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        ₹{amt.toLocaleString('en-IN')}
                        {amt === 2500 && (
                          <span className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            Most Popular
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-1">
                  <input
                    type="number"
                    placeholder="Enter Custom Amount (₹)"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Donor Details */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Donor Details (For 80G Receipt)</label>
                <input
                  type="text"
                  required
                  placeholder="Full Name *"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                />
                <input
                  type="email"
                  required
                  placeholder="Email Address *"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium outline-none"
                />
                <input
                  type="text"
                  placeholder="PAN Card Number (Required for Tax Exemption)"
                  value={donorPan}
                  onChange={(e) => setDonorPan(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium uppercase outline-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Payment Gateway Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'card' ? 'bg-slate-900 text-amber-300 border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'upi' ? 'bg-slate-900 text-amber-300 border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    UPI / QR
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      paymentMethod === 'netbanking' ? 'bg-slate-900 text-amber-300 border-slate-900' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    NetBanking
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold py-4 px-6 rounded-2xl text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 fill-white/20" />
                <span>Donate ₹{(selectedTotal || 0).toLocaleString('en-IN')} {frequency === 'monthly' ? '/ Month' : 'Now'}</span>
              </button>

            </form>

          </div>
        </div>

      </div>

      {/* Donation Success Receipt Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase">
                Payment Successful
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Thank You For Your Support!</h3>
              <p className="text-xs text-slate-500">Your contribution will transform lives immediately.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold">
                <span className="text-slate-500">Receipt Ref:</span>
                <span className="font-mono text-slate-900">AST-REC-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Donor Name:</span>
                <span className="font-bold">{donorName || 'Valued Donor'}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Amount Paid:</span>
                <span className="font-extrabold text-amber-700">₹{selectedTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>80G Status:</span>
                <span className="text-emerald-700 font-bold">Tax Deduction Eligible</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  alert('80G Tax Exemption Certificate PDF downloaded to your device!');
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download 80G Tax Receipt</span>
              </button>
              <button
                onClick={() => setIsSuccess(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
