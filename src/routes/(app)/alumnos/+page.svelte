<script lang="ts">
  import { onMount } from "svelte";
  import { getUsers } from "$lib/services/api/users";

  import { Heading } from "flowbite-svelte";
  import Navbar from "../../../lib/components/navbar/navbar.svelte";
  import Pagination from "../../../lib/components/pagination/pagination.svelte";
  import UserTable from "../../../lib/components/table/table.svelte";
  import SkeletonTable from "$lib/components/skeletons/table.svelte";
  import { Select, Label } from "flowbite-svelte";
  let selected = "";
  let countries = [
    { value: "us", name: "United States" },
    { value: "ca", name: "Canada" },
    { value: "de", name: "Germany" },
    { value: "fr", name: "France", disabled: true },
  ];

  let users: any[] = [];
  let error = "";
  let loading = true;
  onMount(async () => {
    const abort = new AbortController();
    try {
      const res = await getUsers(
        `${import.meta.env.VITE_API_URL}/users`,
        abort
      );
      if (res?.ok) {
        users = await res.json();
        console.log(users);
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
  <div>
    <Label>
      Select an option
      <Select class="" items={countries} bind:value={selected} />
    </Label>
  </div>
</div>

{#if loading}
  <SkeletonTable  rows={5} cellHeights="h-4" withFooter={false} headers={["Product name", "Color", "Category", "Price"]} />
{:else if error}
  <p class="text-red-600">{error}</p>
{:else}
  <UserTable/>
  <Pagination />
{/if}
