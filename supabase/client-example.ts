/**
 * Supabase client + usage examples for the Astha Foundation app.
 *
 * HOW TO USE:
 *   1. Install the SDK:            npm install @supabase/supabase-js
 *   2. Copy this file to:          src/lib/supabase.ts
 *   3. Add to your .env:           SUPABASE_URL + SUPABASE_ANON_KEY
 *      (Settings → API in your Supabase project dashboard)
 *
 * NOTE: @supabase/supabase-js is NOT yet in package.json — install it first.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ============================================================================
 * EXAMPLE 1 — Registration form submit (PUBLIC, no login needed)
 * ----------------------------------------------------------------------------
 * ⚠️ Use plain .insert() — NOT .insert().select(). PostgreSQL rejects
 *    INSERT ... RETURNING when the row fails the SELECT policies, and the app
 *    already generates the member ID client-side anyway.
 * ==========================================================================*/
export async function submitRegistration(formData: any) {
  const { error } = await supabase.from('registrations').insert({
    member_id: `AST-${formData.role.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    applicant_name: formData.fullName,
    role: formData.role,
    email: formData.email,
    phone: formData.phone,
    gender: formData.gender,
    dob: formData.dob,
    address: formData.address,
    location: formData.address,
    status: 'Under Review',
    step_completed: 1,
    total_steps: 4,
    terms_accepted: formData.termsAccepted,
  });
  if (error) throw error;
}

/* ============================================================================
 * EXAMPLE 2 — Check application status (public view, PII-safe)
 * ==========================================================================*/
export async function checkApplicationStatus(memberId: string) {
  const { data, error } = await supabase
    .from('registration_status')
    .select('member_id, applicant_name, role, status, step_completed, total_steps, remarks, submitted_at')
    .eq('member_id', memberId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/* ============================================================================
 * EXAMPLE 3 — Auth signup (profile auto-created by DB trigger)
 * ==========================================================================*/
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  });
  if (error) throw error;
  return data;
}

/* ============================================================================
 * EXAMPLE 4 — Admin: all applications with review
 * ==========================================================================*/
export async function getApplicationsForAdmin() {
  const { data, error } = await supabase
    .from('registrations')
    .select('id, member_id, applicant_name, role, email, status, step_completed, total_steps, submitted_at')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function approveApplication(id: string, reviewerId: string) {
  const { error } = await supabase
    .from('registrations')
    .update({ status: 'Approved', reviewed_by: reviewerId, reviewed_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

/* ============================================================================
 * EXAMPLE 5 — Donations (donate + admin totals)
 * ==========================================================================*/
export async function recordDonation(donation: {
  donorName: string; email: string; amount: number; transactionId: string;
}) {
  const { error } = await supabase.from('donations').insert({
    donor_name: donation.donorName,
    email: donation.email,
    amount: donation.amount,
    transaction_id: donation.transactionId,
    status: 'Pending',
  });
  if (error) throw error;
}

export async function getDonationStats() {
  const { data } = await supabase
    .from('donations').select('amount, status').eq('status', 'Success');
  return (data ?? []).reduce((sum: number, d: any) => sum + Number(d.amount), 0);
}

/* ============================================================================
 * EXAMPLE 6 — Profile / member list
 * ==========================================================================*/
export async function getMembers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, member_id, full_name, email, phone, role, status, location, registration_date, avatar_url')
    .order('registration_date', { ascending: false });
  if (error) throw error;
  return data;
}

/* ============================================================================
 * EXAMPLE 7 — File upload (avatar / documents) via Storage
 * ==========================================================================*/
export async function uploadAvatar(userId: string, file: File) {
  const { error } = await supabase.storage
    .from('avatars')
    .upload(`public/${userId}.jpg`, file, { upsert: true });
  if (error) throw error;
  return supabase.storage.from('avatars').getPublicUrl(`public/${userId}.jpg`).data.publicUrl;
}

/* ============================================================================
 * EXAMPLE 8 — CMS + Settings (hero banner etc.)
 * ==========================================================================*/
export async function getHomeHero() {
  const { data, error } = await supabase
    .from('cms_content').select('value').eq('key', 'home_hero').maybeSingle();
  if (error) throw error;
  return data?.value;
}

export async function updateHomeHero(heroTitle: string, heroSubtitle: string) {
  const { error } = await supabase
    .from('cms_content')
    .update({ value: { heroTitle, heroSubtitle } })
    .eq('key', 'home_hero');
  if (error) throw error;
}

/* ============================================================================
 * EXAMPLE 9 — Audit log helper (call this from admin actions)
 * ==========================================================================*/
export async function logAudit(action: string, actor: { id: string; name: string; role: string }) {
  const { error } = await supabase.from('audit_logs').insert({
    actor_id: actor.id, actor_name: actor.name, actor_role: actor.role, action,
  });
  if (error) throw error;
}
