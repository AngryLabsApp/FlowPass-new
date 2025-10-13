import type { IngresoResponse } from "$lib/types/ingresoResponse";
import type { QueryParams } from "$lib/types/queryparams";
import { buildUrl } from "$lib/utils/utils";

import { fetchWithAuth } from "./base";

import { PUBLIC_USER_UPDATE, PUBLIC_INGRESO_URL} from '$env/static/public';


export async function ingresoByCode(
  queryParams: QueryParams
): Promise<IngresoResponse> {
  const url = buildUrl(PUBLIC_INGRESO_URL, queryParams);
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
  const url = PUBLIC_USER_UPDATE;
  const res = await fetchWithAuth(url, {
    method: "POST", body: JSON.stringify({
      id: id,
      type: "SINGLE",
      clases_tomadas: { value: nuevasTomadas },
      method: "MANUAL"
    })
  });
  if (res?.ok) {
    let data = await res.json();
    return data;

  } else {
    throw new Error("Error al registrar ingreso");
  }
}
