import React, { useState, useEffect, useCallback } from 'react';
import { ViewMode, RoleType, UserRecord, ProjectItem, ApplicationStatus, ActivityItem } from './types';
import { INITIAL_USERS, INITIAL_PROJECTS, INITIAL_APPLICATIONS, INITIAL_ACTIVITIES, ASSETS } from './data';
import * as api from './lib/api';
import { isSupabaseConfigured } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { AdminSubMenu } from './components/AdminSubMenu';
import { Footer } from './components/Footer';
import { CheckStatusModal } from './components/CheckStatusModal';
import { HomePage } from './components/views/HomePage';
import { JoinCommunityPage } from './components/views/JoinCommunityPage';
import { RegistrationFormPage } from './components/views/RegistrationFormPage';
import { DonatePage } from './components/views/DonatePage';
import { AdminDashboardPage } from './components/views/AdminDashboardPage';
import { AdminUserManagementPage } from './components/views/AdminUserManagementPage';
import { AdminDocGeneratorPage } from './components/views/AdminDocGeneratorPage';
import { AdminApplicationReviewPage } from './components/views/AdminApplicationReviewPage';
import { AdminApplicationsListPage } from './components/views/AdminApplicationsListPage';
import { AdminUserProfilePage } from './components/views/AdminUserProfilePage';
import { AdminDonationsPage } from './components/views/AdminDonationsPage';
import { AdminCertificatesPage } from './components/views/AdminCertificatesPage';
import { AdminGalleryPage } from './components/views/AdminGalleryPage';
import { AdminPartnersPage } from './components/views/AdminPartnersPage';
import { AdminLegalPage } from './components/views/AdminLegalPage';
import { AdminReportsPage } from './components/views/AdminReportsPage';
import { AdminAuditLogsPage } from './components/views/AdminAuditLogsPage';
import { AdminSettingsPage } from './components/views/AdminSettingsPage';
import { AdminHelpPage } from './components/views/AdminHelpPage';
import { AdminCMSPage } from './components/views/AdminCMSPage';
import { UserDashboardPage } from './components/views/UserDashboardPage';
import { UserCertificatesPage } from './components/views/UserCertificatesPage';
import { LoginPage } from './components/views/LoginPage';
import { SignUpPage } from './components/views/SignUpPage';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedRole, setSelectedRole] = useState<RoleType>('didi');
  const [isCheckStatusOpen, setIsCheckStatusOpen] = useState(false);

  // ── AUTH STATE (session) ──────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<{ email?: string } | null>(null);

  useEffect(() => {
    api.getSessionUser().then(setCurrentUser);
    const unsub = api.onAuthStateChange((u) => setCurrentUser(u));
    return unsub;
  }, []);

  // Application Data State
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [applications, setApplications] = useState<ApplicationStatus[]>(INITIAL_APPLICATIONS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [selectedUserForCardGen, setSelectedUserForCardGen] = useState<UserRecord | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserRecord | null>(null);

  // ── LIVE DATA LOAD (Supabase se, agar configured hai) ─────────────────────
  const [dataLoaded, setDataLoaded] = useState(false);
  const loadLiveData = useCallback(async () => {
    if (!isSupabaseConfigured) return;
    try {
      const [u, p, a, act] = await Promise.all([
        api.fetchUsers(),
        api.fetchProjects(),
        api.fetchApplications(),
        api.fetchActivities(),
      ]);
      setUsers(u.length ? u : INITIAL_USERS);
      setProjects(p.length ? p : INITIAL_PROJECTS);
      setApplications(a.length ? a : INITIAL_APPLICATIONS);
      setActivities(act.length ? act : INITIAL_ACTIVITIES);
    } catch (e) {
      console.error('[App] live data load failed:', e);
    }
  }, []);

  useEffect(() => {
    loadLiveData().finally(() => setDataLoaded(true));
  }, [loadLiveData]);

  // Navigation Handler
  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Role Selection Handler
  const handleSelectRole = (role: RoleType) => {
    setSelectedRole(role);
    setCurrentView('registration');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // New Application Submission Handler
  const handleAddApplication = (newApp: ApplicationStatus) => {
    // Live DB me save (agar configured hai)
    api.submitRegistration({
      role: (newApp.role.toLowerCase().includes('didi') ? 'didi'
        : newApp.role.toLowerCase().includes('maa') ? 'maa'
        : newApp.role.toLowerCase().includes('teacher') ? 'teacher'
        : newApp.role.toLowerCase().includes('coordinator') ? 'coordinator'
        : 'student'),
      fullName: newApp.applicantName,
      email: `${newApp.applicantName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    }).catch(err => console.error('[App] submitRegistration failed:', err));

    setApplications(prev => [newApp, ...prev]);

    // Also register in users list
    const newUser: UserRecord = {
      id: newApp.id,
      name: newApp.applicantName,
      email: `${newApp.applicantName.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      role: newApp.role,
      location: 'Maharashtra, MH',
      registrationDate: newApp.submittedDate,
      status: 'Pending',
      avatar: ASSETS.rahulIdPhoto
    };
    setUsers(prev => [newUser, ...prev]);

    // Add activity log
    const newAct: ActivityItem = {
      id: `ACT-${Date.now()}`,
      title: `${newApp.applicantName} registered for ${newApp.role}`,
      time: 'Just now',
      type: 'volunteer',
      icon: 'person_add'
    };
    setActivities(prev => [newAct, ...prev]);
    api.logActivity(newAct.title, 'volunteer', 'person_add');
  };

  // User Management Actions
  const handleUpdateUserStatus = (id: string, status: 'Active' | 'Pending' | 'Inactive') => {
    api.updateUserStatus(id, status);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: status === 'Active' ? 'Approved' : 'Under Review' } : a));
  };

  const handleDeleteUser = (id: string) => {
    api.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
    setApplications(prev => prev.filter(a => a.id !== id));
  };

  const handleAddProject = (newProj: ProjectItem) => {
    api.addProject(newProj);
    setProjects(prev => [newProj, ...prev]);
    const newAct: ActivityItem = {
      id: `ACT-${Date.now()}`,
      title: `Published new project: ${newProj.title}`,
      time: 'Just now',
      type: 'project',
      icon: 'folder_open'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  const handleAddUser = (newUser: UserRecord) => {
    setUsers(prev => [newUser, ...prev]);
    const newAct: ActivityItem = {
      id: `ACT-${Date.now()}`,
      title: `Added new member: ${newUser.name} (${newUser.role})`,
      time: 'Just now',
      type: 'volunteer',
      icon: 'person_add'
    };
    setActivities(prev => [newAct, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
        currentUser={currentUser}
        onLogout={async () => { await api.signOut(); setCurrentUser(null); }}
      />

      {/* Admin Submenu Navigation */}
      <AdminSubMenu
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {/* Main View Router Content */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            projects={projects}
          />
        )}

        {currentView === 'join-community' && (
          <JoinCommunityPage
            onSelectRole={handleSelectRole}
            onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'registration' && (
          <RegistrationFormPage
            selectedRole={selectedRole}
            onBackToRoles={() => handleNavigate('join-community')}
            onSubmitApplication={handleAddApplication}
          />
        )}

        {currentView === 'donate' && (
          <DonatePage />
        )}

        {currentView === 'admin-dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminDashboardPage
              onNavigate={handleNavigate}
              users={users}
              projects={projects}
              activities={activities}
              onAddProject={handleAddProject}
            />
          </div>
        )}

        {currentView === 'admin-users' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminUserManagementPage
              users={users}
              onUpdateUserStatus={handleUpdateUserStatus}
              onDeleteUser={handleDeleteUser}
              onAddUser={handleAddUser}
              onNavigate={handleNavigate}
              onSelectUserForCardGen={(user) => setSelectedUserForCardGen(user)}
              onSelectUserProfile={(user) => setSelectedUserProfile(user)}
            />
          </div>
        )}

        {currentView === 'admin-user-profile' && (
          <AdminUserProfilePage
            user={selectedUserProfile}
            onNavigate={handleNavigate}
            onSelectUserForCardGen={(user) => setSelectedUserForCardGen(user)}
          />
        )}

        {currentView === 'admin-doc-generator' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminDocGeneratorPage
              users={users}
              selectedUserOverride={selectedUserForCardGen}
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentView === 'admin-application-review' && (
          <AdminApplicationReviewPage
            onNavigate={handleNavigate}
            onApprove={(id) => handleUpdateUserStatus(id, 'Active')}
            onReject={(id) => handleUpdateUserStatus(id, 'Inactive')}
          />
        )}

        {currentView === 'admin-applications' && (
          <AdminApplicationsListPage
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin-donations' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminDonationsPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admin-certificates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminCertificatesPage onNavigate={handleNavigate} users={users} />
          </div>
        )}

        {currentView === 'admin-gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminGalleryPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admin-partners' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminPartnersPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admin-legal' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminLegalPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admin-reports' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminReportsPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admin-audit' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminAuditLogsPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admin-settings' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminSettingsPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admin-help' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminHelpPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'admin-cms' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <AdminCMSPage onNavigate={handleNavigate} />
          </div>
        )}

        {currentView === 'user-dashboard' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserDashboardPage
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentView === 'user-certificates' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <UserCertificatesPage
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {currentView === 'login' && (
          <LoginPage
            onNavigate={handleNavigate}
            onLogin={(email) => setCurrentUser({ email })}
            onSignUpClick={() => handleNavigate('signup')}
          />
        )}

        {currentView === 'signup' && (
          <SignUpPage
            onNavigate={handleNavigate}
            onSignUpDone={() => setCurrentUser(null)}
            onLoginClick={() => handleNavigate('login')}
          />
        )}
      </main>

      {/* Shared Check Application Status Modal */}
      <CheckStatusModal
        isOpen={isCheckStatusOpen}
        onClose={() => setIsCheckStatusOpen(false)}
        applicationsList={applications}
      />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

    </div>
  );
}

export default App;
