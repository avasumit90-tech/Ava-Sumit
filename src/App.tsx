import React, { useState, useEffect } from 'react';
import { ViewMode, RoleType, UserRecord, ProjectItem, ApplicationStatus } from './types';
import { ASSETS } from './data';
import { useDatabase } from './hooks/useDatabase';
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

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedRole, setSelectedRole] = useState<RoleType>('didi');
  const [isCheckStatusOpen, setIsCheckStatusOpen] = useState(false);
  // Certificate ID extracted from a direct share link, e.g. /verify/AST-24-091
  const [initialVerifyCertId, setInitialVerifyCertId] = useState<string | null>(null);

  // On first load, detect a direct certificate verification link (/verify/<ID>)
  // and route the user straight to the Certificates page with the modal open.
  useEffect(() => {
    const path = window.location.pathname || '';
    const match = path.match(/^\/verify\/([A-Za-z0-9\-]+)\/?$/);
    if (match) {
      setInitialVerifyCertId(match[1]);
      setCurrentView('user-certificates');
    }
  }, []);
  
  // Custom Database Hook (Supabase + Local Fallback)
  const {
    users,
    projects,
    applications,
    activities,
    addUser,
    updateUserStatus,
    deleteUser,
    addProject,
    addApplication,
    addActivity
  } = useDatabase();

  const [selectedUserForCardGen, setSelectedUserForCardGen] = useState<UserRecord | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserRecord | null>(null);

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
    addApplication(newApp);
  };

  // User Management Actions
  const handleUpdateUserStatus = (id: string, status: 'Active' | 'Pending' | 'Inactive') => {
    updateUserStatus(id, status);
  };

  const handleDeleteUser = (id: string) => {
    deleteUser(id);
  };

  const handleAddProject = (newProj: ProjectItem) => {
    addProject(newProj);
    addActivity({
      id: `ACT-${Date.now()}`,
      title: `Published new project: ${newProj.title}`,
      time: 'Just now',
      type: 'project',
      icon: 'folder_open'
    });
  };

  const handleAddUser = (newUser: UserRecord) => {
    addUser(newUser);
    addActivity({
      id: `ACT-${Date.now()}`,
      title: `Added new member: ${newUser.name} (${newUser.role})`,
      time: 'Just now',
      type: 'volunteer',
      icon: 'person_add'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCheckStatus={() => setIsCheckStatusOpen(true)}
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
              initialVerifyCertId={initialVerifyCertId}
            />
          </div>
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
