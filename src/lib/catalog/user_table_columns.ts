import type { Column } from "$lib/types/column";
import type { User } from "$lib/types/user";
import { getCustomEnv } from "$lib/utils/env_utils";
import { fmtClasesRestantes } from "$lib/utils/utils";
import { UsersSolid } from "flowbite-svelte-icons";

export let USER_TABLE_COLUMNS: Column<User>[] = [
  {
    header: "Nombre(s)",
    key: "nombre",
    type: "title",
  },
  {
    header: "Apellido(s)",
    key: "apellidos",
    type: "title",
    responsive: "hidden lg:table-cell",
  },
  {
    header: "Plan",
    key: "plan",
    class: "p-1",
    header_class: "w-[150px] max-w-[200px] break-words whitespace-normal",
    responsive: "hidden sm:table-cell",
  },
  {
    header: "Clases realizadas",
    key: "clases_restantes",
    type: "custom",
    header_class: "max-w-[150px] min-w-min",
    class: "mt-2.5 flex justify-center items-center gap-2",
    fmt: (u: User) => fmtClasesRestantes(u),
    icon: (u: User) => {
      //ICONO DE PARTNERS
      if (u.is_plan_partner) return UsersSolid;
      return null;
    },
  },
  { header: "Días de cortesía", key: "dias_de_gracia" },
  {
    header: "Inicio de plan",
    key: "fecha_inicio_plan",
    type: "date",
    header_class: "w-[180px] max-w-[200px]",
    responsive: "hidden sm:table-cell",
  },
  {
    header: "Fin de plan",
    key: "proxima_fecha_pago",
    header_class: "w-[180px] max-w-[200px]",
    type: "date",
    responsive: "hidden lg:table-cell",
  },
  {
    header: "Estado",
    key: "estado",
    type: "status",
    header_class: "w-[120px] max-w-[150px]",
  },
  {
    header: "Estado de pago",
    key: "estado_pago",
    type: "status",
    header_class: "w-[140px] max-w-[200px]",
    responsive: "hidden lg:table-cell",
  },
];

export const getCustomUserTableHeaders = () => {
  const hide_columns = getCustomEnv("hide_columns");
  if (hide_columns && hide_columns.length > 0) {
    return USER_TABLE_COLUMNS.filter(
      (item) => !hide_columns.includes(item.key)
    );
  }
  return USER_TABLE_COLUMNS;
};
