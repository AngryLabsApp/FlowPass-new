<script lang="ts">
  import { debounce } from "$lib/utils/utils";
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

  // Callbacks opcionales que el padre puede pasar
  let {
    onSearch,
    debounceMs = 350,
    query = $bindable(""),
  } = $props<{
    onSearch?: (q: string) => void; // se llama (debounced) mientras escribe
    debounceMs?: number;
    query: string;
  }>();
  let hasInteracted = $state(false);
  let inputEl: HTMLInputElement | undefined = $state();

  // util: debounce

  const debouncedSearch = debounce((q: string) => onSearch?.(q), debounceMs);

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
        onSearch?.(query);
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
          bind:value={query}
          bind:elementRef={inputEl}
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
      class="flex md:order-2 w-full md:w-auto flex-col md:flex-row md:items-center gap-2 md:gap-1 md:justify-end"
    >
      <Button size="lg" color="pink" class="w-full md:w-auto"
        >Nuevo Alumno +</Button
      >
      <ToolbarButton
        class="w-full md:hidden"
        onclick={toggle}
        aria-label="Abrir filtros"
        aria-expanded={!hidden}
      >
        <AdjustmentsHorizontalSolid class="h-5 w-5 text-gray-600" />
      </ToolbarButton>
    </div>
  {/snippet}
</Navbar>
