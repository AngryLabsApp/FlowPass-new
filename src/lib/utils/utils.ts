import type { Column } from "$lib/components/table/table.svelte";
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
  return str
    .toLowerCase()
    .replace(/(?:^|\s)\p{L}/gu, c => c.toUpperCase());
}


  export function statusPillClasses(value: unknown) {
    const v = String(value ?? "").toLowerCase();
    // ajusta a tus estados reales
    console.log(
      v,
      ["activo", "pagado"].some((k) => v.includes(k))
    );
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
    let final_users:User[] = [];
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      let final_user:User = { ...user };
      if (
        final_user?.is_plan_partner &&
        !final_user?.is_plan_principal &&
        final_user.partner_id
      ) {
        final_user.clases_tomadas = final_user.partner_clases_tomadas || 0;
        final_user.limite_clases = final_user.partner_limite_clases || 0;
        final_user.estado_pago = final_user.partner_estado_pago || final_user.estado_pago;
        final_user.estado = final_user.partner_estado || final_user.estado;
        final_user.dias_de_gracia = final_user.partner_dias_de_gracia || 0;
        final_user.monto = final_user.partner_monto || 0;
        final_user.fecha_inicio_plan = final_user.partner_fecha_inicio_plan || "";
        final_user.proxima_fecha_pago = final_user.partner_proxima_fecha_pago || "";
      
      }
      final_users.push(final_user);
    };

   
    return final_users;
  }