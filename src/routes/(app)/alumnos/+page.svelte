<script lang="ts">

  import { Heading } from "flowbite-svelte";
  import Navbar from "../../../lib/components/navbar/navbar.svelte";
  import Pagination from "../../../lib/components/pagination/pagination.svelte";
  import UserTable from "../../../lib/components/table/table.svelte";

  import { Select, Label } from "flowbite-svelte";
  let selected = "";
  let countries = [
    { value: "us", name: "United States" },
    { value: "ca", name: "Canada" },
    { value: "de", name: "Germany" },
    { value: "fr", name: "France", disabled: true },
  ];



</script>

<Navbar />
<div class="grid grid-cols-2 gap-4 mb-5">
  <Heading tag="h3">Heading 3</Heading>
  <div>
    <Label>
      Select an option
      <Select class="" items={countries} bind:value={selected} />
    </Label>
  </div>
</div>

<UserTable />
<Pagination />
