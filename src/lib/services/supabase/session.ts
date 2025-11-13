import { supabase } from '$lib/services/supabase/client';
import { goto } from '$app/navigation';
import { get, writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';
import { clearSupabaseStorage } from '$lib/services/supabase/auth';
import { PUBLIC_BD_URL } from '$env/static/public';
import type { ROLES } from '$lib/enums/Roles';
export const sessionStore: Writable<any> = writable(null);
export const userRoles = writable<string[]>([]);

let initialized = false;

/** Llama esto una sola vez (por ejemplo en el layout del app, onMount). */
export function initAuthListener() {
  if (!browser || initialized) return;
  initialized = true;

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'TOKEN_REFRESHED') sessionStore.set(session);
    if (event === 'SIGNED_OUT') {
      userRoles.set([]);
      sessionStore.set(null);
      goto('/logout');
    }
    if (event === 'SIGNED_IN') sessionStore.set(session);
    if (session?.user) {
      const roles: string[] = session?.user?.app_metadata?.roles || [];
      console.log("ROLES",roles);
      userRoles.set(roles);
      if (roles.length <= 0) {
        goto('/logout');
      }

    }
  });
}


export function hasRole(role: ROLES): boolean {
  const roles = get(userRoles);
  return roles.includes(role);
}

/** Asegura sesión; si no, redirige. No registra listeners. */
export async function ensureSessionOrRedirect() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    goto('/logout');
    return null;
  }
  sessionStore.set(session);
  return session;
}


export async function closeSessionIfExists() {
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error?.message === 'Auth session missing!') {
        clearSupabaseStorage(PUBLIC_BD_URL);
      }
    } else {
      clearSupabaseStorage(PUBLIC_BD_URL);
    }
  } catch {
    clearSupabaseStorage(PUBLIC_BD_URL);
  }
}