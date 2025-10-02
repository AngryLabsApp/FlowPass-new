import { ensureSessionOrRedirect } from '$lib/services/supabase/session';

export async function fetchWithAuth(url: string, opts: RequestInit = {}, ctrl?: AbortController) {
  const session = await ensureSessionOrRedirect();
  if (!session) return;

  const headers = new Headers(opts.headers);
  headers.set('authorization', `Bearer ${session.access_token}`);
  if (!headers.has('content-type')) headers.set('content-type', 'application/json');
  if (!headers.has('accept')) headers.set('accept', 'application/json');

  return fetch(url, { ...opts, signal: ctrl?.signal, headers });
}
