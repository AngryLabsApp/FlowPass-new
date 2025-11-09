import type { GetIngresosResponse, IngresoResponse, IngresosHistory } from "$lib/types/ingresoResponse";
import type { QueryParams } from "$lib/types/queryparams";
import { buildUrl } from "$lib/utils/utils";

import { fetchWithAuth } from "./base";

import { PUBLIC_API_URL, PUBLIC_USER_UPDATE, PUBLIC_INGRESO_URL, PUBLIC_GET_INGRESOS_URL, PUBLIC_UPDATE_INGRESO_URL } from '$env/static/public';


const PUBLIC_INGRESOS_API_URL = PUBLIC_API_URL + "/ingresos";



export async function updateOrCreateIngreso(
  ingreso: IngresosHistory
): Promise<any> {
  const payload = { ...ingreso };
  const method = ingreso.id ? "PUT" : "POST";
  const res = await fetchWithAuth(PUBLIC_INGRESOS_API_URL, {
    method, body: JSON.stringify(payload)
  });
  if (res?.ok) {
    let data = await res.json();
    return data;

  } else {
    throw new Error("Error al actualizar");
  }
}

export async function deleteIngreso(
  ingreso_id: string
): Promise<any> {
  const url = buildUrl(PUBLIC_INGRESOS_API_URL + "/" + ingreso_id, {});
  const method = "DELETE"
  const res = await fetchWithAuth(url, {
    method, body: JSON.stringify({})
  });
  if (res?.ok) {
    let data = await res.json();
    return data;

  } else {
    throw new Error("Error al actualizar");
  }
}

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

export async function updateIngresoById(
  id: string, date: Date
): Promise<any> {
  const url = PUBLIC_UPDATE_INGRESO_URL;
  const res = await fetchWithAuth(url, {
    method: "POST", body: JSON.stringify({
      id: id,
      date: date,
    })
  });
  console.log("RES UPDATE INGRESO", res);
  if (res?.ok) {
    let data = await res.json();
    console.log("data UPDATE INGRESO", data);
    return data;

  } else {
    throw new Error("Error al registrar ingreso");
  }

}


export async function getIngresos(
  currentAbort: AbortController,
  queryParams: QueryParams
): Promise<GetIngresosResponse> {
  const url = buildUrl(PUBLIC_GET_INGRESOS_URL, queryParams);
  const res = await fetchWithAuth(url, {}, currentAbort);
  if (res?.ok) {
    let data = await res.json();
    const { total, data: _ingresos } = data[0] || {};
    let ingresos: IngresosHistory[] = _ingresos || [];

    return { total, ingresos };
  } else {
    throw new Error("❌ Error al cargar usuarios");
  }
}