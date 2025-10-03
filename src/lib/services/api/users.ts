import { fetchWithAuth } from "$lib/services/api/base";
import type { getUsersResponse } from "$lib/types/api";
import type { QueryParams } from "$lib/types/queryparams";
import type { User } from "$lib/types/user";
import { buildUrl, mapIfPartnerUser } from "$lib/utils/utils";

const USERS_URL =
  "https://n8n.angrylabs.app/webhook/0768a235-0d92-41e5-93f8-fcb566c57d40";
const USERS_FORM =
  "https://n8n.angrylabs.app/form/3858af95-5038-4d61-ba84-4ee767accee2";

export async function getUsers(
  currentAbort: AbortController,
  queryParams: QueryParams
): Promise<getUsersResponse> {
  const url = buildUrl(USERS_URL, queryParams);
  const res = await fetchWithAuth(url, {}, currentAbort);
  if (res?.ok) {
    let data = await res.json();
    const { total, data: _users } = data[0] || {};
    let users: User[] = mapIfPartnerUser(_users || []);

    return { total, users };
  } else {
    throw new Error("❌ Error al cargar usuarios");
  }
}

export function newUserForm(){
    window.open(USERS_FORM, "_self");
}