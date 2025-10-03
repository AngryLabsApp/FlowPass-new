<script lang="ts">
  import { FilterKeys } from "$lib/enums/filter_keys";
  import { PaginationNav } from "flowbite-svelte";
  import { ArrowLeftOutline, ArrowRightOutline } from "flowbite-svelte-icons";

  let {
    pagination_values = { total: 1, start: 0, end: 0, totalPages: 1 },
    page = $bindable(1),
    onSearch,
  } = $props<{
    pagination_values: {
      total: number;
      start: number;
      end: number;
      totalPages: number;
    };
    page: number;
    onSearch?: (key: FilterKeys, q: string) => void;
  }>();

  function handlePageChange(current_page: number) {
    page = current_page;
    onSearch(FilterKeys.PAGE, "");
  }
</script>

<div class="flex items-center justify-between gap-3">
  <!-- Texto a la derecha -->
  <div class="text-sm text-gray-700 dark:text-gray-400">
    Mostrando
    <span class="font-semibold text-gray-900 dark:text-white"
      >{pagination_values.start}</span
    >
    -
    <span class="font-semibold text-gray-900 dark:text-white"
      >{pagination_values.end}</span
    >
    de
    <span class="font-semibold text-gray-900 dark:text-white"
      >{pagination_values.total}</span
    >
  </div>
  <!-- Paginación a la izquierda -->
  <PaginationNav
    visiblePages={10}
    currentPage={page}
    totalPages={pagination_values.totalPages}
    onPageChange={handlePageChange}
    layout="pagination"
    classes={{
      active: "bg-green-100 dark:bg-green-700 text-green-600 dark:text-white",
    }}
  >
    {#snippet prevContent()}
      <span class="sr-only">Previous</span>
      <ArrowLeftOutline class="h-5 w-5" />
    {/snippet}
    {#snippet nextContent()}
      <span class="sr-only">Next</span>
      <ArrowRightOutline class="h-5 w-5" />
    {/snippet}
  </PaginationNav>
</div>
