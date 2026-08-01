/**
 * Supabase client for the Astha Foundation app.
 *
 * Env vars (Vite):
 *   VITE_SUPABASE_URL       — https://YOUR-REF.supabase.co
 *   VITE_SUPABASE_ANON_KEY  — anon public key (safe for frontend)
 *
 * Graceful mode: agar env vars set nahi hain, to client "disabled" rehta hai
 * aur app mock data (demo mode) par chalta hai — deploy hone par bhi crash
 * nahi hoga, bas live data tab dikhega jab env set karenge.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured: boolean = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

if (!isSupabaseConfigured) {
  console.warn('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY set nahi hai — app DEMO MODE (mock data) me chal rahi hai.');
}
