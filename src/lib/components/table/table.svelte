<script lang="ts">
  import type { Column } from "$lib/types/column";
  import { getValue, statusPillClasses } from "$lib/utils/utils";
  import {
    Table,
    TableHead,
    TableHeadCell,
    TableBody,
    TableBodyRow,
    TableBodyCell,
    Button,
    Dropdown,
    DropdownItem,
  } from "flowbite-svelte";
  import {
    ChevronDownOutline,
    DotsVerticalOutline,
  } from "flowbite-svelte-icons";

  export let onClick: (item: any) => void = () => {};
  export let data: any[] = [];
  export let headers: Column<any>[];
  export let dropdownActions: boolean = false;
  const stop = (e: Event) => e.stopPropagation();
</script>

<Table hoverable={true}>
  <TableHead>
    {#each headers as col}
      <TableHeadCell>{col.header}</TableHeadCell>
    {/each}
    {#if dropdownActions}
      <TableHeadCell></TableHeadCell>
    {/if}
  </TableHead>

  <TableBody>
    {#each data as u}
      <TableBodyRow onclick={() => onClick(u)}>
        {#each headers as col}
          <TableBodyCell class={col.class}>
            {#if col.type === "status" && getValue(u, col) !== ""}
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
            {#if col.icon && col.icon(u)}
              <svelte:component this={col.icon(u)} class="w-4 h-4" />
            {/if}
          </TableBodyCell>
        {/each}
        {#if dropdownActions}
          <TableBodyCell class="text-right">
            <!-- contenedor solo para layout, SIN handlers -->
            <div class="inline-flex items-center justify-end">
              <Button
                outline
                type="button"
                class="inline-flex items-center justify-center rounded-full p-1 border-none"
                color="secondary"
                onclick={stop}
              >
                <DotsVerticalOutline class="h-8 w-8" />
              </Button>
              <Dropdown simple>
                <DropdownItem
                  onclick={(e:any) => {
                    stop(e);
                    console.log("asda");
                  }}>Eliminar</DropdownItem
                >
              </Dropdown>
            </div>
          </TableBodyCell>
        {/if}
      </TableBodyRow>
    {/each}
    {#if data.length <= 0}
      <TableBodyRow>
        <TableBodyCell>Sin Registros</TableBodyCell>
      </TableBodyRow>
    {/if}
  </TableBody>
</Table>
