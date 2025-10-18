<script lang="ts">
  import { FilterKeys } from "$lib/enums/filter_keys";
  import { useFilterNavbar } from "$lib/hooks/useFilterNavbar.svelte";
  import { descargarPagos } from "$lib/services/api/pagos";
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
  import MonthPicker from "$lib/components/month_picker/month_picker.svelte";
  import { FileDown } from "@lucide/svelte";

  import { ESTADO_PAGOS } from "$lib/catalog/estados_pagos";

  const STYLES = {
    searchWidthDesktop: "w-[240px]",
    selectWidthDesktop: "min-w-[190px]",
    selectWidthMobile: "w-full min-w-[150x]",
  } as const;

  interface Props {
    onSearch?: (key: FilterKeys, value: string | Date) => void;
    debounceMs?: number;
    selectedDate?: Date;
  }

  let {
    onSearch,
    debounceMs = 350,
    selectedDate = $bindable<Date | undefined>(new Date()),
  }: Props = $props();

  const filter = useFilterNavbar({
    onSearch,
    debounceMs,
    filterKeys: {
      status: FilterKeys.ESTADO_PAGO,
      date: FilterKeys.DATE,
    },
    defaultValues: {
      date: selectedDate ?? new Date(),
      status: "all",
    },
  });

  function handleDateChange() {
    selectedDate = filter.filterState.date;
    filter.handlers.date();
  }

  $effect(() => {
    if (!selectedDate) return;
    const current = filter.filterState.date;
    if (!current || current.getTime() !== selectedDate.getTime()) {
      filter.filterState.date = selectedDate;
    }
  });
</script>

{#snippet searchInput(classes: string)}
  <Search
    size="md"
    class={classes}
    placeholder="Buscar por nombre, email o código"
    bind:value={filter.filterState.query}
    bind:elementRef={filter.refs.input.current}
  />
{/snippet}

{#snippet statusSelect(classes: string)}
  <Select
    size="md"
    class={classes}
    items={ESTADO_PAGOS}
    bind:value={filter.filterState.status}
    placeholder="Estado del pago:"
    onchange={filter.handlers.status}
  />
{/snippet}

{#snippet dateSelect(classes: string)}
  <!-- <Datepicker
    class={classes}
    bind:value={filter.filterState.date}
    onchange={handleDateChange}
    onselect={handleDateChange}
  />
-->
  <MonthPicker
    onChange={filter.onMonthChange}
    bind:value={filter.filterState.date}
  ></MonthPicker>
{/snippet}

{#snippet filterGroup(layout: "desktop" | "mobile")}
  {#if layout === "desktop"}
    {@render searchInput(STYLES.searchWidthDesktop)}
    {@render dateSelect(STYLES.selectWidthDesktop)}
    {@render statusSelect(STYLES.selectWidthDesktop)}
  {:else}
    <NavLi class="w-full py-0 pe-0 ps-0">
      {@render searchInput("w-full")}
    </NavLi>
    <NavLi class="w-full py-0 pe-0 ps-0">
      {@render dateSelect(STYLES.selectWidthMobile)}
    </NavLi>
    <NavLi class="w-full py-0 pe-0 ps-0">
      {@render statusSelect(STYLES.selectWidthMobile)}
    </NavLi>
  {/if}
{/snippet}

<Navbar class="px-0 py-0 sm:px-0 w-full" breakpoint="lg">
  {#snippet children({ hidden, toggle })}
    <div
      class="order-0 w-full relative"
      bind:this={filter.refs.filterContainer.current}
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -z-50 flex w-full flex-nowrap items-center gap-3 whitespace-nowrap opacity-0"
        bind:this={filter.refs.measurementRow.current}
      >
        {@render searchInput(STYLES.searchWidthDesktop)}
        {@render dateSelect(STYLES.selectWidthDesktop)}
        {@render statusSelect(STYLES.selectWidthDesktop)}
      </div>
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
            class="flex gap-2 items-center"
            onclick={descargarPagos}
          >
            Descargar Historial
            <FileDown size="22" />
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
            class="flex gap-2 items-center"
            onclick={descargarPagos}
          >
            Descargar Historial
            <FileDown size="22" />
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
