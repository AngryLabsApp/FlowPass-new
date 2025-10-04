import { fetchWithAuth } from "$lib/services/api/base";
import type { getPagosResponse, getPagosTotalByMonthResponse } from "$lib/types/api";

import type { QueryParams } from "$lib/types/queryparams";

import { buildUrl, mapIfPartnerUser } from "$lib/utils/utils";

const PAGOS_URL = "https://n8n.angrylabs.app/webhook/bcfb0eb3-b085-4413-a1a3-358cdff22b43";


export async function getPagos(
  currentAbort: AbortController,
  queryParams: QueryParams
): Promise<getPagosResponse> {
  const url = buildUrl(PAGOS_URL, queryParams);
  const res = await fetchWithAuth(url, {}, currentAbort);
  if (res?.ok) {
    let data = await res.json();
    const { total, data: pagos } = data[0] || {};
    return { total, pagos };
  } else {
    throw new Error("❌ Error al cargar pagos");
  }
}


export async function getTotalByMonth(
  currentAbort: AbortController,
  queryParams: QueryParams
): Promise<getPagosTotalByMonthResponse> {
  const url = buildUrl(PAGOS_URL, queryParams);
  const res = await fetchWithAuth(url, {}, currentAbort);
  if (res?.ok) {
    let data = await res.json();
    console.log("response",data);
    const { total} = data[0] || {};
    return { total };
  } else {
    throw new Error("❌ Error al cargar pagos");
  }
}

