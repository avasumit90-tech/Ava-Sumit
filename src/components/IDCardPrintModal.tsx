import React from 'react';
import { UserRecord } from '../types';
import { ASSETS } from '../data';
import { X, Printer, MapPin, Phone, Mail, Award, Calendar } from 'lucide-react';

interface IDCardPrintModalProps {
  user: UserRecord;
  onClose: () => void;
}

export const IDCardPrintModal: React.FC<IDCardPrintModalProps> = ({ user, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print-container, .print-container * {
              visibility: visible;
            }
            .print-container {
              position: fixed;
              left: 0;
              top: 0;
              width: 100%;
              height: 100vh;
              z-index: 999999;
              margin: 0;
              padding: 20px;
              display: flex;
              justify-content: center;
              align-items: flex-start;
              background: white !important;
            }
            .no-print {
              display: none !important;
            }
            /* Make sure background colors and images print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>

      {/* Modal Overlay (Screen Only) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 no-print">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <div>
              <h2 className="text-lg font-bold text-slate-900">ID Card Preview</h2>
              <p className="text-xs text-slate-500 mt-0.5">Ready for printing</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preview Container */}
          <div className="p-8 bg-slate-100 flex items-center justify-center overflow-auto">
            {/* The ID Card */}
            <div className="print-container relative">
              <div className="w-[3.375in] h-[2.125in] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden relative flex flex-col" style={{ width: '324px', height: '204px' }}>
                {/* ID Card Header */}
                <div className="h-12 bg-blue-950 flex items-center px-4 gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-white p-1 flex items-center justify-center shrink-0">
                    <img src={ASSETS.LOGO} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-[13px] leading-tight tracking-wide">ASTHA FOUNDATION</h3>
                    <p className="text-blue-200 text-[8px] font-medium tracking-wider">OFFICIAL IDENTIFICATION</p>
                  </div>
                </div>

                {/* ID Card Body */}
                <div className="flex-1 p-3 flex gap-4">
                  {/* Photo */}
                  <div className="w-[72px] shrink-0 flex flex-col items-center">
                    <div className="w-[72px] h-[72px] bg-slate-100 border-2 border-slate-200 rounded-lg overflow-hidden shrink-0">
                      {user.avatar ? (
                        <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-bold text-2xl">
                          {user.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="mt-2 text-center w-full">
                      <p className="text-[7px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">ID Number</p>
                      <p className="text-[10px] font-mono font-bold text-slate-900 bg-slate-100 py-0.5 px-1 rounded">{user.id}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h4 className="text-[16px] font-black text-slate-900 leading-tight truncate">{user.name}</h4>
                      <p className="text-[11px] font-bold text-amber-600 mt-0.5 capitalize truncate">{user.role.replace('-', ' ')}</p>
                    </div>

                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] font-medium text-slate-700 truncate">{user.phone || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-[9px] font-medium text-slate-700 truncate">{user.location}</span>
                      </div>
                      {user.bloodGroup && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded bg-red-100 text-red-600 flex items-center justify-center font-bold text-[7px]">B</div>
                          <span className="text-[9px] font-medium text-slate-700">Blood Group: {user.bloodGroup}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Decorative Bottom Bar */}
                <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-600 w-full absolute bottom-0 left-0" />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-6 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print ID Card</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
