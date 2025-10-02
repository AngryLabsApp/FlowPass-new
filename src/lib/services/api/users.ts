import { fetchWithAuth } from '$lib/services/api/base';

const USERS_URL =  "https://n8n.angrylabs.app/webhook/0768a235-0d92-41e5-93f8-fcb566c57d40";
  

export async function getUsers(url: string, currentAbort: AbortController) {
  return fetchWithAuth(USERS_URL, {}, currentAbort);
}
