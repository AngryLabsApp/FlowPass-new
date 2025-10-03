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
  import type { getUsersResponse } from "$lib/types/api";
  import type { User } from "$lib/types/user";
  import { mapIfPartnerUser } from "$lib/utils/utils";
  import type { QueryParams } from "$lib/types/queryparams";

  let selected = "new";
  let orderBy = [
    { value: "new", name: "Usuario: más nuevo" },
    { value: "old", name: "Usuario: más antiguo" },
    { value: "act", name: "Actualización: más reciente" },
  ];

  let error = $state("");
  let loading = $state(true);
  let users: User[] = $state([]);

  onMount(async () => {
    await fetchAlumnos("");
  });

  let openModal: boolean = $state(false);
  let selected_user: User = $state({} as User);
  const tableOnclick = (user: User) => {
    openModal = true;
    selected_user = user;
  };

  let q = $state("");

  let currentAbort: AbortController | null = null;

  async function fetchAlumnos(query: string) {
    // 1) Aborta la request anterior (si existe)
    currentAbort?.abort();

    // 2) Crea un nuevo AbortController para esta llamada
    const abort = new AbortController();
    currentAbort = abort;

    q = query;
    let queryParams: QueryParams = {
      page: 1,
    };
    if (q.length > 0) {
      queryParams["field1"] = "nombre";
      queryParams["value1"] = q;
    }
    console.log("Searching for:", q);
    console.log(queryParams);
    try {
      loading = true;
      //?page=1&field1=nombre&value1=angel&sort=created_desc

      // 3) Pasa el signal a tu fetch/getUsers
      //    (ajusta getUsers para que reciba { signal, q } si aún no lo hace)
      const res = await getUsers(abort, queryParams);

      // 4) Si esta ya no es la request “vigente”, sal sin tocar estado
      if (currentAbort !== abort) return;

      // 5) Procesa respuesta
      users = res.users;
      console.log("Users fetched:", res);
    } catch (err: any) {
      // 6) Ignora cancelaciones
      if (err?.name === "AbortError") return;

      error = err?.message ?? "❌ Error al cargar usuarios";
    } finally {
      // 7) Solo apaga loading si sigues siendo la request vigente
      if (currentAbort === abort) loading = false;
    }
  }
</script>

<Navbar bind:query={q} onSearch={(val) => fetchAlumnos(val)} />
<div class="grid grid-cols-2 gap-4 mb-5">
  <Heading tag="h3">Alumnos</Heading>
  <div class="flex items-center gap-3 justify-end">
    <Label for="order-by" class="mb-0">Ordenar por:</Label>
    <Select
      id="order-by"
      class="w-full max-w-xs"
      items={orderBy}
      bind:value={selected}
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
