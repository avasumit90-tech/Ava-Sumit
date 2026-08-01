/**
 * ASTHA FOUNDATION — DATA LAYER (Supabase + Mock fallback)
 * ---------------------------------------------------------
 * App ke saare data operations yahan hote hain.
 *
 * - Supabase configured hai → live database use hota hai
 * - Nahin configured → mock data (src/data.ts) fallback, app demo mode me
 *
 * Har function try/catch + fallback ke saath hai taaki UI kabhi crash na ho.
 */

import { supabase, isSupabaseConfigured } from './supabase';
import type { UserRecord, ProjectItem, ApplicationStatus, ActivityItem, RoleType } from '../types';
import { INITIAL_USERS, INITIAL_PROJECTS, INITIAL_APPLICATIONS, INITIAL_ACTIVITIES } from '../data';

/* ============================================================
 * MAPPERS  (DB snake_case → app camelCase)
 * ============================================================ */
function mapProfile(p: any): UserRecord {
  return {
    id: p.member_id ?? p.id,
    name: p.full_name ?? '',
    email: p.email ?? '',
    role: p.role ?? 'student',
    location: p.location ?? '',
    registrationDate: p.registration_date ? new Date(p.registration_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    status: p.status ?? 'Pending',
    avatar: p.avatar_url ?? undefined,
    phone: p.phone ?? undefined,
    dob: p.dob ?? undefined,
    bloodGroup: p.blood_group ?? undefined,
    validUntil: p.valid_until ?? undefined,
    qualification: p.qualification ?? undefined,
    organization: p.organization ?? undefined,
    department: p.department ?? undefined,
    lastActive: p.last_active_at ? new Date(p.last_active_at).toLocaleString('en-IN') : undefined,
  };
}

function mapProject(p: any): ProjectItem {
  return {
    id: p.id,
    title: p.title ?? '',
    category: p.category ?? 'Education',
    description: p.description ?? '',
    raised: Number(p.raised ?? 0),
    goal: Number(p.goal ?? 0),
    image: p.image_url ?? '',
    status: p.status ?? 'Active',
  };
}

function mapRegistration(r: any): ApplicationStatus {
  return {
    id: r.member_id ?? r.id,
    applicantName: r.applicant_name ?? '',
    role: r.role ?? '',
    submittedDate: r.submitted_at ? new Date(r.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
    status: r.status ?? 'Under Review',
    stepCompleted: r.step_completed ?? 1,
    totalSteps: r.total_steps ?? 4,
    remarks: r.remarks ?? undefined,
  };
}

function mapActivity(a: any): ActivityItem {
  return {
    id: a.id,
    title: a.title ?? '',
    time: a.occurred_at ? new Date(a.occurred_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '',
    type: a.activity_type ?? 'volunteer',
    icon: a.icon ?? 'person_add',
  };
}

/* ============================================================
 * USERS / PROFILES
 * ============================================================ */
export async function fetchUsers(): Promise<UserRecord[]> {
  if (!isSupabaseConfigured || !supabase) return INITIAL_USERS;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('registration_date', { ascending: false });
    if (error) { console.error('[api] fetchUsers:', error.message); return INITIAL_USERS; }
    return (data ?? []).map(mapProfile);
  } catch (e) {
    console.error('[api] fetchUsers:', e);
    return INITIAL_USERS;
  }
}

export async function updateUserStatus(id: string, status: 'Active' | 'Pending' | 'Inactive') {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('profiles').update({ status }).eq('member_id', id);
    if (error) console.error('[api] updateUserStatus:', error.message);
  } catch (e) { console.error('[api] updateUserStatus:', e); }
}

export async function deleteUser(id: string) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('profiles').delete().eq('member_id', id);
    if (error) console.error('[api] deleteUser:', error.message);
  } catch (e) { console.error('[api] deleteUser:', e); }
}

export async function addUser(user: UserRecord) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('profiles').insert({
      member_id: user.id,
      full_name: user.name,
      email: user.email,
      phone: user.phone ?? null,
      role: (user.role || 'student').toLowerCase().includes('admin') ? 'admin'
        : ((user.role || '').toLowerCase().includes('didi') ? 'didi'
        : (user.role || '').toLowerCase().includes('maa') ? 'maa'
        : (user.role || '').toLowerCase().includes('teacher') ? 'teacher'
        : (user.role || '').toLowerCase().includes('coordinator') ? 'coordinator'
        : 'student'),
      status: user.status,
      location: user.location,
      avatar_url: user.avatar ?? null,
      organization: user.organization ?? null,
      department: user.department ?? null,
      qualification: user.qualification ?? null,
      registration_date: new Date().toISOString(),
    });
    if (error) console.error('[api] addUser:', error.message);
  } catch (e) { console.error('[api] addUser:', e); }
}

