import React, { useState } from 'react';
import { ViewMode } from '../../types';
import { HelpCircle, MessageSquare, CheckCircle, Send } from 'lucide-react';

interface AdminHelpPageProps {
  onNavigate: (view: ViewMode) => void;
}

interface TicketRecord {
  id: string;
  userName: string;
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  date: string;
}

export const AdminHelpPage: React.FC<AdminHelpPageProps> = ({ onNavigate }) => {
  const [tickets, setTickets] = useState<TicketRecord[]>([
    { id: 'TKT-101', userName: 'Sunita Sharma', subject: 'ID Card download error', message: 'I am unable to download my ID card after approval.', status: 'Open', date: '2026-07-30' },
    { id: 'TKT-102', userName: 'Amit Kumar', subject: 'Payment confirmation pending', message: 'Paid via Razorpay but status shows pending.', status: 'Resolved', date: '2026-07-28' },
  ]);

  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const handleResolve = (id: string) => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-100">
        <div>
          <span className="bg-amber-100 text-amber-900 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Support Desk
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-amber-600" />
            <span>Help & Support Inbox</span>
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

      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket.id} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-xs text-blue-600">{ticket.id}</span>
                <h3 className="text-sm font-black text-slate-900 mt-0.5">{ticket.subject}</h3>
                <p className="text-[11px] text-slate-400">From: <span className="font-bold text-slate-700">{ticket.userName}</span> • {ticket.date}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
              }`}>
                {ticket.status}
              </span>
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {ticket.message}
            </p>

            {ticket.status === 'Open' && (
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="text"
                  placeholder="Type reply to user..."
                  value={replyText[ticket.id] || ''}
                  onChange={(e) => setReplyText({ ...replyText, [ticket.id]: e.target.value })}
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
                <button
                  onClick={() => {
                    alert(`Reply sent to ${ticket.userName}!`);
                    handleResolve(ticket.id);
                  }}
                  className="bg-slate-900 text-white px-4 py-2.5 rounded-xl font-black text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5 text-amber-400" />
                  <span>Send & Resolve</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
