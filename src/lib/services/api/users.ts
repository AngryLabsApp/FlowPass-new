import { fetchWithAuth } from "$lib/services/api/base";
import type {
  getUsersBirthdayResponse,
  getUsersResponse,
} from "$lib/types/api";
import type { QueryParams } from "$lib/types/queryparams";
import type { User } from "$lib/types/user";
import type { UserBirthday } from "$lib/types/userBirthday";
import { buildUrl, mapIfPartnerUser } from "$lib/utils/utils";
import {
  PUBLIC_API_URL,
  PUBLIC_USER_UPDATE,
  PUBLIC_USERS_FORM,
  PUBLIC_DELETE_USER_URL,
} from "$env/static/public";

const PUBLIC_USERS_URL = PUBLIC_API_URL + "/members";
export async function getUsers(
  currentAbort: AbortController,
  queryParams: QueryParams
): Promise<getUsersResponse> {
  const url = buildUrl(PUBLIC_USERS_URL, queryParams);
  const res = await fetchWithAuth(url, {}, currentAbort);
  if (res?.ok) {
    let data = await res.json();

    data = data.data ? data : data[0];
    const { total, data: _users } = data || {};
    let users: User[] = mapIfPartnerUser(_users || []);

    return { total, users };
  } else {
    throw new Error("❌ Error al cargar usuarios");
  }
}

export async function updateUser(
  member: Partial<User>
): Promise<any> {
  const url = buildUrl(PUBLIC_USERS_URL, {});
  const res = await fetchWithAuth(url, {
    method: "PUT",
    body: JSON.stringify(member),
  });
  if (res?.ok) {
    let data = await res.json();
    return data;

  } else {
    throw new Error("❌ Error al cargar usuarios");
  }
}

export async function getUsersByBirthDay(
  currentAbort: AbortController,
  queryParams: QueryParams
): Promise<getUsersBirthdayResponse> {
  const url = buildUrl(PUBLIC_USERS_URL + "/birthday", queryParams);
  const res = await fetchWithAuth(url, {}, currentAbort);
  if (res?.ok) {
    let data = await res.json();

    data = data.data ? data : data[0];
    const { total, data: _users } = data || {};
    let users: UserBirthday[] = _users || [];

    return { total, users };
  } else {
    throw new Error("Error al cargar cumpleaños");
  }
}

export async function updateSingleField(id: string, fields: any): Promise<any> {
  const payload = { ...fields, id, type: "SINGLE" };
  const res = await fetchWithAuth(PUBLIC_USER_UPDATE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (res?.ok) {
    let data = await res.json();
    return data;
  } else {
    throw new Error("Error al actualizar");
  }
}

export async function updateUserPlan(id: string, fields: any): Promise<any> {
  const payload = { ...fields, id };
  const res = await fetchWithAuth(PUBLIC_USER_UPDATE, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  if (res?.ok) {
    let data = await res.json();
    return data;
  } else {
    throw new Error("Error al actualizar");
  }
}

export function newUserForm() {
  window.open(PUBLIC_USERS_FORM, "_self");
}

export async function deleteUser(id: string): Promise<any> {
  const payload = { id };
  const res: any = await fetchWithAuth(PUBLIC_DELETE_USER_URL, {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
  let data = await res.json();
  if (!data.response) throw new Error(`Error al eliminar`);
  return data;
}
