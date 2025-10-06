import { supabase } from '$lib/services/supabase/client';

export async function validateToken(code: string | null, access_token: string | null, refresh_token:string | null) {
    if (!supabase) throw new Error("Supabase no inicializado.");
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) throw error;
      return data.session;
    }

    if (access_token && refresh_token) {
      const { data, error } = await supabase.auth.setSession({ access_token, refresh_token });
      if (error) throw error;
      return data.session;
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (session) return session;

    throw new Error("El enlace no contiene credenciales válidas (code o access/refresh token). Solicita otro correo de recuperación.");
 

}

export async function  updateUserPassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
}