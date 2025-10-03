<script lang="ts">
  import { USER_TABLE_COLUMNS } from "$lib/catalog/user_table_columns";
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
</script>

<Table class="animate-pulse">
  <TableHead>
    {#each USER_TABLE_COLUMNS as col}
      <TableHeadCell>{col.header}</TableHeadCell>
    {/each}
  </TableHead>

  <TableBody>
    {#each Array(rows) as _}
      <TableBodyRow>
        {#each USER_TABLE_COLUMNS as col}
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
