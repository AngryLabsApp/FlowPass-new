<script lang="ts">
  import { onMount } from "svelte";
  import { Heading, Skeleton } from "flowbite-svelte";
  import Navbar from "../../../lib/components/navbar/navbar.pagos.svelte";
  import Pagination from "../../../lib/components/pagination/pagination.svelte";
  import Table from "../../../lib/components/table/table.svelte";
  import SkeletonTable from "$lib/components/skeletons/table.svelte";
  import { FilterKeys } from "$lib/enums/filter_keys";
  import { PAGOS_TABLE_COLUMNS } from "$lib/catalog/pagos_table_columns";
  import type { PagosFilters } from "$lib/types/dashboardFilters";
  import { BuildQueryParamsPagos, fmtYearMonth } from "$lib/utils/utils";
  import type { QueryParams } from "$lib/types/queryparams";
  import { getPagos, getTotalByMonth } from "$lib/services/api/pagos";
  import type { Payment } from "$lib/types/pagos";
  import { Card } from "flowbite-svelte";
  import { Wallet } from "@lucide/svelte";
  import { CurrencyKeys } from "$lib/enums/currency_keys";
  import { toTitleCase } from "$lib/utils/utils";

  let pagination_values = $state({ total: 1, start: 0, end: 0, totalPages: 1 });
  let page = $state(1);
  let error = $state("");
  let loading = $state(true);
  let loading_total = $state(true);
  let total_by_month = $state(0);
  let selectedDate = $state<Date>(new Date());
  let pagos: Payment[] = $state([]);
  let filters: PagosFilters = {
    page: 1,
    estado_pago: "all",
    start_date: fmtYearMonth(new Date()),
    end_date: fmtYearMonth(new Date()),
    search: "",
  };
  let card_payment_text = "Ingresos totales";

  onMount(async () => {
    fetchPagos();
    fetchTotalMes();
  });

  const tableOnclick = () => {
    console.log("Table row clicked");
  };

  async function setValue(key: FilterKeys, value: string | Date) {
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
      selectedDate = value as Date;
      filters.start_date = fmtYearMonth(selectedDate as Date);
      filters.end_date = fmtYearMonth(selectedDate as Date);
      fetchTotalMes();
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
      const end = Math.min(page * pageSize, res.total);
      const totalPages = Math.max(1, Math.ceil(res.total / pageSize));
      pagination_values = {
        total: res.total,
        totalPages,
        start,
        end,
      };
    } catch (err: any) {
      if (err?.name === "AbortError") return;

      error = err?.message ?? "❌ Error al cargar pagos";
    } finally {
      if (currentAbort === abort) loading = false;
    }
  }

  let currentAbortTotal: AbortController | null = null;
  async function fetchTotalMes() {
    currentAbortTotal?.abort();
    const abort = new AbortController();
    currentAbortTotal = abort;

    let queryParams: QueryParams = BuildQueryParamsPagos(filters);
    let local_queryParams: QueryParams = {
      start_date: queryParams.start_date,
      end_date: queryParams.end_date,
      type: "total",
    };

    loading_total = true;
    try {
      const res = await getTotalByMonth(abort, local_queryParams);
      if (currentAbortTotal !== abort) return;
      total_by_month = res.total;
    } catch (err: any) {
      if (err?.name === "AbortError") return;

      error = err?.message ?? "❌ Error al cargar totales";
    } finally {
      if (currentAbortTotal === abort) loading_total = false;
    }
  }
</script>

<div class="w-full p-4 bg-gray-50 shadow-xs">
  <Navbar
    onSearch={(key: FilterKeys, val: string | Date) => {
      setValue(key, val);
    }}
    bind:selectedDate
  />
</div>

<div class="p-4">
  <Card class="p-5 flex gap-0.5 justify-center w-fit" size="xs">
    {#if loading_total}
      <Skeleton size="sm" class="w-34 h-34" />
    {:else}
      <div class="bg-primary-200 p-2 w-fit rounded-md">
        <Wallet class="h-10 w-10 text-primary-900  dark:text-gray-400" />
      </div>
      <span>
        <h5
          class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white"
        >
          {CurrencyKeys.PEN}{" "}{total_by_month}
        </h5>
      </span>
      <p class="font-normal text-sm text-gray-500 dark:text-gray-400">
        {card_payment_text.toUpperCase()}
      </p>
      <p class="text-secondary-600 inline-flex items-center">
        {toTitleCase(
          new Date(selectedDate).toLocaleString("es-ES", { month: "long" })
        )}
        {" "}
        {new Date(selectedDate).getFullYear()}
      </p>
    {/if}
  </Card>

  <div class="grid grid-cols-2 gap-4 mb-5 mt-5">
    <Heading tag="h3">Pagos</Heading>
  </div>
  {#if loading}
    <SkeletonTable rows={10} cellHeights="h-4" headers={PAGOS_TABLE_COLUMNS} />
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else}
    <div class="mb-4">
      <Table
        data={pagos}
        onClick={tableOnclick}
        headers={PAGOS_TABLE_COLUMNS}
      />
    </div>
    <Pagination
      {pagination_values}
      bind:page
      onSearch={(key: FilterKeys, val: string) => setValue(key, val)}
    />
  {/if}
</div>
