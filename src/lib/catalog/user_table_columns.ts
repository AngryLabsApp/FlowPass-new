import type { Column } from "$lib/types/column";
import type { User } from "$lib/types/user";
import { fmtClasesRestantes } from "$lib/utils/utils";

  export let USER_TABLE_COLUMNS: Column<User>[] = [
    { header: "Nombre(s)", key: "nombre", type: "title" },
    { header: "Apellido(s)", key: "apellidos", type: "title" },
    { header: "Plan", key: "plan" },
    {
      header: "Clases realizadas",
      key: "clases_restantes",
      type: "custom",
      fmt: (u: User) => fmtClasesRestantes(u),
    },
    { header: "Días de cortesía", key: "dias_de_gracia" },
    { header: "Inicio de plan", key: "fecha_inicio_plan", type: "date" },
    { header: "Fin de plan", key: "proxima_fecha_pago", type: "date" },
    { header: "Estado", key: "estado", type: "status" },
    { header: "Estado de pago", key: "estado_pago", type: "status" },
  ];