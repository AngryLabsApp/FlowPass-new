import { fetchWithAuth } from "$lib/services/api/base";
import type { getUsersResponse } from "$lib/types/api";
import type { QueryParams } from "$lib/types/queryparams";
import type { User } from "$lib/types/user";
import { buildUrl, mapIfPartnerUser } from "$lib/utils/utils";

const USERS_URL =
  "https://n8n.angrylabs.app/webhook/0768a235-0d92-41e5-93f8-fcb566c57d40";
const USERS_FORM =
  "https://n8n.angrylabs.app/form/3858af95-5038-4d61-ba84-4ee767accee2";
export const USER_UPDATE = "https://n8n.angrylabs.app/webhook/e1b1b332-23b4-4a96-97a4-912ec7d73ffc";


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

export async function updateSingleField(
  id: string, fields: any
): Promise<any> {

  const payload = { ...fields, id, type: "SINGLE" };
  console.log("payload",payload);
  const res = await fetchWithAuth(USER_UPDATE, {
    method: "POST", body: JSON.stringify(payload)
  });
    console.log("data",res);
  if (res?.ok) {
    let data = await res.json();
      console.log("data",data);
    return data;

  } else {
    throw new Error("Error al registrar ingreso");
  }

}

export function newUserForm() {
  window.open(USERS_FORM, "_self");
}