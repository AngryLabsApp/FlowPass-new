<script lang="ts">
  import { onMount } from "svelte";
  import { Heading } from "flowbite-svelte";
  import Navbar from "../../../lib/components/navbar/navbarPagos.svelte";
  import Pagination from "../../../lib/components/pagination/pagination.svelte";
  import UserTable from "../../../lib/components/table/table.svelte";
  import SkeletonTable from "$lib/components/skeletons/table.svelte";
  import { FilterKeys } from "$lib/enums/filter_keys";
  import { PAGOS_TABLE_COLUMNS } from "$lib/catalog/pagos_table_columns";
  import type { PagosFilters } from "$lib/types/dashboardFilters";
  import { fmtYearMonth } from "$lib/utils/utils";

  let pagination_values = $state({ total: 1, start: 0, end: 0, totalPages: 1 });
  let page = $state(1);
  let error = $state("");
  let loading = $state(true);
  let selectedDate = $state<Date | undefined>(new Date());
  let filters: PagosFilters = {
    page: 1,
    estado_pago: "all",
    start_date: fmtYearMonth(new Date()),
    end_date: fmtYearMonth(new Date()),
    search: "",
  };

  onMount(async () => {
    console.log("filters on mount:", filters );
  });

  const tableOnclick = () => {
    console.log("Table row clicked");
  };

  let currentAbort: AbortController | null = null;

  async function setValue(key: FilterKeys, value: string) {
    console.log("setValue called with:", key, value);
    if (key === FilterKeys.SEARCH) {
      page = 1;
      filters.search = value;
    }
    if (key === FilterKeys.ESTADO_PAGO) {
      page = 1;
      filters.estado_pago = value;
    }
    if (key === FilterKeys.DATE) {
      page = 1;

      filters.start_date = fmtYearMonth(selectedDate as Date);
      filters.end_date = fmtYearMonth(selectedDate as Date);
    }
    filters.page = page;

    console.log("Filters updated:", filters);
  }
</script>

<Navbar
  onSearch={(key: FilterKeys, val: string) => {
    setValue(key, val);
  }}
  {selectedDate}
/>
<div class="grid grid-cols-2 gap-4 mb-5">
  <Heading tag="h3">Pagos</Heading>
</div>
{#if loading}
  <SkeletonTable rows={10} cellHeights="h-4" headers={PAGOS_TABLE_COLUMNS} />
{:else if error}
  <p class="text-red-600">{error}</p>
{:else}
  <UserTable users={[]} onClick={tableOnclick} />
  <Pagination
    {pagination_values}
    bind:page
    onSearch={(key: FilterKeys, val: string) => {}}
  />
{/if}
