<script lang="ts">
  import {
    Navbar,
    NavLi,
    NavUl,
    NavHamburger,
    Search,
    Button,
  } from "flowbite-svelte";
  import { Select } from "flowbite-svelte";

  let selected = "all";
  let status = [
    { value: "all", name: "Estado: Todos" },
    { value: "ac", name: "Activo" },
    { value: "in", name: "Inactivo" },
    { value: "pa", name: "Pausado" },
  ];

  let plans = [
    { value: "all", name: "Plan: Todos" },
    { value: "12G", name: "12 Sesiones Mensuales" },
    { value: "16G", name: "16 Sesiones Mensuales" },
    { value: "20G", name: "20 Sesiones Mensuales" },
    { value: "cl", name: "Clase Libre" },
    { value: "cg", name: "Clase Gratis" },
    { value: "12P", name: "12 Sesiones Personalizadas" },
    { value: "16P", name: "16 Sesiones Personalizadas" },
    { value: "20P", name: "20 Sesiones Personalizadas" },
    { value: "pa", name: "Parejas" },
    { value: "il", name: "Ilimitado" },
  ];
</script>

<Navbar class="px-0 py-0 sm:px-0 mb-4">
  {#snippet children({ hidden, toggle, NavContainer })}
    <NavUl
      class="order-0"
      classes={{ ul: "flex flex-row items-center gap-4 p-0" }}
    >
      <NavLi>
        <Search size="md" class="ms-auto" placeholder="Search..." />
      </NavLi>
      <NavLi>
        <Select
          size="md"
          class="ms-auto"
          items={status}
          bind:value={selected}
          placeholder="Estado:"
        />
      </NavLi>
      <NavLi>
        <Select
          size="md"
          class="ms-auto"
          items={plans}
          bind:value={selected}
          placeholder="Estado:"
        />
      </NavLi>
    </NavUl>

    <div class="flex md:order-1"></div>

    <div class="flex md:order-2">
      <Button size="lg" color="pink">Nuevo Alumno +</Button>
      <NavHamburger />
    </div>
  {/snippet}
</Navbar>
