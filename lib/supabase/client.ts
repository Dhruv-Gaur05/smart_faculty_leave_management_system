import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Checks if the current Supabase configuration in .env.local points to an actual
 * live Supabase project rather than placeholder strings.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('placeholder') &&
    !supabaseAnonKey.includes('placeholder') &&
    !supabaseAnonKey.includes('your-supabase-anon')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
