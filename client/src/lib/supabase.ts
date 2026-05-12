import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// En développement, utiliser des valeurs par défaut pour éviter les erreurs
const isDev = import.meta.env.DEV;

if (!supabaseUrl || !supabaseAnonKey) {
  if (isDev) {
    console.warn(
      "⚠️ Supabase environment variables not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local"
    );
  } else {
    throw new Error("Missing Supabase environment variables");
  }
}

const finalUrl = supabaseUrl || "https://placeholder-project.supabase.co";
const finalKey = supabaseAnonKey || "placeholder-anon-key";

export const supabase = createClient(finalUrl, finalKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const getAuthUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
};

export const getAuthSession = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
