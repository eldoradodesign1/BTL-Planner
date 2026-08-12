/**
 * Direction visuelle : Aquarelle de contrôle — la complexité d’infrastructure reste hors de
 * l’interface afin que les surfaces et interactions demeurent simples à comprendre.
 */
import { createClient } from "@supabase/supabase-js";

const publicProjectUrl = "https://qjqrwyikoiujwqqfaica.supabase.co";
const publicProjectKey = "sb_publishable_Dl1NiD7YhJyi5ExBYx2ZdA_fON7zrKp";
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? publicProjectUrl;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ?? publicProjectKey;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured ? createClient(supabaseUrl as string, supabaseAnonKey as string, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }) : null;
