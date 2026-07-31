import React from 'react';
import { ArrowLeft, ArrowRight, Check, GraduationCap } from 'lucide-react';

export interface EducationAndSkillsData {
  qualification: string;
  completionYear: string;
  institution: string;
  skills: string[];
  languages: string[];
}

interface EducationAndSkillsFormProps {
  data: EducationAndSkillsData;
  onChange: (field: keyof EducationAndSkillsData, value: any) => void;
  onToggleSkill: (skill: string) => void;
  onToggleLanguage: (language: string) => void;
  onBack?: () => void;
  onNext?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

export const EducationAndSkillsForm: React.FC<EducationAndSkillsFormProps> = ({
  data,
  onChange,
  onToggleSkill,
  onToggleLanguage,
  onBack,
  onNext,
  currentStep = 2,
  totalSteps = 4,
}) => {
  const defaultSkills = [
    'Teaching',
    'Counseling',
    'Basic Computing',
    'Event Management',
    'Healthcare & Hygiene',
    'Community Outreach',
  ];

  const defaultLanguages = ['English', 'Hindi', 'Regional Language'];

  return (
    <div className="max-w-[800px] w-full mx-auto space-y-6">
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(26,35,126,0.05)] border border-slate-200/80 p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-xl bg-blue-950 text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-950 tracking-tight">Education & Skills</h2>
            <p className="text-xs text-slate-500">
              Provide details about your academic background, skills, and languages.
            </p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onNext && onNext(); }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Qualification Dropdown */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-xs font-bold text-slate-800" 
                htmlFor="qualification"
              >
                Highest Qualification
              </label>
              <div className="relative">
                <select
                  id="qualification"
                  value={data.qualification || ''}
                  onChange={(e) => onChange('qualification', e.target.value)}
                  className="w-full appearance-none bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors cursor-pointer"
                >
                  <option value="" disabled>Select qualification</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Diploma / Certificate">Diploma / Certificate</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                  ▼
                </span>
              </div>
            </div>

            {/* Year of Completion */}
            <div className="flex flex-col gap-2">
              <label 
                className="text-xs font-bold text-slate-800" 
                htmlFor="year"
              >
                Year of Completion
              </label>
              <input
                id="year"
                type="text"
                value={data.completionYear || ''}
                onChange={(e) => onChange('completionYear', e.target.value)}
                placeholder="e.g., 2022"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors"
              />
            </div>
          </div>

          {/* Institution Name */}
          <div className="flex flex-col gap-2">
            <label 
              className="text-xs font-bold text-slate-800" 
              htmlFor="institution"
            >
              Institution Name
            </label>
            <input
              id="institution"
              type="text"
              value={data.institution || ''}
              onChange={(e) => onChange('institution', e.target.value)}
              placeholder="Enter school or university name"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-950 focus:border-blue-950 transition-colors"
            />
          </div>

          <div className="border-t border-slate-200/60 pt-6"></div>

          {/* Primary Skills */}
          <div className="flex flex-col gap-3">
            <label className="text-xs font-bold text-slate-800">
              Primary Skills (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2.5">
              {defaultSkills.map((skill) => {
                const isSelected = data.skills?.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    onClick={() => onToggleSkill(skill)}
                    className={`px-4 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Language Proficiency */}
          <div className="flex flex-col gap-3 pt-2">
            <label className="text-xs font-bold text-slate-800">
              Language Proficiency
            </label>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {defaultLanguages.map((lang) => {
                const isChecked = data.languages?.includes(lang);
                return (
                  <label 
                    key={lang} 
                    className="flex items-center gap-2 cursor-pointer group bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 hover:bg-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleLanguage(lang)}
                      className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-slate-800">{lang}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      {/* Action Bar */}
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
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs shadow-sm transition-opacity flex items-center gap-2 cursor-pointer"
          >
            <span>Save & Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
