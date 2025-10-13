import type { Plan } from '$lib/types/planes';
import { fetchWithAuth } from './base';

import { PUBLIC_PLANES_URL} from '$env/static/public';


type Reviver = (this: any, key: string, value: any) => any;
type Replacer = (this: any, key: string, value: any) => any;

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
  const keyData = 'plans:data';
  const keyEtag = 'plans:etag';
  const keyTs = 'plans:ts';

  const cached = getCached({ keyData, keyEtag, keyTs });
  return cached?.data;
}

export async function getPlanes(
  { force = false, maxAgeMs = 60 * 60 * 1000 }: GetPlanesOpts = {}
): Promise<Plan[]> {
  const keyData = 'plans:data';
  const keyEtag = 'plans:etag';
  const keyTs = 'plans:ts';

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

function isFresh(cached: Cached, maxAgeMs: number): boolean {
  if (!cached) return false;
  return Date.now() - (cached.ts || 0) < maxAgeMs;
}
