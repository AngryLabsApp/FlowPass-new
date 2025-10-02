<script lang="ts">
  import {
    Navbar,
    NavLi,
    NavUl,
    Search,
    Button,
    ToolbarButton,
    Select,
  } from "flowbite-svelte";
  import { AdjustmentsHorizontalSolid } from "flowbite-svelte-icons";

  let statusSelected = "all";
  let status = [
    { value: "all", name: "Estado: Todos" },
    { value: "ac", name: "Activo" },
    { value: "in", name: "Inactivo" },
    { value: "pa", name: "Pausado" },
  ];

  let planSelected = "all";
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
      class="order-0 w-full md:w-auto"
      classes={{
        ul: "flex flex-col items-stretch gap-3 p-2 md:flex-row md:items-center md:gap-4 md:p-0",
      }}
    >
      <NavLi class="w-full md:w-auto py-0 pe-0 ps-0">
        <Search
          size="md"
          class="w-full md:w-auto md:ms-auto"
          placeholder="Search..."
        />
      </NavLi>
      <NavLi class="w-full md:w-auto py-0 pe-0 ps-0">
        <Select
          size="md"
          class="w-full md:w-auto md:ms-auto md:min-w-[135px]"
          items={status}
          bind:value={statusSelected}
          placeholder="Estado:"
        />
      </NavLi>
      <NavLi class="w-full md:w-auto py-0 pe-0 ps-0">
        <Select
          size="md"
          class="w-full md:w-auto md:ms-auto md:min-w-[135px]"
          items={plans}
          bind:value={planSelected}
          placeholder="Plan:"
        />
      </NavLi>
    </NavUl>

    <div class="flex md:order-1"></div>

    <div
      class="flex md:order-2 items-center w-full md:w-auto justify-between md:justify-end gap-1"
    >
      <Button size="lg" color="pink">Nuevo Alumno +</Button>
      <ToolbarButton
        class="md:hidden"
        onclick={toggle}
        aria-label="Abrir filtros"
        aria-expanded={!hidden}
      >
        <AdjustmentsHorizontalSolid class="h-5 w-5 text-gray-600" />
      </ToolbarButton>
    </div>
  {/snippet}
</Navbar>
