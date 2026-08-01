import React, { useState, useEffect } from 'react';
import * as api from '../../lib/api';
import { ViewMode } from '../../types';
import { Shield, Search, Clock, CheckCircle } from 'lucide-react';

interface AdminAuditLogsPageProps {
  onNavigate: (view: ViewMode) => void;
}

interface AuditLogRecord {
  id: string;
  user: string;
  role: string;
  action: string;
  timestamp: string;
  ipAddress: string;
}

export const AdminAuditLogsPage: React.FC<AdminAuditLogsPageProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<AuditLogRecord[]>([
    { id: 'LOG-01', user: 'Super Admin', role: 'SuperAdmin', action: 'Approved registration for Astha Didi #ASTHA-109', timestamp: '2026-07-31 13:10:22', ipAddress: '192.168.1.45' },
    { id: 'LOG-02', user: 'Admin Suresh', role: 'Admin', action: 'Generated ID Card for Teacher #ASTHA-204', timestamp: '2026-07-31 11:45:12', ipAddress: '192.168.1.88' },
    { id: 'LOG-03', user: 'System', role: 'Automated', action: 'Verified Razorpay donation transaction TXN983427182', timestamp: '2026-07-30 14:20:05', ipAddress: '10.0.0.1' },
    { id: 'LOG-04', user: 'Admin Priya', role: 'Admin', action: 'Uploaded new legal document: 80G Certificate 2026', timestamp: '2026-07-29 09:15:30', ipAddress: '192.168.1.12' },
  ]);

  // Live audit logs from Supabase (admin-only read) — fallback to demo list
  useEffect(() => {
    api.fetchAuditLogs().then((live) => {
      if (live && live.length > 0) setLogs(live as AuditLogRecord[]);
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Security & Compliance
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Clock className="w-6 h-6 text-slate-800" />
            <span>System Audit Logs</span>
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

      <div className="bg-white rounded-2xl shadow-xs border border-slate-100 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search user, action, IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Logged Events: <span className="font-bold text-slate-900">{logs.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 sm:px-6">Timestamp</th>
                <th className="p-4 sm:px-6">User / Actor</th>
                <th className="p-4 sm:px-6">Role</th>
                <th className="p-4 sm:px-6">Action Performed</th>
                <th className="p-4 sm:px-6">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {logs.filter(l => l.user.toLowerCase().includes(searchTerm.toLowerCase()) || l.action.toLowerCase().includes(searchTerm.toLowerCase())).map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 sm:px-6 font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                  <td className="p-4 sm:px-6 font-bold text-slate-900">{log.user}</td>
                  <td className="p-4 sm:px-6">
                    <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[10px]">
                      {log.role}
                    </span>
                  </td>
                  <td className="p-4 sm:px-6 font-medium text-slate-800">{log.action}</td>
                  <td className="p-4 sm:px-6 font-mono text-[11px] text-slate-400">{log.ipAddress}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
