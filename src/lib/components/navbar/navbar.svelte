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
  import { UserRoundPlus } from "@lucide/svelte";

  const STYLES = {
    searchWidthDesktop: "w-[240px]",
    selectWidthDesktop: "min-w-[160px]",
    selectWidthMobile: "w-full min-w-[135px]",
  } as const;

  interface Props {
    onSearch?: (key: FilterKeys, value: string | Date) => void;
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

<Navbar class="px-0 py-0 sm:px-0 mb-4 w-full" breakpoint="lg">
  {#snippet children({ hidden, toggle })}
    <div
      class="order-0 w-full relative"
      bind:this={filter.refs.filterContainer.current}
    >
      <!-- DESKTOP: Inline -->
      {#if !filter.uiState.filtersCollapsed}
        <div
          class="flex w-full flex-nowrap items-center gap-3 whitespace-nowrap justify-between"
        >
          <div class="flex items-center gap-3">
            {@render filterGroup("desktop")}
          </div>
          <Button
            color="secondary"
            size="lg"
            onclick={newUserForm}
            class="flex gap-2 items-center"
          >
            Nuevo Alumno
            <UserRoundPlus size="22" />
          </Button>
        </div>
      {/if}

      <!-- MOBILE/TABLET: Colapsable -->
      {#if filter.uiState.filtersCollapsed}
        <NavUl
          class="order-0 w-full md:w-auto top-13"
          classes={{ ul: "flex flex-col items-stretch gap-3 p-2 top-200" }}
        >
          {@render filterGroup("mobile")}
        </NavUl>
      {/if}
    </div>

    <!-- Toggle filtros -->
    <div class="flex md:order-2 w-full md:w-auto">
      {#if filter.uiState.filtersCollapsed}
        <div class="flex w-full justify-between md:pl-0 gap-3">
          <Button
            color="secondary"
            size="lg"
            onclick={newUserForm}
            class="flex gap-2 items-center"
            >Nuevo Alumno
            <UserRoundPlus size="22" />
          </Button>
          <ToolbarButton
            class="inline-flex items-center"
            onclick={toggle}
            aria-label="Abrir filtros"
            aria-expanded={!hidden}
          >
            <AdjustmentsHorizontalSolid class="h-5 w-5 text-gray-600" />
          </ToolbarButton>
        </div>
      {/if}
    </div>
  {/snippet}
</Navbar>
