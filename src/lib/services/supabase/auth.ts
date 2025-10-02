import { supabase } from '$lib/services/supabase/client';
import { goto } from '$app/navigation';
import { PUBLIC_BD_URL, PUBLIC_BD_API } from '$env/static/public';
export const ADMIN_PATH = '/alumnos';  // cambia si quieres
export const LOGIN_PATH = '/login'; 
/** Si ya hay sesión, redirige al panel. */
export async function redirectIfSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) goto(ADMIN_PATH);
}

/** Login email/password. Lanza Error si falla. */
export async function loginWithEmail(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(
    error.message.includes('Invalid login') ? 'Credenciales inválidas.' : error.message
  );
  // confirmamos sesión por si acaso
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('No se pudo establecer la sesión.');
  goto(ADMIN_PATH);
}


/** Enviar email de reseteo de contraseña */
export async function sendResetPasswordEmail(email: string) {
  // Configura en Supabase Auth → URL Configuration el redirect
  const redirectTo = `${location.origin}/reset`; // crea tu página /reset si la usarás
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw new Error(error.message);
  return '📩 Si el correo existe, enviamos un enlace de restablecimiento.';
}


export function clearSupabaseStorage(url: string) {
  try {
    const projectRef = new URL(url).host.split('.')[0]; // ej: nujwzmwnptrsqojdjyjl
    const prefix = `sb-${projectRef}`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) localStorage.removeItem(k);
    }
  } catch {
    // silencioso
  }
}

type LogoutOpts = {
  /** 'local' (solo este dispositivo) o 'global' (revoca en todos). Por defecto 'local'. */
  scope?: 'local' | 'global';
  /** A dónde redirigir tras cerrar sesión. Por defecto '/login'. */
  redirectTo?: string;
};

/** Cerrar sesión con fallback de limpieza de storage y redirección. */
export async function logout(opts: LogoutOpts = {}) {
  const scope = opts.scope ?? 'local';
  const redirectTo = opts.redirectTo ?? LOGIN_PATH;

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      const { error } = await supabase.auth.signOut({ scope });
      // Algunos casos devuelven "Auth session missing!" si no está montada la sesión local
      if (error?.message?.includes('Auth session missing')) {
        clearSupabaseStorage(PUBLIC_BD_URL);
      }
    } else {
      // No había sesión: asegura limpiar residuos locales
      clearSupabaseStorage(PUBLIC_BD_URL);
    }
  } catch {
    // En cualquier error, limpia y continúa
    clearSupabaseStorage(PUBLIC_BD_URL);
  } finally {
    goto(redirectTo);
  }
}