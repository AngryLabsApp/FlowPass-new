<script lang="ts">
  import {
    Navbar,
    NavLi,
    NavUl,
    NavHamburger,
    Search,
    Button,
  } from "flowbite-svelte";
  import { Select, Label } from "flowbite-svelte";

  let selected = "all";
  let countries = [
      { value: "all", name: "Estado: Todos" },
      { value: "us", name: "United States" },
      { value: "ca", name: "Canada" },
      { value: "de", name: "Germany" },
    ];
</script>

<Navbar>
  {#snippet children({ hidden, toggle, NavContainer })}
    <NavUl class="order-0">
      <NavLi>
        <Search size="md" class="ms-auto" placeholder="Search..." />
      </NavLi>
      <NavLi>
        <Select  size="md" class="ms-auto" items={countries} bind:value={selected} placeholder="Estado:" />
      </NavLi>
        <NavLi>
        <Select  size="md" class="ms-auto" items={countries} bind:value={selected} placeholder="Estado:" />
      </NavLi>
    </NavUl>

    <div class="flex md:order-1"></div>

    <div class="flex md:order-2">
      <Button size="lg" color="pink">Nuevo Alumno +</Button>
      <NavHamburger />
    </div>
  {/snippet}
</Navbar>
