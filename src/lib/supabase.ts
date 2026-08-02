import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper to test Supabase connection
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  if (!supabase) {
    return {
      success: false,
      message: 'Supabase credentials missing. Add VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY to .env'
    };
  }

  try {
    const { data, error } = await supabase.from('donations').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return {
      success: true,
      message: `Successfully connected to Supabase! Donations count query executed.`
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Failed to connect to Supabase.'
    };
  }
}
