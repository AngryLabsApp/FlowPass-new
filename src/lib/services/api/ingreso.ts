import type { IngresoResponse } from "$lib/types/ingresoResponse";
import type { QueryParams } from "$lib/types/queryparams";
import type { User } from "$lib/types/user";
import { buildUrl } from "$lib/utils/utils";

import { fetchWithAuth } from "./base";
import { USER_UPDATE } from "./users";

const INGRESO_URL = "https://n8n.angrylabs.app/webhook/23c0319d-5248-4b38-8fe6-b72063c526df";

export async function ingresoByCode(
  queryParams: QueryParams
): Promise<IngresoResponse> {
  const url = buildUrl(INGRESO_URL, queryParams);
  const res = await fetchWithAuth(url, {});
  if (res?.ok) {
    let data = await res.json();
    return data;

  } else {
    throw new Error("❌ Error al registrar");
  }
}



export async function ingresoById(
  id: string, nuevasTomadas: number
): Promise<any> {
  const url = USER_UPDATE;
  const res = await fetchWithAuth(url, {
    method: "POST", body: JSON.stringify({
      id: id,
      type: "SINGLE",
      clases_tomadas: { value: nuevasTomadas },
      method: "MANUAL"
    })
  });
  console.log("rest", res);
  if (res?.ok) {
    let data = await res.json();
    return data;

  } else {
    throw new Error("Error al registrar ingreso");
  }
}
