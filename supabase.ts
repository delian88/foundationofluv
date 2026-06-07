import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || 'https://huzrbgrvcfeywllxloje.supabase.co';
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = (import.meta as any).env.VITE_SUPABASE_SERVICE_KEY || '';

// Public client for main site operations and auth
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client for CMS operations (admin panel only, behind auth gate)
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

export const SUPABASE_PROJECT_REF = 'huzrbgrvcfeywllxloje';
