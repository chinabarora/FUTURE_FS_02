import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('[Supabase] Initializing client...');
console.log('[Supabase] URL:', supabaseUrl ? 'Set' : 'Missing');
console.log('[Supabase] Anon Key:', supabaseAnonKey ? 'Set' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined!,
  },
});

// Add auth state listener for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('[Supabase] Auth state changed:', event);
  console.log('[Supabase] Session:', session ? `User ID: ${session.user.id}` : 'null');
});
