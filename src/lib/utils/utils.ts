import type { Column } from "$lib/types/column";
import type { DashboardFilters } from "$lib/types/dashboardFilters";
import type { Plan } from "$lib/types/planes";
import type { QueryParams } from "$lib/types/queryparams";
import type { User } from "$lib/types/user";

export function fmtDate(value: string) {
  if (!value) return "-";
  const raw = String(value).trim();

  // Si viene en dd/mm/yyyy o dd-mm-yyyy, normaliza a dd-mm-yyyy
  const dmy = raw.match(/^([0-3]?\d)[\/-]([0-1]?\d)[\/-](\d{4})$/);
  if (dmy) {
    const d = dmy[1].padStart(2, "0");
    const m = dmy[2].padStart(2, "0");
    const y = dmy[3];
    return `${d}-${m}-${y}`;
  }

  // Si viene como yyyy-mm-dd (fecha pura), evita offsets de zona
  const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (ymd) {
    const y = ymd[1];
    const m = ymd[2];
    const d = ymd[3];
    return `${d}-${m}-${y}`;
  }

  // Intento genérico con Date (ISO u otros); si no se puede, devuelve el raw
  const dt = new Date(raw);
  if (isNaN(dt.getTime())) return raw;
  const d = String(dt.getDate()).padStart(2, "0");
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const y = String(dt.getFullYear());
  return `${d}-${m}-${y}`;
}

export function toTitleCase(str: string) {
  return str.toLowerCase().replace(/(?:^|\s)\p{L}/gu, (c) => c.toUpperCase());
}

export function statusPillClasses(value: unknown) {
  const v = String(value ?? "").toLowerCase();
  if (["activo", "pagado"].includes(v))
    return "bg-emerald-100 text-emerald-800 border border-emerald-200";
  if (["inactivo"].includes(v))
    return "bg-red-100 text-red-800 border border-red-200";
  return "bg-gray-100 text-gray-800 border border-gray-200";
}

export function getValue(row: User, col: Column<User>) {
  const raw = col.accessor ? col.accessor(row) : col.key ? row[col.key] : "";
  if (col.type === "date") return fmtDate(raw as string);
  if (col.type === "title") return toTitleCase(raw as string);
  return raw ?? "";
}

export function mapIfPartnerUser(users: User[]): User[] {
  let final_users: User[] = [];
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let final_user: User = { ...user };
    if (
      final_user?.is_plan_partner &&
      !final_user?.is_plan_principal &&
      final_user.partner_id
    ) {
      final_user.clases_tomadas = final_user.partner_clases_tomadas || 0;
      final_user.limite_clases = final_user.partner_limite_clases || 0;
      final_user.estado_pago =
        final_user.partner_estado_pago || final_user.estado_pago;
      final_user.estado = final_user.partner_estado || final_user.estado;
      final_user.dias_de_gracia = final_user.partner_dias_de_gracia || 0;
      final_user.monto = final_user.partner_monto || 0;
      final_user.fecha_inicio_plan = final_user.partner_fecha_inicio_plan || "";
      final_user.proxima_fecha_pago =
        final_user.partner_proxima_fecha_pago || "";
    }
    final_users.push(final_user);
  }

  return final_users;
}

export function formatMemberSince(value: string) {
  const formatted = formatDateLongSpanish(value);
  return formatted ? `Miembro desde: ${formatted}` : "Miembro desde: —";
}

function formatDateLongSpanish(value: string) {
  const date = parseFlexibleDate(value);
  if (!date) return null;

  try {
    return new Intl.DateTimeFormat("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  } catch (_) {
    return null;
  }
}

function parseFlexibleDate(value: string) {
  if (!value) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  const ymd = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) {
    const [, y, m, d] = ymd;
    const year = Number(y);
    const month = Number(m) - 1;
    const day = Number(d);
    const dt = new Date(year, month, day);
    if (!isNaN(dt)) return dt;
  }

  const dmy = raw.match(/^([0-3]?\d)[\/-]([0-1]?\d)[\/-](\d{4})$/);
  if (dmy) {
    const [, d, m, y] = dmy;
    const day = Number(d);
    const month = Number(m) - 1;
    const year = Number(y);
    const dt = new Date(year, month, day);
    if (!isNaN(dt)) return dt;
  }

  const timestamp = Date.parse(raw);
  if (!Number.isNaN(timestamp)) {
    const dt = new Date(timestamp);
    if (!isNaN(dt)) return dt;
  }

  return null;
}

export function debounce<T extends (...a: any[]) => void>(fn: T, delay = 350) {
  let t: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}


export function buildUrl(base: string, params: QueryParams) {
  const url = new URL(base, location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      url.searchParams.set(k, String(v));
    }
  });
  return url.toString();
}

export function fmtClasesRestantes(user: User): string {
  if (user.limite_clases === undefined || user.limite_clases === null) return "-";
  return `${user.clases_tomadas}/${user.limite_clases}`;
}

export function BuildQueryParams(filters: DashboardFilters): QueryParams {
  let queryParams: QueryParams = {
    page: filters.page ?? 1,
  };
  let counter = 1;

  if (typeof filters?.sort === "string" && filters.sort.length > 0) {
      queryParams.sort = filters.sort;
  }
  if (typeof filters?.search === "string" && filters.search.length > 0) {
    queryParams["field" + counter] = "nombre";
    queryParams["value" + counter] = filters.search;
    counter++;
  }
  if (typeof filters?.plan === "string" && filters.plan.length > 0  && filters.plan.trim() !== "all") {
    queryParams["field" + counter] = "plan";
    queryParams["value" + counter] = filters.plan;
    counter++;
  }
  if (typeof filters?.estado === "string" && filters.estado.length > 0 && filters.estado.trim() !== "all") {
    queryParams["field" + counter] = "estado";
    queryParams["value" + counter] = filters.estado;
    counter++;
  }
  return queryParams;
};

export function MapPlanCatalog(planes: Plan[]){
  const sorted = planes.sort((a, b) => (Number(a.order ?? Infinity) - Number(b.order ?? Infinity)));
  const catalog = sorted.map( (item) => {
    return {
       value: item.value,
      name: item.label
    }
  });
  catalog.unshift({value:"all", name:"Planes: Todos"});
  return catalog;

}