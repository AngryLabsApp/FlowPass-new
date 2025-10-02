<script context="module" lang="ts">
  export type Column<T> = {
    header: string;
    /** clave directa en el objeto (ej. 'nombre', 'plan') */
    key?: keyof T;
    /** tipo de render básico */
    type?: "text" | "date" | "status" | "title";
    /** clase opcional para la celda */
    class?: string;
    /** si necesitas un valor custom (gana sobre key) */
    accessor?: (row: T) => unknown;
  };
</script>

<script lang="ts">
  import type { User } from "$lib/types/user";
  import { getValue, statusPillClasses } from "$lib/utils/utils";
  import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
  } from "flowbite-svelte";

  export let users: User[] = [];
  export let columns: Column<User>[] = [
    { header: "Nombre(s)", key: "nombre", type:"title" },
    { header: "Apellido(s)", key: "apellidos", type:"title" },
    { header: "Plan", key: "plan" },
    { header: "Clases realizadas", key: "clases_tomadas" },
    { header: "Días de cortesía", key: "dias_de_gracia" },
    { header: "Inicio de plan", key: "fecha_inicio_plan", type: "date" },
    { header: "Fin de plan", key: "proxima_fecha_pago", type: "date" },
    { header: "Estado", key: "estado", type: "status" },
    { header: "Estado de pago", key: "estado_pago", type: "status" },
  ];


</script>

<Table>
  <TableHead>
    {#each columns as col}
      <TableHeadCell>{col.header}</TableHeadCell>
    {/each}
  </TableHead>

  <TableBody>
    {#each users as u}
      <TableBodyRow>
        {#each columns as col}
          <TableBodyCell class={col.class}>
            {#if col.type === "status"}
              <span
                class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusPillClasses(getValue(u, col))}`}
              >
                {getValue(u, col)}
              </span>
            {:else}
              {getValue(u, col)}
            {/if}
          </TableBodyCell>
        {/each}
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