/* ============================================================
 * PROJECTS
 * ============================================================ */
export async function fetchProjects(): Promise<ProjectItem[]> {
  if (!isSupabaseConfigured || !supabase) return INITIAL_PROJECTS;
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) { console.error('[api] fetchProjects:', error.message); return INITIAL_PROJECTS; }
    return (data ?? []).map(mapProject);
  } catch (e) { console.error('[api] fetchProjects:', e); return INITIAL_PROJECTS; }
}

export async function addProject(project: ProjectItem) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('projects').insert({
      title: project.title,
      category: project.category,
      description: project.description,
      raised: project.raised ?? 0,
      goal: project.goal ?? 0,
      image_url: project.image ?? '',
      status: project.status ?? 'Active',
    });
    if (error) console.error('[api] addProject:', error.message);
  } catch (e) { console.error('[api] addProject:', e); }
}

/* ============================================================
 * REGISTRATIONS / APPLICATIONS
 * ============================================================ */
export async function fetchApplications(): Promise<ApplicationStatus[]> {
  if (!isSupabaseConfigured || !supabase) return INITIAL_APPLICATIONS;
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('submitted_at', { ascending: false });
    if (error) { console.error('[api] fetchApplications:', error.message); return INITIAL_APPLICATIONS; }
    return (data ?? []).map(mapRegistration);
  } catch (e) { console.error('[api] fetchApplications:', e); return INITIAL_APPLICATIONS; }
}

export async function submitRegistration(form: {
  role: RoleType;
  fullName: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  termsAccepted?: boolean;
}) {
  if (!isSupabaseConfigured || !supabase) {
    // Demo mode: ek mock application bana do taaki UI flow dikhe
    const newId = `AST-${form.role.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      id: newId,
      applicantName: form.fullName || 'Anonymous Applicant',
      role: form.role,
      submittedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Under Review' as const,
      stepCompleted: 4,
      totalSteps: 4,
      remarks: 'Application submitted successfully. Background verification pending.',
    };
  }
  try {
    const newId = `AST-${form.role.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const { error } = await supabase.from('registrations').insert({
      member_id: newId,
      applicant_name: form.fullName || 'Anonymous Applicant',
      role: form.role,
      email: form.email,
      phone: form.phone ?? null,
      dob: form.dob ?? null,
      gender: form.gender ?? null,
      address: form.address ?? null,
      status: 'Under Review',
      step_completed: 1,
      total_steps: 4,
      terms_accepted: form.termsAccepted ?? false,
    });
    if (error) { console.error('[api] submitRegistration:', error.message); throw error; }
    return {
      id: newId,
      applicantName: form.fullName || 'Anonymous Applicant',
      role: form.role,
      submittedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Under Review' as const,
      stepCompleted: 1,
      totalSteps: 4,
      remarks: 'Application submitted successfully. Background verification pending.',
    };
  } catch (e) { console.error('[api] submitRegistration:', e); throw e; }
}

export async function checkApplicationStatus(memberId: string): Promise<ApplicationStatus | null> {
  if (!isSupabaseConfigured || !supabase) {
    const found = INITIAL_APPLICATIONS.find(a => a.id.toLowerCase() === memberId.toLowerCase().trim());
    return found ?? null;
  }
  try {
    const { data, error } = await supabase
      .from('registration_status')
      .select('member_id, applicant_name, role, status, step_completed, total_steps, remarks')
      .eq('member_id', memberId)
      .maybeSingle();
    if (error) { console.error('[api] checkApplicationStatus:', error.message); return null; }
    if (!data) return null;
    return mapRegistration(data);
  } catch (e) { console.error('[api] checkApplicationStatus:', e); return null; }
}

/* ============================================================
 * ACTIVITIES
 * ============================================================ */
export async function fetchActivities(): Promise<ActivityItem[]> {
  if (!isSupabaseConfigured || !supabase) return INITIAL_ACTIVITIES;
  try {
    const { data, error } = await supabase.from('activities').select('*').order('occurred_at', { ascending: false }).limit(10);
    if (error) { console.error('[api] fetchActivities:', error.message); return INITIAL_ACTIVITIES; }
    return (data ?? []).map(mapActivity);
  } catch (e) { console.error('[api] fetchActivities:', e); return INITIAL_ACTIVITIES; }
}

export async function logActivity(title: string, type: ActivityItem['type'] = 'volunteer', icon = 'person_add') {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('activities').insert({ title, activity_type: type, icon });
    if (error) console.error('[api] logActivity:', error.message);
  } catch (e) { console.error('[api] logActivity:', e); }
}

