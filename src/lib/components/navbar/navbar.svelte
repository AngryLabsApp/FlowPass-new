<script lang="ts">
  import { ESTADO_PLANES } from "$lib/catalog/estados_planes";
  import type { FilterKeys } from "$lib/enums/filter_keys";
  import { useFilterNavbar } from "$lib/hooks/useFilterNavbar.svelte";
  import { newUserForm } from "$lib/services/api/users";
  import {
    Button,
    Navbar,
    NavLi,
    NavUl,
    Search,
    Select,
    ToolbarButton,
  } from "flowbite-svelte";
  import { AdjustmentsHorizontalSolid } from "flowbite-svelte-icons";

  const STYLES = {
    searchWidthDesktop: "w-[240px]",
    selectWidthDesktop: "min-w-[160px]",
    selectWidthMobile: "w-full min-w-[135px]",
  } as const;

  interface Props {
    onSearch?: (key: FilterKeys, value: string) => void;
    debounceMs?: number;
    PLANES_CATALOG?: { value: string; name: string }[];
  }

  let { onSearch, debounceMs = 350, PLANES_CATALOG = [] }: Props = $props();

  const filter = useFilterNavbar({
    onSearch,
    debounceMs,
  });
</script>

{#snippet searchInput(classes: string)}
  <Search
    size="md"
    class={classes}
    placeholder="Buscar..."
    bind:value={filter.filterState.query}
    bind:elementRef={filter.refs.input.current}
  />
{/snippet}

{#snippet statusSelect(classes: string)}
  <Select
    size="md"
    class={classes}
    items={ESTADO_PLANES}
    bind:value={filter.filterState.status}
    placeholder="Estado:"
    onchange={filter.handlers.status}
  />
{/snippet}

{#snippet planSelect(classes: string)}
  <Select
    size="md"
    class={classes}
    items={PLANES_CATALOG}
    bind:value={filter.filterState.plan}
    placeholder="Plan:"
    onchange={filter.handlers.plan}
  />
{/snippet}

{#snippet filterGroup(layout: "desktop" | "mobile")}
  {#if layout === "desktop"}
    {@render searchInput(STYLES.searchWidthDesktop)}
    {@render statusSelect(STYLES.selectWidthDesktop)}
    {@render planSelect(STYLES.selectWidthDesktop)}
  {:else}
    <NavLi class="w-full py-0 pe-0 ps-0">
      {@render searchInput("w-full")}
    </NavLi>
    <NavLi class="w-full py-0 pe-0 ps-0">
      {@render statusSelect(STYLES.selectWidthMobile)}
    </NavLi>
    <NavLi class="w-full py-0 pe-0 ps-0">
      {@render planSelect(STYLES.selectWidthMobile)}
    </NavLi>
  {/if}
{/snippet}

<Navbar class="px-0 py-0 sm:px-0 mb-4" breakpoint="lg">
  {#snippet children({ hidden, toggle })}
    <div
      class="order-0 w-full relative"
      bind:this={filter.refs.filterContainer.current}
    >
      <!-- Medición oculta -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -z-50 flex w-full flex-nowrap items-center gap-3 whitespace-nowrap opacity-0"
        bind:this={filter.refs.measurementRow.current}
      >
        {@render filterGroup("desktop")}
      </div>

      <!-- DESKTOP: Inline -->
      {#if !filter.uiState.filtersCollapsed}
        <div
          class="flex w-full flex-nowrap items-center gap-3 whitespace-nowrap"
        >
          {@render filterGroup("desktop")}

          {console.log("HAS ACTIVE FILTERS", filter.hasActiveFilters)}
          {#if filter.hasActiveFilters}
            <Button
              size="sm"
              color="orange"
              onclick={filter.resetFilters}
              class="whitespace-nowrap"
            >
              Limpiar
            </Button>
          {/if}
        </div>
      {/if}

      <!-- MOBILE/TABLET: Colapsable -->
      {#if filter.uiState.filtersCollapsed}
        <NavUl
          class="order-0 w-full md:w-auto"
          classes={{ ul: "flex flex-col items-stretch gap-3 p-2" }}
        >
          {@render filterGroup("mobile")}

          {#if filter.hasActiveFilters}
            <NavLi class="w-full py-0 pe-0 ps-0">
              <Button
                size="sm"
                color="light"
                onclick={filter.resetFilters}
                class="w-full"
              >
                Limpiar filtrossss
              </Button>
            </NavLi>
          {/if}
        </NavUl>
      {/if}
    </div>

    <!-- Espaciador -->
    <div class="flex md:order-1"></div>

    <!-- Toggle filtros -->
    <div class="flex md:order-2 w-full md:w-auto">
      {#if filter.uiState.filtersCollapsed}
        <div class="flex w-full justify-end gap-2 pl-4 md:pl-0">
          {#if filter.hasActiveFilters}
            <span
              class="inline-flex items-center rounded-full bg-primary-100 px-2.5 py-0.5 text-xs font-medium text-primary-800"
            >
              Filtros activos
            </span>
          {/if}

          <ToolbarButton
            class="inline-flex"
            onclick={toggle}
            aria-label="Abrir filtros"
            aria-expanded={!hidden}
          >
            <AdjustmentsHorizontalSolid class="h-5 w-5 text-gray-600" />
          </ToolbarButton>
        </div>
      {/if}
    </div>

    <!-- Acción principal -->
    <Button
      size="lg"
      color="pink"
      class="fixed top-2 right-[35px] z-50 w-auto"
      onclick={newUserForm}
    >
      Nuevo Alumno +
    </Button>
  {/snippet}
</Navbar>
