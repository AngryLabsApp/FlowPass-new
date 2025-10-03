<script lang="ts">
  import UserModal from "../../../lib/components/modal/modal.svelte";
  import { onMount } from "svelte";
  import { getUsers } from "$lib/services/api/users";
  import { Heading } from "flowbite-svelte";
  import Navbar from "../../../lib/components/navbar/navbar.svelte";
  import Pagination from "../../../lib/components/pagination/pagination.svelte";
  import UserTable from "../../../lib/components/table/table.svelte";
  import SkeletonTable from "$lib/components/skeletons/table.svelte";
  import { Select, Label } from "flowbite-svelte";
  import type { User } from "$lib/types/user";
  import type { QueryParams } from "$lib/types/queryparams";
  import { BuildQueryParams } from "$lib/utils/utils";
  import { FilterKeys } from "$lib/enums/filter_keys";
  import type { DashboardFilters } from "$lib/types/dashboardFilters";
  import { SORT_CATALOG } from "$lib/catalog/sort_catalog";




  let error = $state("");
  let loading = $state(true);
  let users: User[] = $state([]);

  onMount(async () => {
    await fetchAlumnos();
  });

  let openModal: boolean = $state(false);
  let selected_user: User = $state({} as User);
  const tableOnclick = (user: User) => {
    openModal = true;
    selected_user = user;
  };

  let sort_type = $state("created_desc");
  let filters:DashboardFilters = {page:1, estado:"", plan:"", search:"", sort:"created_desc"};
  console.log("Filters", filters);
  let currentAbort: AbortController | null = null;

  async function setValue(key: FilterKeys, value: string) {
    
    if (key === FilterKeys.SEARCH) {
      filters.search = value;
    }
    if (key === FilterKeys.ESTADO) {
      filters.estado = value;
    }
    if (key === FilterKeys.PLAN) {
      filters.plan = value;
    }
    if (key === FilterKeys.SORT) {
      filters.sort = value;
    }
    await fetchAlumnos();

  }

  async function fetchAlumnos() {
    currentAbort?.abort();
    const abort = new AbortController();
    currentAbort = abort;

    let queryParams: QueryParams = BuildQueryParams(filters);
    console.log(queryParams);
    try {
      loading = true;
      //?page=1&field1=nombre&value1=angel&sort=created_desc

      const res = await getUsers(abort, queryParams);

      if (currentAbort !== abort) return;


      users = res.users;

    } catch (err: any) {

      if (err?.name === "AbortError") return;

      error = err?.message ?? "❌ Error al cargar usuarios";
    } finally {
     
      if (currentAbort === abort) loading = false;
    }
  }
</script>

<Navbar onSearch={(key: FilterKeys, val: string) => setValue(key, val)} />
<div class="grid grid-cols-2 gap-4 mb-5">
  <Heading tag="h3">Alumnos</Heading>
  <div class="flex items-center gap-3 justify-end">
    <Label for="order-by" class="mb-0">Ordenar por:</Label>
    <Select
      id="order-by"
      class="w-full max-w-xs"
      items={SORT_CATALOG}
      bind:value={sort_type}
      onchange={() => {
        setValue(FilterKeys.SORT, sort_type);
      }}
    />
  </div>
</div>
<UserModal bind:openModal user={selected_user} />
{#if loading}
  <SkeletonTable
    rows={10}
    cellHeights="h-4"
    withFooter={false}
    headers={["Product name", "Color", "Category", "Price"]}
  />
{:else if error}
  <p class="text-red-600">{error}</p>
{:else}
  <UserTable {users} onClick={tableOnclick} />
  <Pagination />
{/if}
