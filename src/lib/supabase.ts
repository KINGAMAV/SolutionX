import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env as any).VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = (import.meta.env as any).VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!(import.meta.env as any).VITE_SUPABASE_URL || !(import.meta.env as any).VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ CitéConnect Warning: Missing Supabase credentials VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. App is running in Local Offline/Demo mode.');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});