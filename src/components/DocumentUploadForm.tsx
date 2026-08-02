import React from 'react';
import { ArrowLeft, Send, Upload, Check, Badge, School, ShieldCheck, Camera, FileText, UserPlus, CheckCircle2 } from 'lucide-react';

export interface DocumentUploadFormData {
  passportPhoto?: string | null;
  identityDocType?: string;
  identityFrontDocName?: string | null;
  identityBackDocName?: string | null;
  educationDocName?: string | null;
  addressDocName?: string | null;
  declarationAccepted?: boolean;
}

interface DocumentUploadFormProps {
  data: DocumentUploadFormData;
  onFileUpload: (fieldName: string, event: React.ChangeEvent<HTMLInputElement>) => void;
  onPhotoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeclarationChange: (accepted: boolean) => void;
  onBack?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
}

export const DocumentUploadForm: React.FC<DocumentUploadFormProps> = ({
  data,
  onFileUpload,
  onPhotoUpload,
  onDeclarationChange,
  onBack,
  onSubmit,
  isSubmitting = false,
}) => {
  return (
    <div className="max-w-[800px] w-full mx-auto space-y-6">
      {/* Form Content Card */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(26,35,126,0.05)] border border-slate-200/80 p-6 sm:p-8 md:p-10 flex flex-col gap-6 relative overflow-hidden">
        {/* Header Description */}
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-1">Document Upload & Review</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please provide clear copies of the following documents to verify your identity and qualifications. Accepted formats: PDF, JPG, PNG (Max 5MB each).
          </p>
        </div>

        {/* Profile Photo Section */}
        <div className="border border-slate-200 rounded-xl p-6 bg-slate-50/50">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden shrink-0 relative">
              {data.passportPhoto ? (
                <img src={data.passportPhoto} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-slate-400">
                  <UserPlus className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>

            <div className="grow text-center sm:text-left space-y-2">
              <h4 className="text-xs font-bold text-slate-900">Profile Photo</h4>
              <p className="text-[11px] text-slate-500">
                A recent, clear headshot on a plain background for your volunteer ID badge.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 border border-blue-950 text-blue-950 hover:bg-blue-950 hover:text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                <Upload className="w-4 h-4" />
                <span>{data.passportPhoto ? 'Change Profile Photo' : 'Choose File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ID Document Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Aadhar / National ID (Front) */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-900 rounded-xl p-5 transition-colors group bg-white flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-950 group-hover:bg-blue-950 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Aadhar / National ID (Front)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Upload front side proof</p>
              {data.identityFrontDocName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {data.identityFrontDocName}
                </span>
              )}
            </div>
            <label className="mt-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
              <span>{data.identityFrontDocName ? 'Replace Front Side' : 'Upload Front Side'}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onFileUpload('identityFrontDocName', e)}
                className="hidden"
              />
            </label>
          </div>

          {/* Aadhar / National ID (Back) */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-900 rounded-xl p-5 transition-colors group bg-white flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-950 group-hover:bg-blue-950 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Aadhar / National ID (Back)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Upload back side proof</p>
              {data.identityBackDocName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {data.identityBackDocName}
                </span>
              )}
            </div>
            <label className="mt-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
              <span>{data.identityBackDocName ? 'Replace Back Side' : 'Upload Back Side'}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onFileUpload('identityBackDocName', e)}
                className="hidden"
              />
            </label>
          </div>

          {/* Education Certificate */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-900 rounded-xl p-5 transition-colors group bg-white flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-950 group-hover:bg-blue-950 group-hover:text-white transition-colors">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Highest Education Certificate</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Degree or Marks Sheet</p>
              {data.educationDocName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {data.educationDocName}
                </span>
              )}
            </div>
            <label className="mt-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
              <span>{data.educationDocName ? 'Replace Certificate' : 'Click to Upload Marks Sheet'}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onFileUpload('educationDocName', e)}
                className="hidden"
              />
            </label>
          </div>

          {/* Address Proof */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-900 rounded-xl p-5 transition-colors group bg-white flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-950 group-hover:bg-blue-950 group-hover:text-white transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Address Proof</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Utility Bill, Passport, etc.</p>
              {data.addressDocName && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {data.addressDocName}
                </span>
              )}
            </div>
            <label className="mt-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg cursor-pointer transition-colors">
              <span>{data.addressDocName ? 'Replace Document' : 'Click to Upload Address Proof'}</span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => onFileUpload('addressDocName', e)}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <hr className="border-slate-100 my-1" />

        {/* Declaration Box */}
        <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-200/80 flex items-start gap-3">
          <input
            type="checkbox"
            id="declaration"
            checked={!!data.declarationAccepted}
            onChange={(e) => onDeclarationChange(e.target.checked)}
            className="mt-1 rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer shrink-0"
          />
          <label htmlFor="declaration" className="text-xs text-slate-800 leading-relaxed cursor-pointer font-medium">
            I hereby declare that the information provided in this application is true, complete, and correct to the best of my knowledge. I understand that any false information may result in the rejection of my application.
          </label>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-between items-center pt-2">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 border border-blue-950 text-blue-950 rounded-lg font-bold text-xs hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : <div />}

        {onSubmit && (
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting || !data.declarationAccepted}
            className={`px-8 py-2.5 rounded-lg font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              !data.declarationAccepted || isSubmitting
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-blue-950 hover:bg-blue-900 text-white'
            }`}
          >
            <span>{isSubmitting ? 'Submitting Application...' : 'Submit Application'}</span>
            <Send className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
