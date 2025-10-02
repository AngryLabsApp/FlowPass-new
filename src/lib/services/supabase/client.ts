import { createClient } from '@supabase/supabase-js';
import { PUBLIC_BD_URL, PUBLIC_BD_API } from '$env/static/public';

export const supabase = createClient(PUBLIC_BD_URL, PUBLIC_BD_API, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});
