<script lang="ts">
import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell
  } from "flowbite-svelte";
  export let headers: string[] = ["Product name", "Color", "Category", "Price"];
  export let rows = 8;     // cuántas filas “fake”
  export let cellHeights = "h-4"; // altura de cada skeleton
  export let withFooter = false;  // si quieres un footer placeholder

</script>

<Table class="animate-pulse">
  <TableHead>
    {#each headers as h}
      <TableHeadCell>{h}</TableHeadCell>
    {/each}
  </TableHead>

  <TableBody>
    {#each Array(rows) as _}
      <TableBodyRow>
        {#each headers as __}
          <TableBodyCell>
            <div class={`bg-gray-200 rounded ${cellHeights} w-full max-w-[12rem]`}></div>
          </TableBodyCell>
        {/each}
      </TableBodyRow>
    {/each}
  </TableBody>

  {#if withFooter}
    <tfoot>
      <tr class="font-semibold text-gray-900 dark:text-white">
        <th scope="row" class="px-6 py-3 text-base">
          <div class="bg-gray-200 rounded h-4 w-24"></div>
        </th>
        {#each Array(headers.length - 1) as _}
          <td class="px-6 py-3">
            <div class="bg-gray-200 rounded h-4 w-16"></div>
          </td>
        {/each}
      </tr>
    </tfoot>
  {/if}
</Table>

