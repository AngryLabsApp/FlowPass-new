<script lang="ts">
  import type { Column } from "$lib/types/column";
  import {
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

  export let onClick: (item: any) => void = () => {};
  export let data: any[] = [];
  export let headers: Column<any>[]; 

</script>

<Table>
  <TableHead>
    {#each headers as col}
      <TableHeadCell>{col.header}</TableHeadCell>
    {/each}
  </TableHead>

  <TableBody>
    {#each data as u}
      <TableBodyRow onclick={() => onClick(u)}>
        {#each headers as col}
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
