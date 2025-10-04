<script lang="ts">
  import { onMount } from "svelte";
  import { Heading } from "flowbite-svelte";
  import Navbar from "../../../lib/components/navbar/navbarPagos.svelte";
  import Pagination from "../../../lib/components/pagination/pagination.svelte";
  import Table from "../../../lib/components/table/table.svelte";
  import SkeletonTable from "$lib/components/skeletons/table.svelte";
  import { FilterKeys } from "$lib/enums/filter_keys";
  import { PAGOS_TABLE_COLUMNS } from "$lib/catalog/pagos_table_columns";
  import type { PagosFilters } from "$lib/types/dashboardFilters";
  import { BuildQueryParamsPagos, fmtYearMonth } from "$lib/utils/utils";
  import type { QueryParams } from "$lib/types/queryparams";
  import { getPagos } from "$lib/services/api/pagos";
  import type { Payment } from "$lib/types/pagos";

  let pagination_values = $state({ total: 1, start: 0, end: 0, totalPages: 1 });
  let page = $state(1);
  let error = $state("");
  let loading = $state(true);
  let selectedDate = $state<Date | undefined>(new Date());
  let pagos: Payment[] = $state([]);
  let filters: PagosFilters = {
    page: 1,
    estado_pago: "all",
    start_date: fmtYearMonth(new Date()),
    end_date: fmtYearMonth(new Date()),
    search: "",
  };

  onMount(async () => {
    await fetchPagos();
  });

  const tableOnclick = () => {
    console.log("Table row clicked");
  };

  async function setValue(key: FilterKeys, value: string) {
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
    await fetchPagos();
  }

  let currentAbort: AbortController | null = null;
  async function fetchPagos() {
    currentAbort?.abort();
    const abort = new AbortController();
    currentAbort = abort;

    let queryParams: QueryParams = BuildQueryParamsPagos(filters);
    try {
      loading = true;
      const res = await getPagos(abort, queryParams);
      if (currentAbort !== abort) return;
      pagos = res.pagos;
      const pageSize = 10;

      const start = res.total ? (page - 1) * pageSize + 1 : 0;
      const end   = Math.min(page * pageSize, res.total);
      const totalPages = Math.max(1, Math.ceil(res.total / pageSize));
      pagination_values = {
        total: res.total,
        totalPages,
        start,
        end
      };

     
    } catch (err: any) {
      if (err?.name === "AbortError") return;

      error = err?.message ?? "❌ Error al cargar pagos";
    } finally {
      if (currentAbort === abort) loading = false;
    }
  }
</script>

<Navbar
  onSearch={(key: FilterKeys, val: string) => {
    setValue(key, val);
  }}
   bind:selectedDate

/>
<div class="grid grid-cols-2 gap-4 mb-5">
  <Heading tag="h3">Pagos</Heading>
</div>
{#if loading}
  <SkeletonTable rows={10} cellHeights="h-4" headers={PAGOS_TABLE_COLUMNS} />
{:else if error}
  <p class="text-red-600">{error}</p>
{:else}
  <Table data={pagos} onClick={tableOnclick} headers={PAGOS_TABLE_COLUMNS}/>
  <Pagination
    {pagination_values}
    bind:page
    onSearch={(key: FilterKeys, val: string) => setValue(key, val)}
  />
{/if}
