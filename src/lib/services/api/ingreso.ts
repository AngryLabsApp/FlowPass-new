import type { IngresoResponse } from "$lib/types/ingresoResponse";
import type { QueryParams } from "$lib/types/queryparams";
import { buildUrl } from "$lib/utils/utils";
import { fetchWithAuth } from "./base";

const INGRESO_URL ="https://n8n.angrylabs.app/webhook/23c0319d-5248-4b38-8fe6-b72063c526df";

export async function ingresoByCode(
  queryParams: QueryParams
): Promise<IngresoResponse> {
  const url = buildUrl(INGRESO_URL, queryParams);
  const res = await fetchWithAuth(url, {});
  console.log("rest",res);
  if (res?.ok) {
    let data = await res.json();
    return data;
    
  } else {
    throw new Error("❌ Error al registrar");
  }
}

