import { createClient } from '@supabase/supabase-js';

export function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      `Missing Supabase environment variables. ` +
      `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'set' : 'MISSING'}, ` +
      `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'set' : 'MISSING'}`
    );
  }

  // Validate URL format to prevent private IP issues
  if (!supabaseUrl.startsWith('https://')) {
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Must start with https://`);
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}
