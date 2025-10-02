<script lang="ts">
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

  let selected = "new";
  let orderBy = [
    { value: "new", name: "Usuario: más nuevo" },
    { value: "old", name: "Usuario: más antiguo" },
    { value: "act", name: "Actualización: más reciente" },
  ];

  let data: getUsersResponse[] = [{ total: 0, data: [] }];
  let error = "";
  let loading = true;
  let users:User[] = [];
  onMount(async () => {
    const abort = new AbortController();
    try {
    const res = await getUsers(abort);
    if (res?.ok) {
      data = await res.json();
      const { total, data: _users } = data[0] || {};
      users = _users || [];
      console.log(total, users);

    } else {
      error = "❌ Error al cargar usuarios";
    }
    } catch (err: any) {
      error = err.message;
    } finally {
      loading = false;
    }
  });
</script>

<Navbar />
<div class="grid grid-cols-2 gap-4 mb-5">
  <Heading tag="h3">Alumnos</Heading>
  <div class="flex items-center gap-3 justify-end">
    <Label for="order-by" class="mb-0">Ordenar por:</Label>
    <Select id="order-by" class="w-full max-w-xs" items={orderBy} bind:value={selected} />
  </div>
</div>

{#if loading}
  <SkeletonTable  rows={5} cellHeights="h-4" withFooter={false} headers={["Product name", "Color", "Category", "Price"]} />
{:else if error}
  <p class="text-red-600">{error}</p>
{:else}
  <UserTable users={users} />
  <Pagination />
{/if}
