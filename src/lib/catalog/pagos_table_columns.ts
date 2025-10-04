import type { Column } from "$lib/types/column";
import type { Payment } from "$lib/types/pagos";


  export let PAGOS_TABLE_COLUMNS: Column<Payment>[] = [
    { header: "Alumno", key: "full_name", type: "title" },
    { header: "Monto", key: "monto", type: "text" },
    { header: "Fecha", key: "fecha_pago", type: "date" },
    { header: "Plan", key: "plan", type: "title" },
    { header: "Medio de Pago", key: "medio_de_pago", type: "title" },
    { header: "Estado", key: "estado_pago", type: "status" },
  ];