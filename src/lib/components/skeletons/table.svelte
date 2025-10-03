<script lang="ts">
  import type { Column } from "$lib/types/column";
  import type { User } from "$lib/types/user";
  import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
  } from "flowbite-svelte";
  export let rows = 10; // cuántas filas “fake”
  export let cellHeights = "h-4"; // altura de cada skeleton
  export let headers: Column<User>[]; // columnas de la tabla
</script>

<Table class="animate-pulse">
  <TableHead>
    {#each headers as col}
      <TableHeadCell>{col.header}</TableHeadCell>
    {/each}
  </TableHead>

  <TableBody>
    {#each Array(rows) as _}
      <TableBodyRow>
        {#each headers as col}
          <TableBodyCell>
            <div
              class={`bg-gray-200 rounded ${cellHeights} w-full max-w-[12rem]`}
            ></div>
          </TableBodyCell>
        {/each}
      </TableBodyRow>
    {/each}
  </TableBody>
</Table>
