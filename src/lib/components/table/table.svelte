<script lang="ts">
  import type { Column } from "$lib/types/column";
  import type { User } from "$lib/types/user";
  import {
    fmtClasesRestantes,
    getValue,
    statusPillClasses,
  } from "$lib/utils/utils";
  import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
  } from "flowbite-svelte";

  export let onClick: (user: User) => void = () => {};
  export let users: User[] = [];
  export let columns: Column<User>[] = [
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
</script>

<Table>
  <TableHead>
    {#each columns as col}
      <TableHeadCell>{col.header}</TableHeadCell>
    {/each}
  </TableHead>

  <TableBody>
    {#each users as u}
      <TableBodyRow onclick={() => onClick(u)}>
        {#each columns as col}
          <TableBodyCell class={col.class}>
            {#if col.type === "status"}
              <span
                class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${statusPillClasses(getValue(u, col))}`}
              >
                {getValue(u, col)}
              </span>
            {:else if col.type === "custom"}
              {col.fmt ? col.fmt(u) : ""}
            {:else}
              {getValue(u, col)}
            {/if}
          </TableBodyCell>
        {/each}
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
