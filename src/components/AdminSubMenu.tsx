import React from 'react';
import { ViewMode } from '../types';
import { LayoutDashboard, Users, CheckSquare, DollarSign, Award, ImageIcon, Briefcase, FileText, BarChart3, Clock, Settings, HelpCircle, Layout } from 'lucide-react';

interface AdminSubMenuProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

export const AdminSubMenu: React.FC<AdminSubMenuProps> = ({ currentView, onNavigate }) => {
  const menuItems = [
    { id: 'admin-dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Users', icon: Users },
    { id: 'admin-applications', label: 'Approvals', icon: CheckSquare },
    { id: 'admin-donations', label: 'Donations', icon: DollarSign },
    { id: 'admin-certificates', label: 'Certificates', icon: Award },
    { id: 'admin-doc-generator', label: 'ID Cards', icon: FileText },
    { id: 'admin-gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'admin-partners', label: 'Partners', icon: Briefcase },
    { id: 'admin-legal', label: 'Legal Docs', icon: FileText },
    { id: 'admin-reports', label: 'Reports', icon: BarChart3 },
    { id: 'admin-audit', label: 'Audit Logs', icon: Clock },
    { id: 'admin-settings', label: 'Settings', icon: Settings },
    { id: 'admin-help', label: 'Help Desk', icon: HelpCircle },
    { id: 'admin-cms', label: 'Website CMS', icon: Layout },
  ];

  const isAdminView = currentView.startsWith('admin-');
  if (!isAdminView) return null;

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 sticky top-16 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as ViewMode)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
