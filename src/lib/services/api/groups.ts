import type { Group } from "$lib/types/group";
import { fetchWithAuth } from "./base";
import { PUBLIC_API_URL } from '$env/static/public';

const PUBLIC_GROUPS_URL = PUBLIC_API_URL + "/groups";

export async function getGroups(): Promise<Group[]> {
    try {
        const headers: Record<string, string> = {};
        const res = (await fetchWithAuth(PUBLIC_GROUPS_URL, { headers })) as Response;
        const data: any = await res.json();
        return data?.data as Group[] || [];
    } catch (error) {
        throw error;
    }
}

export async function createUpdateGroup(group: Group): Promise<any> {
    try {
        const payload = { ...group };
        const method = group.id ? "PUT" : "POST";
        const res = await fetchWithAuth(PUBLIC_GROUPS_URL, {
            method, body: JSON.stringify(payload)
        });
        if (res?.ok) {
            let data = await res.json();
            return data?.group;

        } else {
            throw new Error("Error al actualizar");
        }

    } catch (error) {
        throw error;
    }
}

export async function deleteGroup(
  group_id: string
): Promise<any> {
  const url = PUBLIC_GROUPS_URL + "/" + group_id;
  const method = "DELETE"
  const res = await fetchWithAuth(url, {
    method, body: JSON.stringify({})
  });
  if (res?.ok) {
    let data = await res.json();
    return data;

  } else {
    throw new Error("Error al elimina");
  }
}