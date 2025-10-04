<script lang="ts">
  import { FilterKeys } from "$lib/enums/filter_keys";
  import { debounce } from "$lib/utils/utils";
  import { onMount, tick } from "svelte";
  import {
    Navbar,
    NavLi,
    NavUl,
    Search,
    Button,
    ToolbarButton,
    Select,
    Datepicker,

  } from "flowbite-svelte";
  import { AdjustmentsHorizontalSolid } from "flowbite-svelte-icons";
  import { ESTADO_PAGOS } from "$lib/catalog/estados_pagos";
  import { descargarPagos } from "$lib/services/api/pagos";

  // Layout constants keep responsive tweaks easy to tweak in one place.
  const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
  const SEARCH_INLINE_CLASS = "w-[240px]";
  const SELECT_INLINE_CLASS = "min-w-[160px]";
  const SELECT_STACKED_CLASS = "w-full min-w-[135px]";

  // Reactive state for the three filters + responsive layout toggle.
  let statusSelected = $state("all");
  let query = $state("");
  let filtersCollapsed = $state(true);
  // <P class="mt-4">Selected date: {selectedDate ? selectedDate.toLocaleDateString() : "None"}</P>

  // DOM refs used to calculate when the inline filters overflow.
  let filtersContainerEl: HTMLDivElement | undefined = $state();
  let measurementRowEl: HTMLDivElement | undefined = $state();

  // Callbacks opcionales que el padre puede pasar
  let { onSearch, debounceMs = 350, selectedDate = $bindable<Date | undefined>(new Date()) } = $props<{
    onSearch?: (key: FilterKeys, q: string) => void; // se llama (debounced) mientras escribe
    debounceMs?: number;
    selectedDate: Date | undefined;
  }>();
  let hasInteracted = $state(false);
  let inputEl: HTMLInputElement | undefined = $state();

  const notifyStatusFilter = () => {
    onSearch?.(FilterKeys.ESTADO_PAGO, statusSelected);
  };
  const notifyDateFilter = () => {
    onSearch?.(
      FilterKeys.DATE,
      selectedDate
    );
  };

  // Listener de teclado sobre el INPUT nativo (usando elementRef)
  $effect(() => {
    if (!inputEl) return;

    const onInput = () => {
      if (!hasInteracted) hasInteracted = true;
      debouncedSearch(query);
    };

    const handler = (e: KeyboardEvent) => {
      if (!hasInteracted) hasInteracted = true;
      if (e.key === "Enter") {
        e.preventDefault();
        onSearch?.(FilterKeys.SEARCH, query);
      }
    };
    inputEl.addEventListener("input", onInput);
    inputEl.addEventListener("keydown", handler);
    // cleanup al desmontar o cambiar el ref
    return () => {
      inputEl?.removeEventListener("keydown", handler);
      inputEl?.removeEventListener("input", onInput);
    };
  });
  const debouncedSearch = debounce(
    (q: string) => onSearch?.(FilterKeys.SEARCH, q),
    debounceMs
  );

  // Decide whether we render the inline row or the stacked drawer version.
  const updateCollapse = () => {
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia(DESKTOP_MEDIA_QUERY).matches;

    if (!isDesktop) {
      filtersCollapsed = true;
      return;
    }

    if (!filtersContainerEl || !measurementRowEl) {
      filtersCollapsed = false;
      return;
    }

    const available = filtersContainerEl.clientWidth;
    const required = measurementRowEl.scrollWidth;
    filtersCollapsed = required > available;
  };

  onMount(() => {
    let resizeObserver: ResizeObserver | undefined;

    tick().then(() => {
      updateCollapse();
      resizeObserver = new ResizeObserver(() => updateCollapse());
      if (filtersContainerEl) resizeObserver.observe(filtersContainerEl);
      window.addEventListener("resize", updateCollapse);
    });

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateCollapse);
    };
  });

  $effect(() => {
    updateCollapse();
  });
</script>

<Navbar class="px-0 py-0 sm:px-0 mb-4" breakpoint="lg">
  {#snippet children({ hidden, toggle, NavContainer })}
    <div class="order-0 w-full relative" bind:this={filtersContainerEl}>
      <!-- Hidden measurement row lets us detect when inline layout would wrap -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute -z-50 flex w-full flex-nowrap items-center gap-3 whitespace-nowrap opacity-0"
        bind:this={measurementRowEl}
      >
        <Search
          size="md"
          class={SEARCH_INLINE_CLASS}
          placeholder="Search..."
          bind:value={query}
          bind:elementRef={inputEl}
        />
        <Datepicker
          bind:value={selectedDate}
          onchange={() => onSearch?.(FilterKeys.DATE, selectedDate)}

        />

        <Select
          size="md"
          class={SELECT_INLINE_CLASS}
          items={ESTADO_PAGOS}
          bind:value={statusSelected}
          placeholder="Estado del pago:"
          onchange={notifyStatusFilter}
        />
      </div>

      <!-- Inline filters for desktop screens -->
      {#if !filtersCollapsed}
        <div
          class="flex w-full flex-nowrap items-center gap-3 whitespace-nowrap"
        >
          <Search
            size="md"
            class={SEARCH_INLINE_CLASS}
            placeholder="Search..."
            bind:value={query}
            bind:elementRef={inputEl}
          />
          <Datepicker bind:value={selectedDate} onselect={notifyDateFilter} />

          <Select
            size="md"
            class={SELECT_INLINE_CLASS}
            items={ESTADO_PAGOS}
            bind:value={statusSelected}
            placeholder="Estado del pago:"
            onchange={notifyStatusFilter}
          />
        </div>
      {/if}
    </div>

    <!-- Drawer-style filters for tablet & mobile -->
    {#if filtersCollapsed}
      <NavUl
        class="order-0 w-full md:w-auto"
        classes={{ ul: "flex flex-col items-stretch gap-3 p-2" }}
      >
        <NavLi class="w-full py-0 pe-0 ps-0">
          <Search
            size="md"
            class="w-full"
            placeholder="Search..."
            bind:value={query}
            bind:elementRef={inputEl}
          />
        </NavLi>
        <NavLi class="w-full py-0 pe-0 ps-0">
          <Datepicker bind:value={selectedDate} onselect={notifyDateFilter} />
        </NavLi>
        <NavLi class="w-full py-0 pe-0 ps-0">
          <Select
            size="md"
            class={SELECT_STACKED_CLASS}
            items={ESTADO_PAGOS}
            bind:value={statusSelected}
            placeholder="Estado del pago:"
            onchange={notifyStatusFilter}
          />
        </NavLi>
      </NavUl>
    {/if}

    <div class="flex md:order-1"></div>

    <div class="flex md:order-2 w-full md:w-auto">
      {#if filtersCollapsed}
        <div class="flex w-full justify-end pl-4 md:pl-0">
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
    <Button
      size="lg"
      color="pink"
      class="fixed top-2 right-[35px] z-50 w-auto"
      onclick={() => {
        descargarPagos();
      }}
    >
      Descargar historial
    </Button>
  {/snippet}
</Navbar>
