import { useState, useEffect, useCallback } from 'react';
import { UserRecord, ProjectItem, ApplicationStatus, ActivityItem } from '../types';
import { DonationSubmission, getAllDonations, saveDonationSubmission, updateDonationStatus as updateLocalDonationStatus, deleteDonation as deleteLocalDonation } from '../utils/donationStorage';
import { INITIAL_USERS, INITIAL_PROJECTS, INITIAL_APPLICATIONS, INITIAL_ACTIVITIES, ASSETS } from '../data';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export function useDatabase() {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [donations, setDonations] = useState<DonationSubmission[]>(getAllDonations());
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [applications, setApplications] = useState<ApplicationStatus[]>(INITIAL_APPLICATIONS);
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES);
  const [loading, setLoading] = useState<boolean>(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  // --- MAPPERS ---
  const mapDbUserToUserRecord = (row: any): UserRecord => ({
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    location: row.location || 'Maharashtra, MH',
    registrationDate: row.registration_date || row.created_at || new Date().toISOString().split('T')[0],
    status: row.status || 'Active',
    avatar: row.avatar || ASSETS.rahulIdPhoto,
    phone: row.phone,
    dob: row.dob,
    bloodGroup: row.blood_group,
    validUntil: row.valid_until,
    qualification: row.qualification,
    organization: row.organization,
    department: row.department,
    lastActive: row.last_active
  });

  const mapDbDonationToDonationSubmission = (row: any): DonationSubmission => ({
    id: row.id,
    donorName: row.donor_name,
    email: row.email,
    amount: Number(row.amount),
    transactionId: row.transaction_id,
    screenshotUrl: row.screenshot_url,
    paymentMethod: row.payment_method || 'upi',
    status: row.status || 'Pending (24 Hours)',
    date: row.date || row.created_at || new Date().toISOString(),
    reg80gNumber: row.reg_80g_number || 'AAATA5416F/80G/2026',
    receiptNumber: row.receipt_number || `AVA/REC/2026/${row.id}`,
    donorPan: row.donor_pan,
    donorPhone: row.donor_phone,
    remarks: row.remarks
  });

  const mapDbProjectToProjectItem = (row: any): ProjectItem => ({
    id: row.id,
    title: row.title,
    category: row.category,
    description: row.description,
    raised: Number(row.raised || 0),
    goal: Number(row.goal || 0),
    image: row.image,
    status: row.status || 'Active'
  });

  const mapDbAppToApplicationStatus = (row: any): ApplicationStatus => ({
    id: row.id,
    applicantName: row.full_name || row.applicantName,
    role: row.role,
    submittedDate: row.submitted_date || row.created_at || new Date().toISOString().split('T')[0],
    status: row.status || 'Under Review',
    stepCompleted: row.step_completed || 1,
    totalSteps: row.total_steps || 4,
    remarks: row.remarks
  });

  // --- FETCH OPERATIONS ---
  const fetchUsers = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setUsers(data.map(mapDbUserToUserRecord));
      }
    } catch (err: any) {
      console.warn('Supabase fetchUsers fallback to initial local state:', err.message);
    }
  }, []);

  const fetchDonations = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setDonations(getAllDonations());
      return;
    }
    try {
      const { data, error } = await supabase.from('donations').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setDonations(data.map(mapDbDonationToDonationSubmission));
      } else {
        setDonations(getAllDonations());
      }
    } catch (err: any) {
      console.warn('Supabase fetchDonations fallback to localStorage:', err.message);
      setDonations(getAllDonations());
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setProjects(data.map(mapDbProjectToProjectItem));
      }
    } catch (err: any) {
      console.warn('Supabase fetchProjects fallback:', err.message);
    }
  }, []);

  const fetchApplications = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    try {
      const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setApplications(data.map(mapDbAppToApplicationStatus));
      }
    } catch (err: any) {
      console.warn('Supabase fetchApplications fallback:', err.message);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchUsers(),
        fetchDonations(),
        fetchProjects(),
        fetchApplications()
      ]);
    } catch (err: any) {
      setError(err.message || 'Error syncing data with Supabase');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers, fetchDonations, fetchProjects, fetchApplications]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Listen for local donation updates
  useEffect(() => {
    const handleDonationsUpdated = () => {
      fetchDonations();
    };
    window.addEventListener('ava_donations_updated', handleDonationsUpdated);
    return () => window.removeEventListener('ava_donations_updated', handleDonationsUpdated);
  }, [fetchDonations]);

  // --- CRUD OPERATIONS: USERS ---
  const addUser = async (newUser: Partial<UserRecord>) => {
    const userObj: UserRecord = {
      id: newUser.id || `USR-${Date.now()}`,
      name: newUser.name || 'Anonymous User',
      email: newUser.email || 'user@example.com',
      role: newUser.role || 'didi',
      location: newUser.location || 'Maharashtra, MH',
      registrationDate: newUser.registrationDate || new Date().toISOString().split('T')[0],
      status: newUser.status || 'Active',
      avatar: newUser.avatar || ASSETS.rahulIdPhoto,
      phone: newUser.phone,
      qualification: newUser.qualification
    };

    setUsers(prev => [userObj, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').insert([{
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          role: userObj.role,
          location: userObj.location,
          registration_date: userObj.registrationDate,
          status: userObj.status,
          avatar: userObj.avatar,
          phone: userObj.phone,
          qualification: userObj.qualification
        }]);
      } catch (err) {
        console.error('Supabase addUser error:', err);
      }
    }
  };

  const updateUserStatus = async (id: string, status: 'Active' | 'Pending' | 'Inactive') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: status === 'Active' ? 'Approved' : 'Under Review' } : a));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').update({ status }).eq('id', id);
        await supabase.from('applications').update({ status: status === 'Active' ? 'Approved' : 'Under Review' }).eq('id', id);
      } catch (err) {
        console.error('Supabase updateUserStatus error:', err);
      }
    }
  };

  const deleteUser = async (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    setApplications(prev => prev.filter(a => a.id !== id));

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('users').delete().eq('id', id);
        await supabase.from('applications').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteUser error:', err);
      }
    }
  };

  // --- CRUD OPERATIONS: DONATIONS ---
  const addDonation = async (submission: Omit<DonationSubmission, 'id' | 'date' | 'receiptNumber' | 'reg80gNumber' | 'status'> & { status?: DonationSubmission['status'] }) => {
    const localSaved = saveDonationSubmission(submission);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('donations').insert([{
          id: localSaved.id,
          donor_name: localSaved.donorName,
          email: localSaved.email,
          amount: localSaved.amount,
          transaction_id: localSaved.transactionId,
          screenshot_url: localSaved.screenshotUrl,
          payment_method: localSaved.paymentMethod,
          status: localSaved.status,
          date: localSaved.date,
          reg_80g_number: localSaved.reg80gNumber,
          receipt_number: localSaved.receiptNumber,
          donor_pan: localSaved.donorPan,
          donor_phone: localSaved.donorPhone,
          remarks: localSaved.remarks
        }]);
      } catch (err) {
        console.error('Supabase addDonation error:', err);
      }
    }

    fetchDonations();
    return localSaved;
  };

  const updateDonationStatus = async (id: string, status: DonationSubmission['status'], remarks?: string) => {
    updateLocalDonationStatus(id, status, remarks);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('donations').update({ status, remarks }).eq('id', id);
      } catch (err) {
        console.error('Supabase updateDonationStatus error:', err);
      }
    }

    fetchDonations();
  };

  const deleteDonation = async (id: string) => {
    deleteLocalDonation(id);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('donations').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase deleteDonation error:', err);
      }
    }

    fetchDonations();
  };

  // --- CRUD OPERATIONS: PROJECTS ---
  const addProject = async (newProj: ProjectItem) => {
    setProjects(prev => [newProj, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').insert([{
          id: newProj.id,
          title: newProj.title,
          category: newProj.category,
          description: newProj.description,
          raised: newProj.raised,
          goal: newProj.goal,
          image: newProj.image,
          status: newProj.status
        }]);
      } catch (err) {
        console.error('Supabase addProject error:', err);
      }
    }
  };

  // --- CRUD OPERATIONS: APPLICATIONS ---
  const addApplication = async (newApp: ApplicationStatus) => {
    setApplications(prev => [newApp, ...prev]);

    // Also register in users
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
    addUser(newUser);

    // Activity item
    const newAct: ActivityItem = {
      id: `ACT-${Date.now()}`,
      title: `${newApp.applicantName} registered for ${newApp.role}`,
      time: 'Just now',
      type: 'volunteer',
      icon: 'person_add'
    };
    addActivity(newAct);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('applications').insert([{
          id: newApp.id,
          full_name: newApp.applicantName,
          role: newApp.role,
          submitted_date: newApp.submittedDate,
          status: newApp.status,
          step_completed: newApp.stepCompleted,
          total_steps: newApp.totalSteps,
          remarks: newApp.remarks,
          email: newUser.email,
          phone: '+91 98765 43210'
        }]);
      } catch (err) {
        console.error('Supabase addApplication error:', err);
      }
    }
  };

  // --- CRUD OPERATIONS: ACTIVITIES ---
  const addActivity = async (act: ActivityItem) => {
    setActivities(prev => [act, ...prev]);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('activity_logs').insert([{
          title: act.title,
          activity_time: act.time,
          type: act.type,
          icon: act.icon
        }]);
      } catch (err) {
        console.error('Supabase addActivity error:', err);
      }
    }
  };

  return {
    users,
    setUsers,
    donations,
    projects,
    setProjects,
    applications,
    setApplications,
    activities,
    setActivities,
    loading,
    error,
    isSupabase: isSupabaseConfigured,
    refreshAll,
    // CRUD User methods
    addUser,
    updateUserStatus,
    deleteUser,
    // CRUD Donation methods
    addDonation,
    updateDonationStatus,
    deleteDonation,
    // CRUD Project & Application methods
    addProject,
    addApplication,
    addActivity
  };
}

export default useDatabase;
