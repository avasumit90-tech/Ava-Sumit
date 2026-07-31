import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { FileSpreadsheet, Download, Filter, BarChart3, Printer } from 'lucide-react';

interface AdminReportsPageProps {
  onNavigate: (view: ViewMode) => void;
}

export const AdminReportsPage: React.FC<AdminReportsPageProps> = ({ onNavigate }) => {
  const [reportType, setReportType] = useState<'registration' | 'payment' | 'donation' | 'certificate' | 'district'>('registration');
  const [format, setFormat] = useState<'excel' | 'pdf' | 'csv'>('excel');

  const handleExport = () => {
    alert(`Exporting ${reportType.toUpperCase()} report in ${format.toUpperCase()} format successfully...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Analytics & Data
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Comprehensive Reports & Exports</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('admin-dashboard')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-6 lg:col-span-1">
          <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3">Report Parameters</h2>
          
          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Select Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value as any)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="registration">Registration Report (All Roles)</option>
                <option value="payment">Payment & Transaction Report</option>
                <option value="donation">Donation & 80G Report</option>
                <option value="certificate">Certificate Issuance Report</option>
                <option value="district">District-wise Performance Report</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {(['excel', 'pdf', 'csv'] as const).map(f => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFormat(f)}
                    className={`py-2.5 rounded-xl font-bold uppercase transition-colors cursor-pointer border ${
                      format === f
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExport}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl transition-colors cursor-pointer shadow-md flex items-center justify-center gap-2 mt-6"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Generate & Download Report</span>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-black text-slate-900 uppercase tracking-wider text-xs">Live Data Preview: {reportType} report</h2>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">Ready for Export</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-900">Total Records Found</p>
                <p className="text-[11px] text-slate-500">Filtered by current date range (2026)</p>
              </div>
              <span className="text-lg font-black text-blue-600">1,482 Entries</span>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-100 font-extrabold text-[10px] text-slate-600 uppercase tracking-wider">
                    <th className="p-3">ID</th>
                    <th className="p-3">Name / Entity</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  <tr>
                    <td className="p-3 font-mono font-bold">REC-901</td>
                    <td className="p-3 font-bold text-slate-900">Anita Deshmukh</td>
                    <td className="p-3">Astha Didi</td>
                    <td className="p-3 text-emerald-600 font-bold">Active</td>
                    <td className="p-3 text-slate-500">2026-07-30</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold">REC-902</td>
                    <td className="p-3 font-bold text-slate-900">Rajesh Sharma</td>
                    <td className="p-3">Donation</td>
                    <td className="p-3 text-emerald-600 font-bold">Success</td>
                    <td className="p-3 text-slate-500">2026-07-29</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-bold">REC-903</td>
                    <td className="p-3 font-bold text-slate-900">Pooja Verma</td>
                    <td className="p-3">Teacher</td>
                    <td className="p-3 text-amber-600 font-bold">Pending</td>
                    <td className="p-3 text-slate-500">2026-07-28</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
