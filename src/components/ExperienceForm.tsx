import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Briefcase, Building, CheckCircle2, Heart, Sparkles, UserCheck } from 'lucide-react';

export interface ExperienceFormData {
  experienceYears: string;
  designation: string;
  organization: string;
  responsibilities: string;
  hasVolunteeredBefore?: string;
  previousVolunteerDetails?: string;
  volunteeringInterests?: string[];
  availability?: string;
}

interface ExperienceFormProps {
  data: ExperienceFormData;
  onChange: (field: keyof ExperienceFormData, value: any) => void;
  onToggleInterest?: (interest: string) => void;
  onBack?: () => void;
  onNext?: () => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  data,
  onChange,
  onToggleInterest,
  onBack,
  onNext,
}) => {
  const [hasVolunteered, setHasVolunteered] = useState<string>(
    data.hasVolunteeredBefore || 'no'
  );

  const availableInterests = [
    'Digital Literacy Education',
    'Rural School STEM Labs',
    'Maternal & Child Healthcare',
    'Vocational Women Empowerment',
    'Clean Water & Sanitation',
    'Senior Citizen Companionship',
  ];

  return (
    <div className="max-w-[800px] w-full mx-auto space-y-6">
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(26,35,126,0.05)] border border-slate-200/80 p-6 md:p-8 relative overflow-hidden">
        {/* Top Decorative Gradient */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-950 via-amber-500 to-orange-500" />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-950 tracking-tight">Professional & Volunteer Experience</h2>
            <p className="text-xs text-slate-500">
              Please share your background to help us match you with the right opportunities.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onNext && onNext(); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Years of Experience */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-800">
                Total Years of Experience
              </label>
              <div className="relative">
                <select
                  value={data.experienceYears || ''}
                  onChange={(e) => onChange('experienceYears', e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select years...</option>
                  <option value="0 - 1 years">0 - 1 years</option>
                  <option value="1 - 3 years">1 - 3 years</option>
                  <option value="3 - 5 years">3 - 5 years</option>
                  <option value="5+ years">5+ years</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </span>
              </div>
            </div>

            {/* Current/Last Job Title */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-800">
                Current / Last Job Title
              </label>
              <input
                type="text"
                value={data.designation || ''}
                onChange={(e) => onChange('designation', e.target.value)}
                placeholder="e.g. Program Coordinator / Teacher"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors"
              />
            </div>

            {/* Organization Name */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-800">
                Organization Name
              </label>
              <input
                type="text"
                value={data.organization || ''}
                onChange={(e) => onChange('organization', e.target.value)}
                placeholder="Name of your company, NGO, or educational institution"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors"
              />
            </div>

            {/* Key Responsibilities */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-800">
                Key Responsibilities
              </label>
              <textarea
                rows={3}
                value={data.responsibilities || ''}
                onChange={(e) => onChange('responsibilities', e.target.value)}
                placeholder="Briefly describe your main professional or social leadership tasks..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors resize-y"
              />
            </div>
          </div>

          {/* Previous Volunteer Work Section */}
          <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-4">
            <label className="text-xs font-bold text-slate-900 block">
              Have you volunteered before?
            </label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="volunteered"
                  value="yes"
                  checked={hasVolunteered === 'yes'}
                  onChange={() => {
                    setHasVolunteered('yes');
                    onChange('hasVolunteeredBefore', 'yes');
                  }}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-950">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="radio"
                  name="volunteered"
                  value="no"
                  checked={hasVolunteered === 'no'}
                  onChange={() => {
                    setHasVolunteered('no');
                    onChange('hasVolunteeredBefore', 'no');
                  }}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-950">No</span>
              </label>
            </div>

            {/* Conditional Text Area */}
            {hasVolunteered === 'yes' && (
              <div className="pt-2 space-y-2 animate-in fade-in duration-200">
                <label className="text-xs font-bold text-slate-800 block">
                  Please describe your previous volunteer work
                </label>
                <textarea
                  rows={3}
                  value={data.previousVolunteerDetails || ''}
                  onChange={(e) => onChange('previousVolunteerDetails', e.target.value)}
                  placeholder="Where did you volunteer and what impact did you create?"
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors resize-y"
                />
              </div>
            )}
          </div>

          {/* Volunteering Focus Interests */}
          {onToggleInterest && (
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-800 block">
                Preferred Volunteering Focus Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = data.volunteeringInterests?.includes(interest);
                  return (
                    <button
                      type="button"
                      key={interest}
                      onClick={() => onToggleInterest(interest)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-950 text-amber-400 border-blue-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Navigation Actions */}
      <div className="flex justify-between items-center pt-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-blue-950 text-blue-950 rounded-lg font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : <div />}

        {onNext && (
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-lg font-bold text-xs shadow-md transition-opacity flex items-center gap-2 cursor-pointer"
          >
            <span>Save & Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
