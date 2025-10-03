<script lang="ts">
  import { USER_TABLE_COLUMNS } from "$lib/catalog/user_table_columns";
  import type { Column } from "$lib/types/column";
  import type { User } from "$lib/types/user";
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

  export let onClick: (user: User) => void = () => {};
  export let users: User[] = [];

</script>

<Table>
  <TableHead>
    {#each USER_TABLE_COLUMNS as col}
      <TableHeadCell>{col.header}</TableHeadCell>
    {/each}
  </TableHead>

  <TableBody>
    {#each users as u}
      <TableBodyRow onclick={() => onClick(u)}>
        {#each USER_TABLE_COLUMNS as col}
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
