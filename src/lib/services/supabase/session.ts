import { supabase } from '$lib/services/supabase/client';
import { goto } from '$app/navigation';
import { writable, type Writable } from 'svelte/store';
import { browser } from '$app/environment';

export const sessionStore: Writable<any> = writable(null);

let initialized = false;

/** Llama esto una sola vez (por ejemplo en el layout del app, onMount). */
export function initAuthListener() {
  console.log("INIT AUTH LISTENER", initialized);
  if (!browser || initialized) return;
  initialized = true;

  supabase.auth.onAuthStateChange((event, session) => {
    // console.log('auth event', event)
    if (event === 'TOKEN_REFRESHED') sessionStore.set(session);
    if (event === 'SIGNED_OUT') {
      sessionStore.set(null);
      goto('/login');
    }
    if (event === 'SIGNED_IN') sessionStore.set(session);
  });
}

/** Asegura sesión; si no, redirige. No registra listeners. */
export async function ensureSessionOrRedirect() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) {
    goto('/login');
    return null;
  }
  sessionStore.set(session);
  return session;
}
