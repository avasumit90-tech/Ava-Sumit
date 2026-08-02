import React from 'react';
import { X, CheckCircle2, FileText, User } from 'lucide-react';
import { RegistrationFormData } from '../types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  data: RegistrationFormData;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, onSubmit, data }) => {
  if (!isOpen) return null;

  const DetailRow = ({ label, value }: { label: string, value: string | undefined | null }) => (
    value ? (
      <div className="py-2 border-b border-slate-100 flex flex-col sm:flex-row sm:justify-between gap-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-bold text-slate-900 text-left sm:text-right">{value}</span>
      </div>
    ) : null
  );

  const DocumentRow = ({ label, docName }: { label: string, docName: string | undefined | null }) => (
    docName ? (
      <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
        <FileText className="w-4 h-4 text-blue-900" />
        <span className="text-[11px] font-bold text-slate-800">{label}:</span>
        <span className="text-[11px] text-slate-600 truncate">{docName}</span>
      </div>
    ) : null
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Review Application</h2>
            <p className="text-xs text-slate-500 mt-0.5">Please review your details before submitting</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="w-16 h-16 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center shrink-0">
              {data.passportPhoto ? (
                <img src={data.passportPhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{data.fullName}</h3>
              <p className="text-xs text-blue-900 font-medium capitalize mt-0.5">{data.role.replace('-', ' ')} Registration</p>
            </div>
          </div>

          {/* Details Grid */}
          {data.role === 'student' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">Student Details</h4>
                <DetailRow label="Father Name" value={data.fatherHusbandName} />
                <DetailRow label="Mother Name" value={data.motherName} />
                <DetailRow label="Village" value={data.village} />
                <DetailRow label="Post Office" value={data.postOffice} />
                <DetailRow label="Block" value={data.blockName} />
                <DetailRow label="District" value={data.districtName} />
                <DetailRow label="State" value={data.state} />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">School & Contact Details</h4>
                <DetailRow label="Mother Phone Number" value={data.motherPhoneNumber} />
                <DetailRow label="Guardian Email" value={data.guardianEmail} />
                <DetailRow label="School Name" value={data.schoolName} />
                <DetailRow label="Class" value={data.studentClass} />
                <DetailRow label="Aadhar Number" value={data.aadharNumber} />
                <DetailRow label="Centre Address" value={data.centreAddress} />
                <DetailRow label="Teacher Name" value={data.teacherName} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
              {/* Column 1: Personal Details */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">Personal Details</h4>
                <DetailRow label="Father/Husband Name" value={data.fatherHusbandName} />
                <DetailRow label="Date of Birth" value={data.dob} />
                <DetailRow label="Gender" value={data.gender} />
                <DetailRow label="Phone" value={data.phone} />
                <DetailRow label="Email" value={data.email} />
                <DetailRow label="Residential Address" value={data.address} />
                <DetailRow label="Communication Address" value={data.communicationAddress} />
                <DetailRow label="District Name" value={data.districtName} />
                <DetailRow label="Block Name" value={data.blockName} />
              </div>

              {/* Column 2: Education & Experience */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">Education & Experience</h4>
                <DetailRow label="Qualification" value={data.qualification} />
                <DetailRow label="Field of Study" value={data.fieldOfStudy} />
                <DetailRow label="Institution" value={data.institution} />
                <DetailRow label="Experience (Years)" value={data.experienceYears} />
                <DetailRow label="Computer Experience" value={data.computerExperience} />
                <DetailRow label="Skills" value={data.skills?.join(', ')} />
                <DetailRow label="Languages" value={data.languages?.join(', ')} />
              </div>
              
              {/* Column 3: Additional Details (Full Width) */}
              <div className="sm:col-span-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">Additional Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  <div>
                    <DetailRow label="Emergency Contact" value={data.emergencyContact} />
                    <DetailRow label="Reference Name" value={data.referenceName} />
                  </div>
                  <div>
                    <DetailRow label="Account Details" value={data.accountDetails} />
                    <DetailRow label="Identity Proof Type" value={data.identityProofType} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Uploaded Documents */}
          <div>
             <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 pb-1 border-b border-slate-100">Uploaded Documents</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
               <DocumentRow label="ID (Front)" docName={data.identityFrontDocName} />
               <DocumentRow label="ID (Back)" docName={data.identityBackDocName} />
               <DocumentRow label="Education" docName={data.educationDocName} />
               <DocumentRow label="Address" docName={data.addressDocName} />
             </div>
             {(!data.identityFrontDocName && !data.identityBackDocName && !data.educationDocName && !data.addressDocName) && (
               <p className="text-xs text-slate-500 italic">No documents uploaded.</p>
             )}
          </div>
          
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex justify-between items-center">
          <button 
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors"
          >
            Edit Details
          </button>
          <button 
            type="button"
            onClick={onSubmit}
            className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-extrabold shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm & Submit</span>
          </button>
        </div>
      </div>
    </div>
  );
};
