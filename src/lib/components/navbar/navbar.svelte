<script lang="ts">
  import { ESTADO_PLANES } from "$lib/catalog/estados_planes";
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
  } from "flowbite-svelte";
  import { AdjustmentsHorizontalSolid } from "flowbite-svelte-icons";

  // Layout constants keep responsive tweaks easy to tweak in one place.
  const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";
  const SEARCH_INLINE_CLASS = "w-[240px]";
  const SELECT_INLINE_CLASS = "min-w-[160px]";
  const SELECT_STACKED_CLASS = "w-full min-w-[135px]";

  // Reactive state for the three filters + responsive layout toggle.
  let statusSelected = $state("all");
  let planSelected = $state("all");
  let query = $state("");
  let filtersCollapsed = $state(true);

  // DOM refs used to calculate when the inline filters overflow.
  let filtersContainerEl: HTMLDivElement | undefined = $state();
  let measurementRowEl: HTMLDivElement | undefined = $state();

  // Static plan options until we load them from the backend.
  const PLAN_OPTIONS = [
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

  // Callbacks opcionales que el padre puede pasar
  let { onSearch, debounceMs = 350 } = $props<{
    onSearch?: (key: FilterKeys, q: string) => void; // se llama (debounced) mientras escribe
    debounceMs?: number;
  }>();
  let hasInteracted = $state(false);
  let inputEl: HTMLInputElement | undefined = $state();

  // util: debounce

  // Fire search callback with a tiny delay so we don't spam requests.
  const debouncedSearch = debounce(
    (q: string) => onSearch?.(FilterKeys.SEARCH, q),
    debounceMs
  );

  // Convenience helpers so template remains tidy.
  const notifyStatusFilter = () => {
    onSearch?.(FilterKeys.ESTADO, statusSelected);
  };

  const notifyPlanFilter = () => {
    onSearch?.(FilterKeys.PLAN, planSelected);
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

  onMount(async () => {
    await tick();
    updateCollapse();
    const resizeObserver = new ResizeObserver(() => updateCollapse());
    if (filtersContainerEl) resizeObserver.observe(filtersContainerEl);
    window.addEventListener("resize", updateCollapse);
    return () => {
      resizeObserver.disconnect();
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
        />
        <Select
          size="md"
          class={SELECT_INLINE_CLASS}
          items={ESTADO_PLANES}
          bind:value={statusSelected}
          placeholder="Estado:"
        />
        <Select
          size="md"
          class={SELECT_INLINE_CLASS}
          items={PLAN_OPTIONS}
          bind:value={planSelected}
          placeholder="Plan:"
        />
        <Button size="lg" color="pink" class="ms-auto shrink-0">Nuevo Alumno +</Button>
      </div>

      <!-- Inline filters for desktop screens -->
      {#if !filtersCollapsed}
        <div class="flex w-full flex-nowrap items-center gap-3 whitespace-nowrap">
          <Search
            size="md"
            class={SEARCH_INLINE_CLASS}
            placeholder="Search..."
            bind:value={query}
            bind:elementRef={inputEl}
          />
          <Select
            size="md"
            class={SELECT_INLINE_CLASS}
            items={ESTADO_PLANES}
            bind:value={statusSelected}
            placeholder="Estado:"
            onchange={notifyStatusFilter}
          />
          <Select
            size="md"
            class={SELECT_INLINE_CLASS}
            items={PLAN_OPTIONS}
            bind:value={planSelected}
            placeholder="Plan:"
            onchange={notifyPlanFilter}
          />
          <Button size="lg" color="pink" class="ms-auto shrink-0">Nuevo Alumno +</Button>
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
          <Select
            size="md"
            class={SELECT_STACKED_CLASS}
            items={ESTADO_PLANES}
            bind:value={statusSelected}
            placeholder="Estado:"
            onchange={notifyStatusFilter}
          />
        </NavLi>
        <NavLi class="w-full py-0 pe-0 ps-0">
          <Select
            size="md"
            class={SELECT_STACKED_CLASS}
            items={PLAN_OPTIONS}
            bind:value={planSelected}
            placeholder="Plan:"
            onchange={notifyPlanFilter}
          />
        </NavLi>
        <NavLi class="w-full py-0 pe-0 ps-0">
          <Button size="lg" color="pink" class="w-full">Nuevo Alumno +</Button>
        </NavLi>
      </NavUl>
    {/if}

    <div class="flex md:order-1"></div>

    <div class="flex md:order-2 w-full md:w-auto justify-end">
      {#if filtersCollapsed}
        <ToolbarButton
          class="inline-flex ms-auto"
          onclick={toggle}
          aria-label="Abrir filtros"
          aria-expanded={!hidden}
        >
          <AdjustmentsHorizontalSolid class="h-5 w-5 text-gray-600" />
        </ToolbarButton>
      {/if}
    </div>
  {/snippet}
</Navbar>