/* ============================================================
 * AUTH (Supabase Auth — admin login)
 * ============================================================ */
export async function signIn(email: string, password: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: new Error('Supabase configured nahi hai — VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY set karo.') };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error };
    return { data };
  } catch (e) {
    return { error: e as Error };
  }
}

export async function signUp(email: string, password: string, fullName: string) {
  if (!isSupabaseConfigured || !supabase) {
    return { error: new Error('Supabase configured nahi hai — VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY set karo.') };
  }
  try {
    // Trigger (handle_new_user) profile auto-create kar deta hai
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) return { error };
    return { data };
  } catch (e) {
    return { error: e as Error };
  }
}

export async function signOut() {
  if (!isSupabaseConfigured || !supabase) return;
  try { await supabase.auth.signOut(); } catch (e) { console.error('[api] signOut:', e); }
}

export async function getSessionUser(): Promise<{ email?: string } | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user ?? null;
  } catch (e) { console.error('[api] getSessionUser:', e); return null; }
}

export function onAuthStateChange(cb: (user: { email?: string } | null) => void) {
  if (!isSupabaseConfigured || !supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ?? null);
  });
  return () => data.subscription.unsubscribe();
}

/* ============================================================
 * DONATIONS
 * ============================================================ */
export async function submitDonation(d: { donorName: string; email: string; amount: number }) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('donations').insert({
      donor_name: d.donorName,
      email: d.email,
      amount: d.amount,
      status: 'Pending',
    });
    if (error) console.error('[api] submitDonation:', error.message);
  } catch (e) { console.error('[api] submitDonation:', e); }
}

export async function fetchDonations(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase.from('donations').select('*').order('donated_at', { ascending: false });
    if (error) { console.error('[api] fetchDonations:', error.message); return []; }
    return (data ?? []).map((d: any) => ({
      id: d.id,
      donorName: d.donor_name,
      email: d.email,
      amount: Number(d.amount),
      transactionId: d.transaction_id,
      status: d.status,
      date: d.donated_at ? new Date(d.donated_at).toLocaleString('en-IN') : '',
      reg80gNumber: d.reg_80g_number,
      receiptNumber: d.receipt_number,
    }));
  } catch (e) { console.error('[api] fetchDonations:', e); return []; }
}

/* ============================================================
 * CERTIFICATES
 * ============================================================ */
export async function fetchCertificates(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase.from('certificates').select('*').order('issue_date', { ascending: false });
    if (error) { console.error('[api] fetchCertificates:', error.message); return []; }
    return (data ?? []).map((c: any) => ({
      id: c.id,
      recipientName: c.recipient_name,
      type: c.certificate_type,
      certificateNumber: c.certificate_number,
      issueDate: c.issue_date,
      qrCode: c.qr_code,
    }));
  } catch (e) { console.error('[api] fetchCertificates:', e); return []; }
}

export async function addCertificate(c: { recipientName: string; type: string; certificateNumber: string; issueDate: string; qrCode?: string }) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('certificates').insert({
      recipient_name: c.recipientName,
      certificate_type: c.type,
      certificate_number: c.certificateNumber,
      issue_date: c.issueDate,
      qr_code: c.qrCode ?? null,
    });
    if (error) console.error('[api] addCertificate:', error.message);
  } catch (e) { console.error('[api] addCertificate:', e); }
}

/* ============================================================
 * GALLERY
 * ============================================================ */
export async function fetchGalleryItems(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase.from('gallery_items').select('*').order('item_date', { ascending: false });
    if (error) { console.error('[api] fetchGalleryItems:', error.message); return []; }
    return (data ?? []).map((g: any) => ({
      id: g.id,
      title: g.title,
      category: g.category,
      image: g.image_url,
      date: g.item_date,
    }));
  } catch (e) { console.error('[api] fetchGalleryItems:', e); return []; }
}

export async function addGalleryItem(item: { title: string; category: string; imageUrl: string }) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('gallery_items').insert({
      title: item.title,
      category: item.category,
      image_url: item.imageUrl,
      item_date: new Date().toISOString().split('T')[0],
    });
    if (error) console.error('[api] addGalleryItem:', error.message);
  } catch (e) { console.error('[api] addGalleryItem:', e); }
}

