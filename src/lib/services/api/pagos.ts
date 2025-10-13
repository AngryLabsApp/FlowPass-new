import { fetchWithAuth } from "$lib/services/api/base";
import type { getPagosResponse, getPagosTotalByMonthResponse } from "$lib/types/api";
import type { QueryParams } from "$lib/types/queryparams";
import { buildUrl } from "$lib/utils/utils";
import { PUBLIC_PAGOS_URL, PUBLIC_FORM_PAGOS_URL} from '$env/static/public';


export async function getPagos(
  currentAbort: AbortController,
  queryParams: QueryParams
): Promise<getPagosResponse> {
  const url = buildUrl(PUBLIC_PAGOS_URL, queryParams);
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
  const url = buildUrl(PUBLIC_PAGOS_URL, queryParams);
  const res = await fetchWithAuth(url, {}, currentAbort);
  if (res?.ok) {
    let data = await res.json();
    const { total} = data[0] || {};
    return { total };
  } else {
    throw new Error("❌ Error al cargar pagos");
  }
}

export function descargarPagos(){
    window.open(PUBLIC_FORM_PAGOS_URL, "_other");
}