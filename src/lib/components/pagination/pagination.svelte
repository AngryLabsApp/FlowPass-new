<script lang="ts">
  import { FilterKeys } from "$lib/enums/filter_keys";
  import { PaginationNav } from "flowbite-svelte";
  import { ArrowLeftOutline, ArrowRightOutline } from "flowbite-svelte-icons";

  let {
    totalPages = 1,
    page = $bindable(1),
    onSearch,
  } = $props<{
    totalPages: number;
    page: number;
    onSearch?: (key: FilterKeys, q: string) => void; 
  }>();



  function handlePageChange(current_page: number) {
    page = current_page;
    // Additional logic here
    onSearch(FilterKeys.PAGE, "");
    console.log("Page changed to:", page);
  }
</script>

<PaginationNav  visiblePages={5} currentPage={page} totalPages={totalPages} onPageChange={handlePageChange}>
  {#snippet prevContent()}
    <span class="sr-only">Previous</span>
    <ArrowLeftOutline class="h-5 w-5" />
  {/snippet}
  {#snippet nextContent()}
    <span class="sr-only">Next</span>
    <ArrowRightOutline class="h-5 w-5" />
  {/snippet}
</PaginationNav>
 