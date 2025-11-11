import type { Plan } from '$lib/types/planes';
import { fetchWithAuth } from './base';

import { PUBLIC_API_URL} from '$env/static/public';

const PUBLIC_PLANES_URL = PUBLIC_API_URL+"/planes";
type Reviver = (this: any, key: string, value: any) => any;
type Replacer = (this: any, key: string, value: any) => any;
const keyData = 'plans:data';
const keyEtag = 'plans:etag';
const keyTs = 'plans:ts';

type Cached = {
  data: any;
  etag: string;
  ts: number;
} | null;

type GetPlanesOpts = {
  force?: boolean;
  maxAgeMs?: number;
};

export function getCachedPlanes(
): Plan[] {


  const cached = getCached({ keyData, keyEtag, keyTs });
  return cached?.data;
}

export async function getPlanes(
  { force = false, maxAgeMs = 60 * 60 * 1000 }: GetPlanesOpts = {}
): Promise<Plan[]> {
  const cached = getCached({ keyData, keyEtag, keyTs });
  const headers: Record<string, string> = {};
  if (cached?.etag) headers['If-None-Match'] = cached.etag;

  // Cache-first si está fresco y no forzaste
  if (!force && isFresh(cached, maxAgeMs)) {
    // Revalidación en segundo plano (opcional)
    const res = (await fetchWithAuth(PUBLIC_PLANES_URL, { headers })) as Response;
    if (res.status === 200) {
      const data: any = await res.json();
      const planes = data.planes;
      const etag = data.etag as string | undefined;
      setCached({ keyData, keyEtag, keyTs, planes, etag });
    }
    return cached?.data;
  }

  // Descarga/revalida
  const res = (await fetchWithAuth(PUBLIC_PLANES_URL, { headers })) as Response;
  if (res.status === 304 && cached) return cached.data;
  if (!res.ok) {
    if (cached) return cached.data as Plan[];
    throw new Error(`Fetch plans failed: ${res.status}`);
  }

  const data: any = await res.json();
  const planes = data.planes;
  const etag = data.etag as string | undefined;
  setCached({ keyData, keyEtag, keyTs, data: planes, etag });
  return data.planes as Plan[];
}

function getCached({
  storage = localStorage,
  keyData,
  keyEtag,
  keyTs,
  reviver,
}: {
  storage?: Storage;
  keyData: string;
  keyEtag: string;
  keyTs: string;
  reviver?: Reviver;
}): Cached {
  try {
    const raw = storage.getItem(keyData);
    if (!raw) return null;
    return {
      data: JSON.parse(raw, reviver),
      etag: storage.getItem(keyEtag) || '',
      ts: Number(storage.getItem(keyTs) || 0),
    };
  } catch {
    return null;
  }
}

function setCached({
  storage = localStorage,
  keyData,
  keyEtag,
  keyTs,
  data,
  etag,
  replacer,
  // compat: también acepto 'planes' porque en tu código llamas setCached({ planes, etag })
  planes,
}: {
  storage?: Storage;
  keyData: string;
  keyEtag: string;
  keyTs: string;
  data?: any;
  etag?: string;
  replacer?: Replacer;
  planes?: any; // compat
}): void {
  const payload = data ?? planes; // compat
  storage.setItem(keyData, JSON.stringify(payload, replacer));
  if (etag) storage.setItem(keyEtag, etag);
  storage.setItem(keyTs, String(Date.now()));
}

function deleteCached({
  storage = localStorage,
  keyData,
  keyEtag,
  keyTs
}: {
  storage?: Storage;
  keyData: string;
  keyEtag: string;
  keyTs: string;
}): void {
  try {
    storage.removeItem(keyData);
    storage.removeItem(keyEtag);
    storage.removeItem(keyTs);
  } catch {
    // opcional: evitar romper si no existe localStorage (SSR)
  }
}

function isFresh(cached: Cached, maxAgeMs: number): boolean {
  if (!cached) return false;
  return Date.now() - (cached.ts || 0) < maxAgeMs;
}


export async function getPlanesWithOutCache(): Promise<Plan[]> {
  const headers: Record<string, string> = {};
  const res = (await fetchWithAuth(PUBLIC_PLANES_URL, { headers })) as Response;
  const data: any = await res.json();
  return data.planes as Plan[];
}


export async function updateOrCreatePlan(
  plan: Plan
): Promise<any> {
  const payload = { ...plan};
  const method = plan.id ? "PUT" : "POST";
  const res = await fetchWithAuth(PUBLIC_PLANES_URL, {
    method, body: JSON.stringify(payload)
  });
  if (res?.ok) {
    let data = await res.json();
    deleteCached({ keyData, keyEtag, keyTs});

    return data;

  } else {
    throw new Error("Error al actualizar");
  }

}