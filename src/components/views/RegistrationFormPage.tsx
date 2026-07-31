import React, { useState } from 'react';
import { RoleType, RegistrationFormData, ApplicationStatus } from '../../types';
import { User, GraduationCap, Briefcase, FileCheck, ArrowLeft, ArrowRight, Save, CheckCircle2, Upload, X, ShieldAlert, Sparkles, Check, Home, Camera, BadgeCheck, FileText } from 'lucide-react';
import { EducationAndSkillsForm } from '../EducationAndSkillsForm';
import { ExperienceForm } from '../ExperienceForm';
import { DocumentUploadForm } from '../DocumentUploadForm';

interface RegistrationFormPageProps {
  selectedRole: RoleType;
  onBackToRoles: () => void;
  onSubmitApplication: (app: ApplicationStatus) => void;
}

export const RegistrationFormPage: React.FC<RegistrationFormPageProps> = ({
  selectedRole,
  onBackToRoles,
  onSubmitApplication
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [draftNotice, setDraftNotice] = useState(false);

  const roleTitles: Record<RoleType, string> = {
    didi: 'Astha Didi (Female Student Mentor)',
    maa: 'Astha Maa (Community Maternal Leader)',
    teacher: 'Affiliated Educator / Teacher',
    student: 'Student Beneficiary',
    coordinator: 'District / Block Coordinator'
  };

  const [formData, setFormData] = useState<RegistrationFormData>({
    role: selectedRole,
    fullName: '',
    dob: '',
    gender: 'Female',
    phone: '',
    email: '',
    address: '',
    passportPhoto: null,
    qualification: 'Bachelor\'s Degree',
    fieldOfStudy: 'Social Sciences',
    institution: '',
    completionYear: '2023',
    skills: ['Mentorship', 'Counseling'],
    languages: ['Hindi', 'English'],
    experienceYears: '1-3 Years',
    organization: '',
    designation: '',
    responsibilities: '',
    volunteeringInterests: ['Youth Mentorship', 'Education Outreach'],
    availability: 'Part-time (Weekends)',
    identityProofType: 'Aadhar Card',
    identityDocName: null,
    identityFrontDocName: null,
    identityBackDocName: null,
    addressProofType: 'Electricity Bill',
    addressDocName: null,
    termsAccepted: false
  });

  const availableSkills = ['Mentorship', 'Counseling', 'Teaching', 'Healthcare', 'Community Outreach', 'Public Speaking', 'Event Planning', 'Digital Literacy'];
  const availableLanguages = ['Hindi', 'English', 'Marathi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu'];
  const availableInterests = ['Youth Mentorship', 'Education Outreach', 'Maternal Health', 'Digital Classroom', 'Clean Water', 'Disaster Relief'];

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: 'skills' | 'languages' | 'volunteeringInterests', item: string) => {
    setFormData(prev => {
      const arr = prev[field];
      if (arr.includes(item)) {
        return { ...prev, [field]: arr.filter(x => x !== item) };
      } else {
        return { ...prev, [field]: [...arr, item] };
      }
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, passportPhoto: event.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (field: 'identityFrontDocName' | 'identityBackDocName' | 'addressDocName', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file.name }));
    }
  };

  const handleSaveDraft = () => {
    setDraftNotice(true);
    setTimeout(() => setDraftNotice(false), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      alert('Please agree to the Terms and Conditions to submit your application.');
      return;
    }
    const newId = `AST-${selectedRole.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const newApp: ApplicationStatus = {
      id: newId,
      applicantName: formData.fullName || 'Anonymous Applicant',
      role: roleTitles[selectedRole],
      submittedDate: new Date().toLocaleDateString(),
      status: 'Under Review',
      stepCompleted: 4,
      totalSteps: 4,
      remarks: 'Application submitted successfully. Background verification pending.'
    };

    onSubmitApplication(newApp);
    setSubmittedAppId(newId);
  };

  const steps = [
    { number: 1, title: 'Personal Details', icon: <User className="w-4 h-4" /> },
    { number: 2, title: 'Education & Skills', icon: <GraduationCap className="w-4 h-4" /> },
    { number: 3, title: 'Experience & Interest', icon: <Briefcase className="w-4 h-4" /> },
    { number: 4, title: 'Documents & Photo', icon: <FileCheck className="w-4 h-4" /> }
  ];

  if (submittedAppId) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        {/* Glassmorphism Card for Success State */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden relative backdrop-blur-sm text-left">
          {/* Decorative Top Green Border */}
          <div className="h-2 bg-emerald-600 w-full absolute top-0 left-0"></div>

          <div className="p-6 sm:p-10 flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 relative">
              {/* Pulsing background effect */}
              <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }}></div>
              <CheckCircle2 className="w-14 h-14 text-emerald-600 relative z-10" />
            </div>

            {/* Hero Text */}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Registration Successful!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-lg mb-8 leading-relaxed">
              Thank you for joining the Astha Foundation as an <span className="font-bold text-slate-900">{roleTitles[selectedRole]}</span>.
            </p>

            {/* Application Summary Bento Card */}
            <div className="bg-slate-50 rounded-xl p-6 w-full mb-8 border border-slate-200 text-left space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
                <FileCheck className="w-5 h-5 text-slate-900" />
                <h2 className="text-base font-bold text-slate-900">Application Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-1">Application ID</span>
                  <span className="block font-mono font-bold text-slate-900 text-base">{submittedAppId}</span>
                </div>
                <div>
                  <span className="block text-xs font-medium text-slate-500 mb-1">Status</span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 bg-blue-100 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    Under Review
                  </span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-1">What happens next?</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Our team will review your documents within 3-5 business days. You will receive an email notification once your profile is verified.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <button
                onClick={onBackToRoles}
                className="bg-slate-900 text-white font-bold text-xs px-8 py-3.5 rounded-full hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => alert(`Application ${submittedAppId} is currently Under Review by the admin team.`)}
                className="bg-transparent text-slate-900 border border-slate-300 font-bold text-xs px-8 py-3.5 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>View Application Details</span>
              </button>
            </div>
          </div>

          {/* Help Section within card bottom */}
          <div className="bg-slate-100 border-t border-slate-200 p-4 text-center">
            <p className="text-xs text-slate-600 flex items-center justify-center gap-1.5">
              <span>Have questions? Contact us at</span>
              <a
                href="mailto:support@asthafoundation.org"
                className="text-slate-900 font-bold hover:text-orange-600 underline transition-colors"
              >
                support@asthafoundation.org
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Top Header & Role Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={onBackToRoles}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Change Selected Role</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Registration Portal
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Applying for: <span className="font-bold text-amber-700">{roleTitles[selectedRole]}</span>
          </p>
        </div>

        {/* Draft Notice */}
        {draftNotice && (
          <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            Draft progress saved locally!
          </div>
        )}
      </div>

      {/* Step Progress Visual */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/5 via-amber-500/5 to-transparent pointer-events-none" />
        <nav aria-label="Progress">
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-4" role="list">
            {steps.map((step) => {
              const isActive = currentStep === step.number;
              const isDone = currentStep > step.number;

              return (
                <li key={step.number}>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(step.number)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                        : isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-black text-xs ${
                      isActive ? 'bg-amber-500 text-slate-950 shadow-xs' : isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isDone ? <Check className="w-4 h-4" /> : step.number}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Step {step.number}</p>
                      <p className="text-xs truncate">{step.title}</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {/* Form Content Area */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-amber-600" />
                Personal Information
              </h2>
              <p className="text-xs text-slate-500 mt-1">Please provide your basic details accurately matching your official ID proof.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="fullName">
                  Full Name *
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  placeholder="e.g. Anjali Sharma"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
                />
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="dob">
                  Date of Birth *
                </label>
                <input
                  id="dob"
                  type="date"
                  required
                  value={formData.dob}
                  onChange={(e) => handleInputChange('dob', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="gender">
                  Gender *
                </label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Contact Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="phone">
                  Contact Number *
                </label>
                <div className="flex rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-blue-900 transition-all">
                  <span className="inline-flex items-center px-3.5 bg-slate-100 border-r border-slate-300 text-xs font-bold text-slate-600 select-none">
                    +91
                  </span>
                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="98765 43210"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="email">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="anjali.s@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
                />
              </div>

              {/* Permanent Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="address">
                  Residential Address *
                </label>
                <textarea
                  id="address"
                  rows={3}
                  required
                  placeholder="Enter your full residential address (Street, Landmark, Block/District, Pincode)..."
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all resize-y"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Education & Skills */}
        {currentStep === 2 && (
          <div className="animate-in fade-in duration-200">
            <EducationAndSkillsForm
              data={{
                qualification: formData.qualification,
                completionYear: formData.completionYear,
                institution: formData.institution,
                skills: formData.skills,
                languages: formData.languages,
              }}
              onChange={(field, val) => handleInputChange(field as any, val)}
              onToggleSkill={(sk) => toggleArrayItem('skills', sk)}
              onToggleLanguage={(lang) => toggleArrayItem('languages', lang)}
            />
          </div>
        )}

        {/* STEP 3: Experience & Interest */}
        {currentStep === 3 && (
          <div className="animate-in fade-in duration-200">
            <ExperienceForm
              data={{
                experienceYears: formData.experienceYears,
                designation: formData.designation,
                organization: formData.organization,
                responsibilities: formData.responsibilities,
                volunteeringInterests: formData.volunteeringInterests,
                availability: formData.availability,
              }}
              onChange={(field, val) => handleInputChange(field as any, val)}
              onToggleInterest={(interest) => toggleArrayItem('volunteeringInterests', interest)}
            />
          </div>
        )}

        {/* STEP 4: Documents & Verification */}
        {currentStep === 4 && (
          <div className="animate-in fade-in duration-200">
            <DocumentUploadForm
              data={{
                passportPhoto: formData.passportPhoto,
                identityDocType: formData.identityProofType,
                identityFrontDocName: formData.identityFrontDocName,
                identityBackDocName: formData.identityBackDocName,
                educationDocName: formData.educationDocName,
                addressDocName: formData.addressDocName,
                declarationAccepted: formData.termsAccepted,
              }}
              onFileUpload={handleFileUpload}
              onPhotoUpload={handlePhotoUpload}
              onDeclarationChange={(acc) => handleInputChange('termsAccepted', acc)}
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between gap-4">
          
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save Draft</span>
          </button>

          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-5 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Previous
              </button>
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs shadow-lg shadow-orange-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Application</span>
              </button>
            )}
          </div>

        </div>

      </form>

    </div>
  );
};