/* ============================================================
 * PARTNERS
 * ============================================================ */
export async function fetchPartners(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase.from('partners').select('*').order('display_order', { ascending: true });
    if (error) { console.error('[api] fetchPartners:', error.message); return []; }
    return (data ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      logoUrl: p.logo_url,
      website: p.website,
      displayOrder: p.display_order,
      status: p.status,
    }));
  } catch (e) { console.error('[api] fetchPartners:', e); return []; }
}

export async function addPartner(p: { name: string; logoUrl: string; website: string; displayOrder: number }) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('partners').insert({
      name: p.name,
      logo_url: p.logoUrl,
      website: p.website,
      display_order: p.displayOrder,
      status: 'Active',
    });
    if (error) console.error('[api] addPartner:', error.message);
  } catch (e) { console.error('[api] addPartner:', e); }
}

/* ============================================================
 * LEGAL DOCUMENTS
 * ============================================================ */
export async function fetchLegalDocuments(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase.from('legal_documents').select('*').order('upload_date', { ascending: false });
    if (error) { console.error('[api] fetchLegalDocuments:', error.message); return []; }
    return (data ?? []).map((l: any) => ({
      id: l.id,
      title: l.title,
      category: l.category,
      fileSize: l.file_size_bytes ? `${(l.file_size_bytes / 1048576).toFixed(1)} MB` : '—',
      uploadDate: l.upload_date,
    }));
  } catch (e) { console.error('[api] fetchLegalDocuments:', e); return []; }
}

export async function addLegalDocument(d: { title: string; category: string }) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('legal_documents').insert({
      title: d.title,
      category: d.category,
      upload_date: new Date().toISOString().split('T')[0],
    });
    if (error) console.error('[api] addLegalDocument:', error.message);
  } catch (e) { console.error('[api] addLegalDocument:', e); }
}

/* ============================================================
 * AUDIT LOGS
 * ============================================================ */
export async function fetchAuditLogs(): Promise<any[]> {
  if (!isSupabaseConfigured || !supabase) return [];
  try {
    const { data, error } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(50);
    if (error) { console.error('[api] fetchAuditLogs:', error.message); return []; }
    return (data ?? []).map((l: any) => ({
      id: l.id,
      user: l.actor_name,
      role: l.actor_role,
      action: l.action,
      timestamp: l.created_at ? new Date(l.created_at).toLocaleString('en-IN') : '',
      ipAddress: l.ip_address,
    }));
  } catch (e) { console.error('[api] fetchAuditLogs:', e); return []; }
}

/* ============================================================
 * CMS CONTENT
 * ============================================================ */
export async function fetchCmsContent(): Promise<{ heroTitle: string; heroSubtitle: string }> {
  const fallback = {
    heroTitle: 'Empowering Rural Women & Transforming Grassroots Communities',
    heroSubtitle: 'Join Astha Foundation as an Astha Didi, Astha Maa, or Teacher. Together we build self-reliance and education across India.',
  };
  if (!isSupabaseConfigured || !supabase) return fallback;
  try {
    const { data, error } = await supabase.from('cms_content').select('value').eq('key', 'home_hero').maybeSingle();
    if (error || !data) return fallback;
    return {
      heroTitle: data.value?.heroTitle ?? fallback.heroTitle,
      heroSubtitle: data.value?.heroSubtitle ?? fallback.heroSubtitle,
    };
  } catch (e) { console.error('[api] fetchCmsContent:', e); return fallback; }
}

export async function saveCmsContent(content: { heroTitle: string; heroSubtitle: string }) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const { error } = await supabase.from('cms_content').upsert(
      { key: 'home_hero', value: content },
      { onConflict: 'key' }
    );
    if (error) console.error('[api] saveCmsContent:', error.message);
  } catch (e) { console.error('[api] saveCmsContent:', e); }
}

/* ============================================================
 * SETTINGS
 * ============================================================ */
export async function fetchSettings(): Promise<any> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data, error } = await supabase.from('settings').select('key, value');
    if (error) { console.error('[api] fetchSettings:', error.message); return null; }
    const map: Record<string, any> = {};
    (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
    return map;
  } catch (e) { console.error('[api] fetchSettings:', e); return null; }
}

export async function saveSettings(map: Record<string, any>) {
  if (!isSupabaseConfigured || !supabase) return;
  try {
    const rows = Object.entries(map).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' });
    if (error) console.error('[api] saveSettings:', error.message);
  } catch (e) { console.error('[api] saveSettings:', e); }
}
