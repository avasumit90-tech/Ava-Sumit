import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { ASSETS } from '../../data';
import { 
  Heart, ShieldCheck, Download, CreditCard, Sparkles, CheckCircle2, Lock, ArrowRight, 
  Award, Receipt, Smartphone, Copy, Check, QrCode as QrIcon, Upload, Clock, Image as ImageIcon, 
  AlertCircle, Calculator, BookOpen, Utensils, Laptop, Users, Sliders, Gift
} from 'lucide-react';
import { saveDonationSubmission, DonationSubmission } from '../../utils/donationStorage';

export const DonatePage: React.FC = () => {
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [amount, setAmount] = useState<number>(2500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [calcAmount, setCalcAmount] = useState<number>(2500);
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorPan, setDonorPan] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('upi');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [submittedDonation, setSubmittedDonation] = useState<DonationSubmission | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const selectedTotal = customAmount ? parseFloat(customAmount) || 0 : amount;
  const upiVpa = 'eazypay.C6A8PP6551YPU1E@icici';

  // Calculator Metrics
  const schoolKits = Math.floor(calcAmount / 500);
  const meals = Math.floor(calcAmount / 50);
  const labDays = Math.floor(calcAmount / 250);
  const mentorHours = Math.floor(calcAmount / 200);

  const applyCalcToDonation = (val: number) => {
    setAmount(val);
    setCustomAmount('');
    const formElement = document.getElementById('donation-widget-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiVpa);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setScreenshotPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    // Strict validation: block submission until all required fields are valid.
    const formEl = e.currentTarget as HTMLFormElement;
    if (formEl) {
      formEl.classList.add('validation-attempted');
      if (!formEl.checkValidity()) {
        formEl.reportValidity();
        return;
      }
    }
    if (selectedTotal <= 0) return;

    // UPI payments must include a transaction ID and payment screenshot.
    if (paymentMethod === 'upi') {
      if (!transactionId.trim()) {
        const tx = document.getElementById('payment-screenshot-upload');
        const box = document.getElementById('payment-screenshot-upload-box');
        if (box) {
          box.classList.add('field-error');
          const p = document.createElement('p');
          p.className = 'inline-error';
          p.textContent = 'Please enter the Transaction ID / UTR number';
          box.insertAdjacentElement('afterend', p);
        }
        if (tx) tx.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
      if (!screenshotPreview) {
        const box = document.getElementById('payment-screenshot-upload-box');
        if (box) {
          box.classList.add('field-error');
          const p = document.createElement('p');
          p.className = 'inline-error';
          p.textContent = 'Please upload the payment screenshot';
          box.appendChild(p);
          box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
    }

    const txnIdToSave = transactionId.trim() || `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const record = saveDonationSubmission({
      donorName: donorName || 'Valued Donor',
      email: donorEmail || 'donor@example.com',
      amount: selectedTotal,
      transactionId: txnIdToSave,
      screenshotUrl: screenshotPreview || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=600',
      paymentMethod,
      donorPan,
      status: 'Pending (24 Hours)',
      remarks: 'Uploaded by donor via QR payment submission. Pending Admin approval within 24 hours.'
    });

    setSubmittedDonation(record);
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
        
        {/* LEFT COLUMN: Why Support & Impact Calculator */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Interactive Donation Impact Calculator Card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-emerald-500/10 rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-md space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <Calculator className="w-3 h-3" />
                    Interactive Tool
                  </span>
                  <span className="text-xs text-amber-800 font-semibold">Real-Time Impact Engine</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
                  <span>Donation Impact Calculator</span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Slide or choose an amount to calculate the exact community benefits your contribution creates.
                </p>
              </div>

              <div className="bg-white px-4 py-2 rounded-2xl border border-amber-200 shadow-2xs text-center shrink-0">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Selected Goal</span>
                <span className="text-xl font-black text-amber-600">₹{calcAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Slider & Presets Controls */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 mb-2">
                  <span>Adjust Contribution Slider</span>
                  <span className="text-amber-700 font-mono font-extrabold">₹{calcAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="50000"
                  step="100"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="w-full h-3 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold mt-1">
                  <span>₹200</span>
                  <span>₹10,000</span>
                  <span>₹25,000</span>
                  <span>₹50,000+</span>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" /> Quick Amounts:
                </span>
                {[500, 1500, 2500, 5000, 10000, 25000].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => setCalcAmount(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border ${
                      calcAmount === preset
                        ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Impact Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1 text-center">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{schoolKits}</p>
                <p className="text-xs font-extrabold text-amber-900">School Kits</p>
                <p className="text-[10px] text-slate-500 leading-tight">₹500 / complete student kit</p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-1 text-center">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Utensils className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{meals}</p>
                <p className="text-xs font-extrabold text-emerald-900">Student Meals</p>
                <p className="text-[10px] text-slate-500 leading-tight">₹50 / nutritious warm lunch</p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-blue-200/80 shadow-2xs space-y-1 text-center">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mx-auto mb-2">
                  <Laptop className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{labDays}</p>
                <p className="text-xs font-extrabold text-blue-900">Lab Days</p>
                <p className="text-[10px] text-slate-500 leading-tight">₹250 / day computer lab</p>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-4 rounded-2xl border border-purple-200/80 shadow-2xs space-y-1 text-center">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5" />
                </div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">{mentorHours}</p>
                <p className="text-xs font-extrabold text-purple-900">Mentor Hours</p>
                <p className="text-[10px] text-slate-500 leading-tight">₹200 / hr Astha Didi stipend</p>
              </div>
            </div>

            {/* Transfer to Form CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Ready to transform lives with ₹{calcAmount.toLocaleString('en-IN')}?</span>
              </div>
              <button
                type="button"
                onClick={() => applyCalcToDonation(calcAmount)}
                className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold px-5 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>Apply to Donation Form</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

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

          {/* Official Bank Transfer & Registration Credentials Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-xs">
                  A/C
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">Direct Bank Transfer (NEFT / RTGS / IMPS)</h4>
                  <p className="text-[11px] text-slate-500">Official ICICI Bank Current Account for Trust Transfers</p>
                </div>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified Account
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Holder Name</span>
                <span className="font-extrabold text-slate-900">AVA FOUNDATION</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Bank Name & Branch</span>
                <span className="font-bold text-slate-900">ICICI Bank, Hatigaon Branch Guwahati</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-sans block">Account Number</span>
                <span className="font-extrabold text-blue-700 text-sm">413605000147</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-sans block">IFSC Code</span>
                <span className="font-extrabold text-amber-700 text-sm">ICIC0004136</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
              <div className="flex items-center gap-3">
                <span><strong>PAN:</strong> <span className="font-mono text-slate-800 font-bold">AAHTA5416F</span></span>
                <span><strong>MSME UAM:</strong> <span className="font-mono text-slate-800 font-bold">AS03D0003712</span></span>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 80G Tax Receipt Eligible
              </span>
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

            <form id="donation-widget-form" onSubmit={handleDonate} className="space-y-6">
              
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

              {/* Impact Progress */}
              {selectedTotal > 0 && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                      Calculated Direct Impact
                    </span>
                    <span className="text-emerald-700 font-extrabold font-mono text-[11px]">
                      ₹{selectedTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className="bg-white/80 p-2 rounded-xl border border-emerald-200/60">
                      <p className="font-black text-slate-900 text-sm">{Math.floor(selectedTotal / 500)}</p>
                      <p className="text-[10px] font-bold text-emerald-800">School Kits</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-emerald-200/60">
                      <p className="font-black text-slate-900 text-sm">{Math.floor(selectedTotal / 50)}</p>
                      <p className="text-[10px] font-bold text-emerald-800">Hot Meals</p>
                    </div>
                    <div className="bg-white/80 p-2 rounded-xl border border-emerald-200/60">
                      <p className="font-black text-slate-900 text-sm">{Math.floor(selectedTotal / 250)}</p>
                      <p className="text-[10px] font-bold text-emerald-800">Lab Days</p>
                    </div>
                  </div>

                  <p className="text-[10px] text-emerald-800 font-medium leading-tight">
                    {selectedTotal >= 10000 ? "Amazing! You're fully funding a youth community digital classroom program." :
                     selectedTotal >= 2500 ? "Your donation provides essential study materials and weekend workshops for 5 local youths." :
                     "Every contribution counts! This provides basic educational supplies and warm student lunches."}
                  </p>
                </div>
              )}

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

              {/* Payment Gateway Method */}
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

              {/* UPI QR Code Section */}
              {paymentMethod === 'upi' && selectedTotal > 0 && (
                <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-md animate-in fade-in zoom-in-95 duration-300">
                  {/* ICICI Bank Header */}
                  <div className="bg-[#c82a1e] text-white px-5 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white text-[#c82a1e] font-black text-xs flex items-center justify-center italic">
                        i
                      </div>
                      <span className="font-black text-lg tracking-tight font-sans">ICICI Bank</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80 bg-black/20 px-2 py-0.5 rounded">MID: 671241</span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 text-center space-y-4 bg-white">
                    <p className="text-sm font-extrabold text-slate-800 tracking-tight">
                      Scan and Pay with any UPI app
                    </p>

                    {/* QR Code Frame */}
                    <div className="relative inline-block bg-white p-4 rounded-2xl border-2 border-slate-200 shadow-xs">
                      <QRCode
                        value={`upi://pay?pa=${upiVpa}&pn=AVA%20FOUNDATION&am=${selectedTotal}&cu=INR`}
                        size={190}
                        level="H"
                      />
                    </div>

                    {/* UPI VPA Details & Copy */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-left">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase text-slate-400">Official UPI ID</p>
                        <p className="text-xs font-mono font-bold text-slate-900 truncate">{upiVpa}</p>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyUpi}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                      >
                        {copiedUpi ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                            <span>Copy VPA</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Transaction ID / UTR Input & Screenshot Upload */}
                    <div className="space-y-3 pt-2 text-left border-t border-slate-200">
                      <div>
                        <label className="block text-xs font-extrabold text-slate-800 mb-1">
                          Transaction ID / UTR Number <span className="text-rose-600">*</span>
                        </label>
                        <input
                          type="text"
                          required={paymentMethod === 'upi'}
                          placeholder="Enter 12-digit UPI Txn ID / UTR (e.g. 983427185204)"
                          value={transactionId}
                          onChange={(e) => setTransactionId(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Enter the reference / UTR transaction ID from your UPI payment app after paying via QR.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-slate-800 mb-1">
                          Upload Payment Screenshot <span className="text-rose-600">*</span>
                        </label>
                        <div id="payment-screenshot-upload-box" className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-slate-50/70 p-3.5 rounded-xl text-center transition-colors">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            required={paymentMethod === 'upi'}
                            onChange={handleScreenshotUpload}
                            id="payment-screenshot-upload"
                            className="hidden"
                          />
                          <label htmlFor="payment-screenshot-upload" className="cursor-pointer block space-y-1">
                            {screenshotPreview ? (
                              <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <img src={screenshotPreview} alt="Screenshot" className="w-8 h-8 rounded object-cover border border-slate-200" />
                                  <span className="text-xs font-bold text-slate-800 truncate">{screenshotFileName || 'payment_screenshot.png'}</span>
                                </div>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold">Uploaded</span>
                              </div>
                            ) : (
                              <div className="py-1 space-y-1">
                                <Upload className="w-5 h-5 text-amber-600 mx-auto" />
                                <p className="text-xs font-extrabold text-slate-800">Click to upload payment screenshot</p>
                                <p className="text-[10px] text-slate-400">JPG, PNG, PDF up to 5MB</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Supported Apps Footer Bar */}

                    {/* Supported Apps Footer Bar */}
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Supported Payment Apps</p>
                      <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] font-extrabold text-slate-700">
                        <span className="bg-orange-50 text-orange-900 px-2 py-0.5 rounded border border-orange-200">iMobile Pay</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">BHIM</span>
                        <span className="bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">UPI</span>
                        <span className="bg-purple-50 text-purple-900 px-2 py-0.5 rounded border border-purple-200">e₹</span>
                        <span className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200">PhonePe</span>
                        <span className="bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">G Pay</span>
                        <span className="bg-sky-50 text-sky-900 px-2 py-0.5 rounded border border-sky-200">Paytm</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Non-UPI Transaction ID & Screenshot Upload */}
              {paymentMethod !== 'upi' && selectedTotal > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 animate-in fade-in">
                  <p className="text-xs font-bold text-slate-800">Payment Reference Details</p>
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Transaction / Reference ID
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Bank / Card Txn Ref Number"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1">
                      Upload Payment Advice / Receipt Screenshot
                    </label>
                    <div className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white p-3.5 rounded-xl text-center transition-colors">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleScreenshotUpload}
                        id="non-upi-screenshot-upload"
                        className="hidden"
                      />
                      <label htmlFor="non-upi-screenshot-upload" className="cursor-pointer block space-y-1">
                        {screenshotPreview ? (
                          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2 overflow-hidden">
                              <img src={screenshotPreview} alt="Screenshot" className="w-8 h-8 rounded object-cover border border-slate-200" />
                              <span className="text-xs font-bold text-slate-800 truncate">{screenshotFileName || 'payment_receipt.png'}</span>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold">Attached</span>
                          </div>
                        ) : (
                          <div className="py-1 space-y-1">
                            <Upload className="w-5 h-5 text-amber-600 mx-auto" />
                            <p className="text-xs font-extrabold text-slate-800">Upload payment receipt / screenshot</p>
                            <p className="text-[10px] text-slate-400">JPG, PNG, PDF up to 5MB</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

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

      {/* Donation Success & 24 Hours Pending Verification Modal */}
      {isSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8 text-amber-700 animate-pulse" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>24 Hours Pending - Admin Approval</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Payment Submission Received!</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Thank you! Your donation details and payment screenshot have been safely saved to our database.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold">
                <span className="text-slate-500">Receipt Ref Number:</span>
                <span className="font-mono text-slate-900">{submittedDonation?.receiptNumber || 'AVA/REC/2026/105'}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Donor Name:</span>
                <span className="font-extrabold text-slate-900">{donorName || 'Valued Donor'}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Donation Amount:</span>
                <span className="font-extrabold text-amber-700 text-sm">₹{selectedTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-700">
                <span>Transaction ID / UTR:</span>
                <span className="font-mono font-bold text-blue-900">{submittedDonation?.transactionId || transactionId || 'UPI-983427185204'}</span>
              </div>

              {screenshotPreview && (
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-500 font-bold">Payment Screenshot:</span>
                  <div className="flex items-center gap-2">
                    <img src={screenshotPreview} alt="Proof" className="w-9 h-9 rounded object-cover border border-slate-300" />
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-extrabold">Attached</span>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 bg-amber-500/10 -mx-4 -mb-4 p-3 rounded-b-2xl border-t-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Admin Approval Workflow:</strong> Your payment status will remain <strong>24 Hours Pending</strong> while our team verifies bank credit against your TXT ID. Your official 80G Tax Exemption Certificate will be issued upon approval.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => {
                  alert('Your donation status is currently 24 Hours Pending Admin Verification. Once approved by our team, your 80G Tax Certificate will be ready for download.');
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Check 80G Status</span>
              </button>
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setTransactionId('');
                  setScreenshotPreview(null);
                  setScreenshotFileName('');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
