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
  import { BuildQueryParams, MapPlanCatalog } from "$lib/utils/utils";
  import { FilterKeys } from "$lib/enums/filter_keys";
  import type { DashboardFilters } from "$lib/types/dashboardFilters";
  import { SORT_CATALOG } from "$lib/catalog/sort_catalog";
  import { getPlanes } from "$lib/services/api/planes";
  import { USER_TABLE_COLUMNS } from "$lib/catalog/user_table_columns";



  let pagination_values = $state({total:1,start:0, end:0, totalPages:1});
  let page = $state(1);
  let error = $state("");
  let loading = $state(true);
  let users: User[] = $state([]);
  let planes_catalog:{ value: string; name: string; }[] =  $state([{value:"all", name:"Planes: Todos"}]);

  onMount(async () => {
    const planes = await getPlanes();
    planes_catalog = MapPlanCatalog(planes);
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
  let currentAbort: AbortController | null = null;

  async function setValue(key: FilterKeys, value: string) {
    if (key === FilterKeys.SEARCH) {
      page = 1;
      filters.search = value;
    }
    if (key === FilterKeys.ESTADO) {
      page = 1;
      filters.estado = value;
    }
    if (key === FilterKeys.PLAN) {
      page = 1;
      filters.plan = value;
    }
    if (key === FilterKeys.SORT) {
      page = 1;
      filters.sort = value;
    }

    filters.page = page;
    await fetchAlumnos();

  }

  async function fetchAlumnos() {
    currentAbort?.abort();
    const abort = new AbortController();
    currentAbort = abort;
    
    let queryParams: QueryParams = BuildQueryParams(filters);

    try {
      loading = true;
      const res = await getUsers(abort, queryParams);

      if (currentAbort !== abort) return;


      users = res.users;
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

      error = err?.message ?? "❌ Error al cargar usuarios";
    } finally {
     
      if (currentAbort === abort) loading = false;
    }
  }
</script>

<Navbar onSearch={(key: FilterKeys, val: string) => setValue(key, val)} PLANES_CATALOG={planes_catalog} />
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
    headers={USER_TABLE_COLUMNS}
  />
{:else if error}
  <p class="text-red-600">{error}</p>
{:else}
  <UserTable {users} onClick={tableOnclick} />
  <Pagination  pagination_values={pagination_values} bind:page={page} onSearch={(key: FilterKeys, val: string) => setValue(key, val)}/>
{/if}
