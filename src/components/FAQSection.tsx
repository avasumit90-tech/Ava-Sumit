import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search, Sparkles, MessageCircle, Heart, UserCheck, ShieldCheck, Award } from 'lucide-react';

export interface FAQItem {
  id: string;
  category: 'volunteer' | 'donation' | 'platform' | 'certificate';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'volunteer',
    question: 'What is the role of an Astha Didi or Maa volunteer?',
    answer: 'Astha Didi and Maa volunteers are grassroots mentors who guide rural youth, women, and senior citizens through education drives, health workshops, and digital literacy training. You serve as a trusted community facilitator in your local district.',
  },
  {
    id: 'faq-2',
    category: 'volunteer',
    question: 'Is prior teaching or volunteering experience required?',
    answer: 'No prior formal experience is necessary! Astha Foundation provides a comprehensive online orientation and field training kit for all accepted volunteers before starting any drive.',
  },
  {
    id: 'faq-3',
    category: 'volunteer',
    question: 'How much weekly time commitment is expected from volunteers?',
    answer: 'Most active projects require 3 to 6 hours per week, typically flexible during weekends or evening sessions depending on community availability.',
  },
  {
    id: 'faq-4',
    category: 'certificate',
    question: 'How do I receive my official volunteer certificate?',
    answer: 'Upon completing your assigned project hours or module, your project coordinator verifies your participation in the portal. Verified certificates with QR verification links automatically appear in your "My Certificates" dashboard.',
  },
  {
    id: 'faq-5',
    category: 'donation',
    question: 'Are donations tax-exempt under 80G?',
    answer: 'Yes! Astha Foundation is a registered trust under Section 80G of the Income Tax Act. Tax benefit receipts are generated instantly upon completing your online contribution.',
  },
  {
    id: 'faq-6',
    category: 'donation',
    question: 'How are donation funds allocated across projects?',
    answer: '100% of direct project donations go towards student learning kits, medical supplies, and local venue logistics. Administrative overheads are separately funded through institutional grants.',
  },
  {
    id: 'faq-7',
    category: 'platform',
    question: 'How can I track my application status after submitting my registration form?',
    answer: 'Click "Check Status" in the top navigation bar or mobile drawer, then enter your registered Application ID or mobile number to get live status updates from the admin portal.',
  },
];

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFAQs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-200 shadow-xs relative overflow-hidden my-8">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <span className="inline-flex items-center gap-1.5 bg-amber-500/15 text-amber-900 border border-amber-300/60 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Common Enquiries
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          Have questions about joining as a volunteer, contributing donations, or tracking your certificates? Find answers to commonly asked questions below.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="max-w-2xl mx-auto mb-8 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions or keywords (e.g., 80G, certificate, hours)..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all shadow-2xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Questions', icon: <HelpCircle className="w-3.5 h-3.5" /> },
            { id: 'volunteer', label: 'Volunteering', icon: <UserCheck className="w-3.5 h-3.5" /> },
            { id: 'donation', label: 'Donations & 80G', icon: <Heart className="w-3.5 h-3.5" /> },
            { id: 'certificate', label: 'Certificates', icon: <Award className="w-3.5 h-3.5" /> },
            { id: 'platform', label: 'Portal Status', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-blue-950 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.icon}
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {filteredFAQs.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No matching questions found</p>
            <p className="text-[11px] text-slate-500 mt-1">Try tweaking your search term or select "All Questions".</p>
          </div>
        ) : (
          filteredFAQs.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-amber-400 bg-amber-500/5 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <button
                  onClick={() => toggleFAQ(item.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-extrabold text-xs sm:text-sm text-slate-900 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="leading-snug">{item.question}</span>
                  <div
                    className={`p-1.5 rounded-full transition-transform duration-200 shrink-0 ${
                      isOpen ? 'bg-amber-500 text-slate-950 rotate-180' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-amber-200/50">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer Support Banner */}
      <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Still have unanswered questions?</p>
            <p className="text-[11px] text-slate-500">Our support coordinators are happy to guide you personally.</p>
          </div>
        </div>

        <a
          href="mailto:support@astha.foundation"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold rounded-xl transition-colors shrink-0 cursor-pointer"
        >
          Contact Support Team
        </a>
      </div>
    </section>
  );
};
